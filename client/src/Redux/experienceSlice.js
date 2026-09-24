import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

/// 1. Fetch all experiences
export const fetchExperiences = createAsyncThunk(
    'experiences/fetchExperiences',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/experience');
            return response.data.experiences ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/// 2. Post new experience
export const postExperience = createAsyncThunk(
    'experiences/createExperience',
    async (expData, { rejectWithValue }) => {
        try {
            const response = await API.post('/experience/add', expData);
            return response.data.experience;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/// 3. Update experience
export const updateExperience = createAsyncThunk(
    'experiences/updateExperience',
    async ({ id, expData }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/experience/${id}`, expData);
            return response.data.experience ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/// 4. Delete experience
export const deleteExperience = createAsyncThunk(
    'experiences/deleteExperience',
    async ({ id }, { rejectWithValue }) => {
        try {
            await API.delete(`/experience/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const ExperienceSlice = createSlice({
    name: 'experiences',
    initialState: {
        experiences: [],
        isModalOpen: false,
        editId: null,
        experience: {
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        },
        loading: false,
        error: null,
    },
    reducers: {
        OpenAddModal: (state) => {
            state.isModalOpen = true;
            state.editId = null;
            state.experience = {
                jobTitle: '',
                company: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
            };
        },
        OpenEditModal: (state, action) => {
            state.isModalOpen = true;
            state.editId = action.payload._id || action.payload.id;
            state.experience = {
                jobTitle: action.payload.jobTitle || action.payload.title || '',
                company: action.payload.company || '',
                startDate: action.payload.startDate || '',
                endDate: action.payload.endDate || '',
                current: action.payload.current ?? action.payload.isCurrent ?? false,
                description: action.payload.description || '',
            };
        },
        CloseModal: (state) => {
            state.isModalOpen = false;
            state.editId = null;
        },
        setFormField: (state, action) => {
            state.experience[action.payload.field] = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchExperiences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExperiences.fulfilled, (state, action) => {
                state.loading = false;
                state.experiences = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchExperiences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(postExperience.fulfilled, (state, action) => {
                state.loading = false;
                const newExp = action.payload;
                if (Array.isArray(state.experiences)) {
                    state.experiences.push(newExp);
                } else {
                    state.experiences = [newExp];
                }
                state.isModalOpen = false;
                state.experience = {
                    jobTitle: '',
                    company: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                };
            })
            .addCase(postExperience.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateExperience.fulfilled, (state, action) => {
                state.loading = false;
                const updatedExp = action.payload;
                const index = state.experiences.findIndex(
                    e => (e._id || e.id) === (updatedExp._id || updatedExp.id)
                );
                if (index !== -1) {
                    state.experiences[index] = updatedExp;
                }
                state.isModalOpen = false;
            })
            .addCase(updateExperience.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteExperience.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.experiences = state.experiences.filter(e => (e._id || e.id) !== deletedId);
            })
            .addCase(deleteExperience.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    OpenAddModal,
    OpenEditModal,
    CloseModal,
    setFormField
} = ExperienceSlice.actions;

export default ExperienceSlice.reducer;