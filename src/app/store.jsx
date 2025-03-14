import { configureStore } from "@reduxjs/toolkit";
import { watchApi } from "./watchApi";
import { authReducer } from "./authSlice";

export const store = configureStore({
  reducer: {
    [watchApi.reducerPath]: watchApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(watchApi.middleware),
});
