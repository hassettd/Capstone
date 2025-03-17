import { createSlice } from "@reduxjs/toolkit";

// Initial state includes user data and token, with fallback to localStorage for token
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

// Create the authSlice to handle authentication logic
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

    // Optional: Set user information separately (e.g., if needed for profile update)
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

// 3-17 starter
// import { createSlice } from "@reduxjs/toolkit";

// // Initial state includes user data and token, with fallback to localStorage for token
// const initialState = {
//   user: null,
//   token: localStorage.getItem("token") || null,
// };

// // Create the authSlice to handle authentication logic
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // Action to handle successful login
//     loginSuccess(state, action) {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("token", action.payload.token); // Save token in localStorage
//     },

//     // Action to handle registration success
//     registerSuccess(state, action) {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("token", action.payload.token); // Save token in localStorage
//     },

//     // Action to handle logout
//     logout(state) {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("token"); // Remove token from localStorage
//     },

//     // Optional: Set user information separately (e.g., if needed for profile update)
//     setUser(state, action) {
//       state.user = action.payload;
//     },
//   },
// });

// // Export actions for login, registration, logout, and optional user update
// export const { loginSuccess, registerSuccess, logout, setUser } =
//   authSlice.actions;

// // Export the reducer to be added to the store
// export default authSlice.reducer; // Default export for authReducer

// import { createSlice } from "@reduxjs/toolkit";

// // Initial state includes user data and token, with fallback to localStorage for token
// const initialState = {
//   user: null,
//   token: localStorage.getItem("token") || null,
// };

// // Create the authSlice to handle authentication logic
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // Action to handle successful login
//     loginSuccess(state, action) {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("token", action.payload.token); // Save token in localStorage
//     },

//     // Action to handle registration success
//     registerSuccess(state, action) {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("token", action.payload.token); // Save token in localStorage
//     },

//     // Action to handle logout
//     logout(state) {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("token"); // Remove token from localStorage
//     },

//     // Optional: Set user information separately (e.g., if needed for profile update)
//     setUser(state, action) {
//       state.user = action.payload;
//     },
//   },
// });

// // Export actions for login, registration, logout, and optional user update
// export const { loginSuccess, registerSuccess, logout, setUser } =
//   authSlice.actions;

// // Export the reducer to be added to the store
// export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   token: localStorage.getItem("token") || null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginSuccess(state, action) {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("token", action.payload.token);
//     },
//     registerUser(state, action) {
//       state.user = action.payload.user; // Store user information after registration
//       state.token = action.payload.token; // Store token after registration
//       localStorage.setItem("token", action.payload.token); // Save token to localStorage
//     },
//     logout(state) {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { loginSuccess, registerUser, logout } = authSlice.actions;
// export const authReducer = authSlice.reducer;
