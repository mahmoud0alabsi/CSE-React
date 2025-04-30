import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messagesByProject: {} // { [projectId]: message[] }
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const { projectId, message } = action.payload;
            if (!state.messagesByProject[projectId]) {
                state.messagesByProject[projectId] = [];
            }
            state.messagesByProject[projectId].push(message);
        },
        setMessages: (state, action) => {
            const { projectId, messages } = action.payload;
            state.messagesByProject[projectId] = messages;
        },
        clearProjectMessages: (state, action) => {
            const { projectId } = action.payload;
            delete state.messagesByProject[projectId];
        }
    }
});

export const { addMessage, setMessages, clearProjectMessages } = chatSlice.actions;
export default chatSlice.reducer;
