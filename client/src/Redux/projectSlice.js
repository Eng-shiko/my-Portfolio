import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api'; 

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/projects');
            return response.data.data ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await API.post('/projects/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/projects/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/projects/${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        isModalOpen: false,
        editId: null,
        project: {
            title: '',
            description: '',
            githubUrl: '',
            liveUrl: '',
            technology: []
        },
        imageFile: null,
        loading: false,
        error: null
    },
    reducers: {
        openAddModal: (state) => {
            state.isModalOpen = true;
            state.editId = null;
            state.project = { title: '', description: '', githubUrl: '', liveUrl: '', technology: [] };
            state.imageFile = null;
        },
        openEditModal: (state, action) => {
            state.isModalOpen = true;
            state.editId = action.payload._id;
            state.project = {
                title: action.payload.title || '',
                description: action.payload.description || '',
                githubUrl: action.payload.githubUrl || '',
                liveUrl: action.payload.liveUrl || '',
                technology: action.payload.technology || []
            };
            state.imageFile = null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.editId = null;
        },
        setFormField: (state, action) => {
            state.project[action.payload.field] = action.payload.value;
        },
        setImageFile: (state, action) => {
            state.imageFile = action.payload;
        },
        addTechnology: (state, action) => {
            if (!state.project.technology.includes(action.payload)) {
                state.project.technology.push(action.payload);
            }
        },
        removeTechnology: (state, action) => {
            state.project.technology = state.project.technology.filter((_, idx) => idx !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.projects = action.payload; })
            .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Create
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
                state.isModalOpen = false;
            })

            // Update
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                state.isModalOpen = false;
            })

            // Delete
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p._id !== action.payload);
            });
    }
});

export const {
    openAddModal,
    openEditModal,
    closeModal,
    setFormField,
    setImageFile,
    addTechnology,
    removeTechnology
} = projectSlice.actions;

export default projectSlice.reducer;