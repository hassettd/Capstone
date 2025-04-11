import { configureStore } from "@reduxjs/toolkit";
import { watchApi } from "./watchApi";
import authReducer from "./authSlice"; 

export const store = configureStore({
  reducer: {
    [watchApi.reducerPath]: watchApi.reducer, // Add the watchApi reducer
    auth: authReducer, // Add the authReducer to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(watchApi.middleware), // Add middleware for RTK Query
});

export default store;

