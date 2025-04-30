import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { handleGetBranches } from '../api/branch/handlers';
import { handleGetLatestCommitFilesByBranch, handleGetAllCommitsByBranch } from '../api/commit/handlers';

// Async thunks for fetching data
export const fetchBranchesAsync = createAsyncThunk(
  'collaborative/fetchBranches',
  async (projectId) => {
    const response = await handleGetBranches(projectId);
    if (response.success) {
      return response.data.map((b) => {
        return {
          id: b.id,
          name: b.name,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
          status: 'fetched',
        };
      });
    } else {
      console.error(response.message);
      throw new Error('Failed to fetch branches');
    }
  }
);

export const fetchFilesAsync = createAsyncThunk(
  'collaborative/fetchFiles',
  async ({ projectId, branchId }, { getState, rejectWithValue }) => {
    const state = getState();
    const alreadyFetched = state.collaborative.fetchedBranches?.[branchId];

    if (alreadyFetched) {
      return rejectWithValue({ skipped: true });
    }

    try {
      const result = await handleGetLatestCommitFilesByBranch(projectId, branchId, true);
      if (result.success) {
        return { branchId, files: result.data };
      } else {
        console.error(result.message);
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      return rejectWithValue({ error: err.message });
    }
  }
);

export const fetchCommitFilesAsync = createAsyncThunk(
  'collaborative/fetchCommitFiles',
  async ({ projectId, branchId }, { rejectWithValue }) => {
    try {
      const result = await handleGetLatestCommitFilesByBranch(projectId, branchId, true);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    } catch (err) {
      console.error('Error fetching commit files:', err);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBranchCommitsHistoryAsync = createAsyncThunk(
  'collaborative/fetchBranchCommitsHistory',
  async ({ projectId, branchId }, { rejectWithValue }) => {
    try {
      const result = await handleGetAllCommitsByBranch(projectId, branchId);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const collaborativeSlice = createSlice({
  name: 'collaborative',
  initialState: {
    projectId: null,
    role: null,
    branches: [],
    fetchedBranches: {},
    filesByBranch: {}, // { branchId: [files] }

    selectedBranchId: null,
    selectedFile: null,

    commitFiles: [], // Store server commit files
    commitComparison: [], // Store comparison results

    commitsHistory: [],

    code: '',

    editorLoading: false,

    status: 'idle',
    error: null,
  },
  reducers: {
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },

    addBranch: (state, action) => {
      state.branches.push(action.payload);
    },
    addFile: (state, action) => {
      const { branchId, file } = action.payload;
      if (!state.filesByBranch[branchId]) {
        state.filesByBranch[branchId] = [];
      }
      state.filesByBranch[branchId].push(file);
    },
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    setFiles: (state, action) => {
      const { branchId, files } = action.payload;
      state.filesByBranch[branchId] = files;
    },

    setSelectedBranchId: (state, action) => {
      state.selectedBranchId = action.payload;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },

    updateSelectedFileContent: (state, action) => {
      const branchId = state.selectedBranchId;
      const selectedFile = state.selectedFile;
      const selectedFileId = selectedFile?.id;
      const code = state.code;
      if (selectedFile && selectedFileId) {
        if (state.filesByBranch[branchId]) {
          state.filesByBranch[branchId].forEach((file, index) => {
            if (file.id === selectedFileId) {
              file.content = code;
            }
          });
        }
      }
    },

    setCommitComparison: (state, action) => {
      state.commitComparison = action.payload;
    },

    addCommitHistory: (state, action) => {
      const { branchId, commit } = action.payload;
      try {
        if (!branchId || !commit) {
          return;
        }
        state.commitsHistory.push(commit);
      } catch (error) {
      }
    },

    setCode: (state, action) => {
      const { code } = action.payload;
      state.code = code;
    },

    setEditorLoading: (state, action) => {
      state.editorLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranchesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranchesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.branches = action.payload;
      })
      .addCase(fetchBranchesAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      })
      .addCase(fetchFilesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const { branchId, files } = action.payload;

        if (!state.filesByBranch[branchId]) {
          state.filesByBranch[branchId] = [];
        }
        state.filesByBranch[branchId].push(...files);
        state.fetchedBranches[branchId] = true; // Mark branch as fetched
      })
      .addCase(fetchFilesAsync.rejected, (state, action) => {
        if (action.payload?.skipped) {
          state.status = 'idle';
          return;
        }

        state.status = 'error';
        state.error = action.error.message;
      })
      .addCase(fetchCommitFilesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommitFilesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.commitFiles = action.payload;
      })
      .addCase(fetchCommitFilesAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(fetchBranchCommitsHistoryAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranchCommitsHistoryAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.commitsHistory = action.payload;
      })
      .addCase(fetchBranchCommitsHistoryAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export const {
  setProjectId,
  setRole,

  addBranch,
  addFile,
  setBranches,
  setFiles,

  setSelectedBranchId,
  setSelectedFile,

  updateSelectedFileContent,

  setCommitComparison,

  addCommitHistory,

  setCode,
  removeCode,

  setEditorLoading,
} = collaborativeSlice.actions;

export default collaborativeSlice.reducer;