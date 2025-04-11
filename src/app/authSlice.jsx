import { createSlice } from "@reduxjs/toolkit";

// Initial state includes user data and token, with fallback to localStorage for token
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

// Created the authSlice to handle authentication logic
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to handle successful login
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token); // Save token in localStorage
    },

    // Action to handle registration success
    registerSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token); // Save token in localStorage
    },

    // Action to handle logout
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // Remove token from localStorage
    },

    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

// Export actions for login, registration, logout, and optional user update
export const { loginSuccess, registerSuccess, logout, setUser } =
  authSlice.actions;

// Export the reducer to be added to the store
export default authSlice.reducer; // Default export for authReducer
