import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../../utils/baseUrl';

const loginCompany = JSON.parse(localStorage.getItem('companyInfo'));
const loginUser = JSON.parse(localStorage.getItem('userInfo'));

export const createJobAction = createAsyncThunk(
  'jobs/add',
  async (jobData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginCompany?.token}`,
      },
    };
    try {
      const { data } = await axios.post(`${baseURL}/jobs/add`, jobData, config);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      } else {
        return rejectWithValue(error?.response?.data?.message);
      }
    }
  }
);

export const applyJobAction = createAsyncThunk(
  'job/apply',
  async (jobId, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginUser.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/jobs/apply/${jobId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      } else {
        return rejectWithValue(error?.response?.data?.message);
      }
    }
  }
);
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    // company: loginCompany,
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJobAction.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload.data);
      })
      .addCase(createJobAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyJobAction.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(applyJobAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
