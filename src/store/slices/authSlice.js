import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getApiError, setAuthToken } from '../../api/client';

const SESSION_KEY = 'taskflow_session';

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const saved = await AsyncStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const session = JSON.parse(saved);
    setAuthToken(session.token);
    return session;
  } catch (error) {
    return rejectWithValue('Could not restore session.');
  }
});

export const requestOtp = createAsyncThunk('auth/requestOtp', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/request-otp', payload);
    return data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/verify-otp', payload);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data));
    setAuthToken(data.token);
    return data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
  setAuthToken(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    pendingEmail: '',
    devOtp: '',
    loading: false,
    booting: true,
    error: '',
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.booting = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.booting = false;
      })
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEmail = action.meta.arg.email;
        state.devOtp = action.payload.devOtp || '';
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.devOtp = '';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.pendingEmail = '';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
