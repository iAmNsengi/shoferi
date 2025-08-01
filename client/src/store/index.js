import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (userData, token) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (userData) => set({ user: userData }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// UI Store
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));

// Job Store
export const useJobStore = create((set) => ({
  jobs: [],
  currentJob: null,
  filters: {
    location: "",
    category: "",
    salary: "",
    experience: "",
  },

  setJobs: (jobs) => set({ jobs }),
  setCurrentJob: (job) => set({ currentJob: job }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () =>
    set({
      filters: {
        location: "",
        category: "",
        salary: "",
        experience: "",
      },
    }),
}));

// Booking Store
export const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,

  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  addBooking: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),
  updateBooking: (id, updates) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
}));
