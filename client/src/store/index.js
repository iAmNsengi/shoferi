import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import driverSlice from "./slices/driverSlice";
import bookingSlice from "./slices/bookingSlice";
import jobSlice from "./slices/jobSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    driver: driverSlice,
    booking: bookingSlice,
    jobs: jobSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
