import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchBio = createAsyncThunk(
    'bio/fetchBio',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/bio');
            return response.data.bio;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.response?.data || error.message;
            return rejectWithValue(typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage);
        }
    }
);

export const updateBio = createAsyncThunk(
    'bio/updateBio',
    async (bioData, { rejectWithValue }) => {
        try {
            const response = await API.put('/bio/update', bioData);
            return response.data.bio ;
        } catch (error) {
            const errMessage = error.response?.data?.message || error.response?.data || error.message;
            return rejectWithValue(typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage);
        }
    }
);

const bioSlice = createSlice({
    name: 'bio',
    initialState: {
        bio: {
            name: '',
            headline: '',
            aboutText: '',
            resumeUrl: '',
            github: '',
            linkedin: ''
        },
        loading: false,
        error: null
    },
    reducers: {
        setBioField: (state, action) => {
            state.bio[action.payload.field] = action.payload.value;
        },
        setBioData: (state, action) => {
            state.bio = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Bio
            .addCase(fetchBio.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBio.fulfilled, (state, action) => {
                state.loading = false;
                state.bio = action.payload || state.bio;
            })
            .addCase(fetchBio.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Bio
            .addCase(updateBio.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBio.fulfilled, (state, action) => {
                state.loading = false;
                state.bio = action.payload;
            })
            .addCase(updateBio.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setBioField, setBioData, clearError } = bioSlice.actions;
export default bioSlice.reducer;