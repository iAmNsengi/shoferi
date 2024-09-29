import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
// ------- create a Register actionType using asyncthunk ------



export const registerUserAction = createAsyncThunk(
  "user/register",
  async (user, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/auth/register`,
        user,
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
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

// ---------- Create a login action type using asynchthunk --------

export const loginUserActionType = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${baseURL}/auth/login`,
        userData,
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
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

// ------------------ User logout action --------

export const logoutUserAction = createAsyncThunk(
  "user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// ----- get the user from localStorage -------

const userFromLocalStorage = JSON.parse(localStorage.getItem("userInfo"));

// ----------- Create a user slice ------

const userSlice = createSlice({
  name: "user",
  initialState: {
    auth: userFromLocalStorage,
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.auth = action.payload;
      state.error = undefined;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    // reducers for login user.
    builder.addCase(loginUserActionType.pending, (state, action) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(loginUserActionType.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action?.payload;
      state.error = undefined;
    });
    builder.addCase(loginUserActionType.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
    });

    // User logout Reducer
    builder.addCase(logoutUserAction.pending, (state, action) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(logoutUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = undefined;
      state.error = undefined;
    });
    builder.addCase(logoutUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
    });
  },
});

export default userSlice.reducer;
