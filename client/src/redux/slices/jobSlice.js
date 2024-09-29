import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createJobAction = createAsyncThunk(
  "jobs/add",
  async (jobData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
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

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
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
      });
  },
});

export default jobSlice.reducer;
