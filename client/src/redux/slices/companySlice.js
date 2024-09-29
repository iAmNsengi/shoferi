import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../../utils/baseUrl';

// Register Company

export const registerCompanyAction = createAsyncThunk(
  'company/register',
  async (company, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/companies/register`,
        company,
        config
      );
      localStorage.setItem('companyInfo', JSON.stringify(data));
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

export const loginCompanyAction = createAsyncThunk(
  'company/login',
  async (company, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/companies/login`,
        company,
        config
      );
      localStorage.setItem('companyInfo', JSON.stringify(data));
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
const loginCompany = JSON.parse(localStorage.getItem('companyInfo'));
const companySlice = createSlice({
  name: 'company',
  initialState: {
    company: loginCompany,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerCompanyAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerCompanyAction.fulfilled, (state, action) => {
      state.loading = false;
      state.company = action.payload;
    });
    builder.addCase(registerCompanyAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(loginCompanyAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginCompanyAction.fulfilled, (state, action) => {
      state.loading = false;
      state.company = action.payload;
    });
    builder.addCase(loginCompanyAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export default companySlice.reducer;
