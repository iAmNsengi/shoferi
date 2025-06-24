import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingAPI } from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.create(bookingData);
      toast.success("Booking created successfully!");
      return response.data.booking;
    } catch (error) {
      const message =
        error.response?.data?.message || "Booking creation failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getUserBookings();
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const fetchDriverBookings = createAsyncThunk(
  "booking/fetchDriverBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getDriverBookings();
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.updateStatus(bookingId, status);
      toast.success(`Booking ${status} successfully!`);
      return response.data.booking;
    } catch (error) {
      const message = error.response?.data?.message || "Status update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addBookingReview = createAsyncThunk(
  "booking/addReview",
  async ({ bookingId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.addReview(bookingId, reviewData);
      toast.success("Review added successfully!");
      return response.data.booking;
    } catch (error) {
      const message =
        error.response?.data?.message || "Review submission failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    userBookings: [],
    driverBookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    stats: {
      total: 0,
      pending: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    updateBookingInList: (state, action) => {
      const updatedBooking = action.payload;
      const userIndex = state.userBookings.findIndex(
        (b) => b._id === updatedBooking._id
      );
      const driverIndex = state.driverBookings.findIndex(
        (b) => b._id === updatedBooking._id
      );

      if (userIndex !== -1) {
        state.userBookings[userIndex] = updatedBooking;
      }
      if (driverIndex !== -1) {
        state.driverBookings[driverIndex] = updatedBooking;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings.unshift(action.payload);
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
        state.error = null;

        // Update stats
        state.stats = action.payload.reduce(
          (acc, booking) => {
            acc.total++;
            acc[booking.status] = (acc[booking.status] || 0) + 1;
            return acc;
          },
          { total: 0, pending: 0, accepted: 0, completed: 0, cancelled: 0 }
        );
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch driver bookings
      .addCase(fetchDriverBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDriverBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.driverBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchDriverBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update booking status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.driverBookings.findIndex(
          (b) => b._id === updatedBooking._id
        );
        if (index !== -1) {
          state.driverBookings[index] = updatedBooking;
        }
      })
      // Add review
      .addCase(addBookingReview.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.userBookings.findIndex(
          (b) => b._id === updatedBooking._id
        );
        if (index !== -1) {
          state.userBookings[index] = updatedBooking;
        }
      });
  },
});

export const {
  clearError,
  setCurrentBooking,
  clearCurrentBooking,
  updateBookingInList,
} = bookingSlice.actions;

export default bookingSlice.reducer;
