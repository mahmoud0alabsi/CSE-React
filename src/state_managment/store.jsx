import { configureStore, createSlice } from '@reduxjs/toolkit';
import collaborativeReducer from './collaborativeSlice';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    collaborative: collaborativeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
