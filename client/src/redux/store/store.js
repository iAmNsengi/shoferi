import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import companyReducer from '../slices/companySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    company: companyReducer,
  },
});
