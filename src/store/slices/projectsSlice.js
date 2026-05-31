import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getApiError } from '../../api/client';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/projects');
    return data.projects;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const createProject = createAsyncThunk('projects/createProject', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/projects', payload);
    return data.project;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (projectId, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${projectId}`);
    return projectId;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: '',
  },
  reducers: {
    bumpProjectStats: (state, action) => {
      const { projectId, mode, completedDelta = 0 } = action.payload;
      const project = state.items.find((item) => item.id === projectId);
      if (!project) return;
      if (mode === 'add') project.task_count += 1;
      if (mode === 'remove') project.task_count = Math.max(0, project.task_count - 1);
      project.completed_count = Math.max(0, project.completed_count + completedDelta);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.saving = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((project) => project.id !== action.payload);
      });
  },
});

export const { bumpProjectStats } = projectsSlice.actions;
export default projectsSlice.reducer;
