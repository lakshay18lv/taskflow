import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getApiError } from '../../api/client';
import { bumpProjectStats } from './projectsSlice';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (projectId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/projects/${projectId}/tasks`);
    return { projectId, tasks: data.tasks };
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async ({ projectId, title, dueDate }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post(`/projects/${projectId}/tasks`, { title, dueDate });
    dispatch(bumpProjectStats({ projectId, mode: 'add' }));
    return data.task;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const toggleTask = createAsyncThunk('tasks/toggleTask', async (task, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/tasks/${task.id}/toggle`);
    const completedDelta = data.task.status === 'completed' ? 1 : -1;
    dispatch(bumpProjectStats({ projectId: data.task.project_id, completedDelta }));
    return data.task;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (task, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${task.id}`);
    dispatch(
      bumpProjectStats({
        projectId: task.project_id,
        mode: 'remove',
        completedDelta: task.status === 'completed' ? -1 : 0,
      })
    );
    return task.id;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    byProject: {},
    loading: false,
    saving: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.byProject[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.saving = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.saving = false;
        const projectId = action.payload.project_id;
        state.byProject[projectId] = [action.payload, ...(state.byProject[projectId] || [])];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const projectId = action.payload.project_id;
        state.byProject[projectId] = (state.byProject[projectId] || []).map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        Object.keys(state.byProject).forEach((projectId) => {
          state.byProject[projectId] = state.byProject[projectId].filter((task) => task.id !== action.payload);
        });
      });
  },
});

export default tasksSlice.reducer;
