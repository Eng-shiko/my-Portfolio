import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../services/api';

export const fetchMessage = createAsyncThunk(
    'message/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/messages');
            return response.data.messages;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.response?.data || error.message;
            return rejectWithValue(typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage);
        }
    }
);

export const createMessage = createAsyncThunk(
    'message/create',
    async (messageData, { rejectWithValue }) => {
        try {
            const response = await API.post('/messages/message', messageData);
            return response.data.message ;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.response?.data || error.message;
            return rejectWithValue(typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage);
        }
    }
);

export const updateStatus = createAsyncThunk(
    'message/update',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/messages/${id}`);
            return response.data.message ;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.response?.data || error.message;
            return rejectWithValue(typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage);
        }
    }
);

export const deleteMessage = createAsyncThunk(
    'message/delete',
    async ({ id }, { rejectWithValue }) => {
        try {
            await API.delete(`/messages/delete/${id}`);
            return id;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.response?.data || error.message;
            return rejectWithValue(typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage);
        }
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        message: {
            name: '',
            email: '',
            message: '',
            isRead: false
        },
        editId: null,
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetMessageForm: (state) => {
            state.message = {
                name: '',
                email: '',
                message: '',
                isRead: false
            };
        },
        setSelectedMessage: (state, action) => {
            state.message = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Messages ---
            .addCase(fetchMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Create Message ---
            .addCase(createMessage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.messages.unshift(action.payload);
                }
            })

            // --- Update Message Status ---
            .addCase(updateStatus.fulfilled, (state, action) => {
                const updatedMsg = action.payload;
                if (updatedMsg) {
                    const index = state.messages.findIndex(m => (m._id || m.id) === (updatedMsg._id || updatedMsg.id));
                    if (index !== -1) {
                        state.messages[index] = updatedMsg;
                    }
                }
            })

            // --- Delete Message ---
            .addCase(deleteMessage.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.messages = state.messages.filter(m => (m._id || m.id) !== deletedId);
            });
    }
});

export const { clearError, resetMessageForm, setSelectedMessage } = messageSlice.actions;
export default messageSlice.reducer;