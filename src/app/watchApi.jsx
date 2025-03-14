import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const watchApi = createApi({
  reducerPath: "watchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://capstone-backend2-ssa6.onrender.com",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Authentication
    register: builder.mutation({
      query: (user) => ({
        url: "/api/auth/register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    me: builder.query({
      query: () => "/api/auth/me",
    }),

    // Watches
    getWatches: builder.query({
      query: () => "/api/watches",
    }),
    getWatchDetails: builder.query({
      query: (watchId) => `/api/watches/${watchId}`,
    }),
    getWatchReviews: builder.query({
      query: (watchId) => `/api/watches/${watchId}/reviews`,
    }),

    // Reviews
    getReview: builder.query({
      query: (reviewId) => `/api/watches/${reviewId}/reviews`,
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `/api/watches/${data.watchId}/reviews`,
        method: "POST",
        body: data.review,
      }),
    }),

    // Comments
    createComment: builder.mutation({
      query: (data) => ({
        url: `/api/watches/${data.watchId}/reviews/${data.reviewId}/comments`,
        method: "POST",
        body: data.comment,
      }),
    }),

    // Update and Delete Review and Comment
    updateReview: builder.mutation({
      query: (data) => ({
        url: `/api/users/${data.userId}/reviews/${data.reviewId}`,
        method: "PUT",
        body: data.review,
      }),
    }),
    deleteReview: builder.mutation({
      query: ({ userId, reviewId }) => ({
        url: `/api/users/${userId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
    }),
    updateComment: builder.mutation({
      query: (data) => ({
        url: `/api/users/${data.userId}/comments/${data.commentId}`,
        method: "PUT",
        body: data.comment,
      }),
    }),
    deleteComment: builder.mutation({
      query: ({ userId, commentId }) => ({
        url: `/api/users/${userId}/comments/${commentId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetWatchesQuery,
  useGetWatchDetailsQuery,
  useGetWatchReviewsQuery,
  useCreateReviewMutation,
  useCreateCommentMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = watchApi;
