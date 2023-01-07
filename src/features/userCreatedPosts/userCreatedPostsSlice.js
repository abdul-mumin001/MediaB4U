import { createSlice } from "@reduxjs/toolkit";
import { fetchUserCreatedPosts } from "../../services/posts/postsService";
import { initialState, updatePostsContent } from "../../utils";

export const userCreatedPostsSlice = createSlice({
  name: "userCreatedPosts",
  initialState,
  reducers: {
    updateUserCreatedPosts: (state, action) => {
      updatePostsContent(state, action);
    },
    clearUserCreatedPosts: (state) => {
      state.data = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserCreatedPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserCreatedPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state?.data, ...action.payload?.posts];
      })
      .addCase(fetchUserCreatedPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { updateUserCreatedPosts, clearUserCreatedPosts } =
  userCreatedPostsSlice.actions;
export default userCreatedPostsSlice.reducer;
