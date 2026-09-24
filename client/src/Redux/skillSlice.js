import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

/// Fetch all skills (Handles response.data.skills, response.data.data, or direct array)
export const fetchSkills = createAsyncThunk(
    'skills/fetchSkill',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/skills');
            return response.data.skills ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/// Post new skill
export const postSkills = createAsyncThunk(
    'skills/createSkill',
    async (skillData, { rejectWithValue }) => {
        try {
            const response = await API.post('/skills/add', skillData);
            return response.data.skills ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/// Update skill
export const updateSkill = createAsyncThunk(
    'skills/updateSkill',
    async ({ id, skillData }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/skills/${id}`, skillData);
            return response.data.skills ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteSkill = createAsyncThunk(
    'skills/deleteSkill',
    async ({ id }, { rejectWithValue }) => {
        try {
            await API.delete(`/skills/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/// Skill slice reducer 
const SkillSlice = createSlice({
    name: 'Skills',
    initialState: {
        skills: [],
        isModalOpen: false,
        editId: null,
        skill: {
            name: '',
            category: '',
            proficiency: 85,
        },
        loading: false,
        error: null
    },
    reducers: {
        OpenAddModal: (state) => {
            state.isModalOpen = true;
            state.editId = null;
            state.skill = { name: '', category: '', proficiency: 85 };
        },
        OpenEditModal: (state, action) => {
            state.isModalOpen = true;
            state.editId = action.payload._id || action.payload.id;
            state.skill = {
                name: action.payload.name || action.payload.title || '',
                category: action.payload.category || action.payload.type || '',
                proficiency: action.payload.proficiency || action.payload.level || 85,
            };
        },
        CloseModal: (state) => {
            state.isModalOpen = false;
            state.editId = null;
        },
        setFormField: (state, action) => {
            state.skill[action.payload.field] = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder
            /// Fetch
            .addCase(fetchSkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                // Ensures skills is always an array
                state.skills = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create 
            .addCase(postSkills.fulfilled, (state, action) => {
                state.loading = false;
                const newSkill = action.payload;
                if (Array.isArray(state.skills)) {
                    state.skills.push(newSkill);
                } else {
                    state.skills = [newSkill];
                }
                state.isModalOpen = false;
            })
            // Update
            .addCase(updateSkill.fulfilled, (state, action) => {
                state.loading = false;
                const updatedSkill = action.payload;
                const index = state.skills.findIndex(
                    p => (p._id || p.id) === (updatedSkill._id || updatedSkill.id)
                );
                if (index !== -1) {
                    state.skills[index] = updatedSkill;
                }
                state.isModalOpen = false;
            })
            // Delete
            .addCase(deleteSkill.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.skills = state.skills.filter(p => (p._id || p.id) !== deletedId);
            });
    }
});

export const {
    OpenAddModal,
    OpenEditModal,
    CloseModal,
    setFormField
} = SkillSlice.actions;

export default SkillSlice.reducer;