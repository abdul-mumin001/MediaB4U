import { createSlice } from "@reduxjs/toolkit";
import {
  bookmarkPost,
  fetchBookmarkedPosts,
  unBookmarkPost,
} from "../../services/posts/postsService";
import { initialState, notify, updatePostsContent } from "../../utils";

export const bookmarkedPostsSlice = createSlice({
  name: "bookmarkedPosts",
  initialState,
  reducers: {
    updateBookmarkedPosts: (state, action) => {
      updatePostsContent(state, action);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBookmarkedPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBookmarkedPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload?.posts?.filter(
          (post) => post != null && post
        );
      })
      .addCase(fetchBookmarkedPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(bookmarkPost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.unshift(action.payload?.post);
        notify("Post added to bookmarks successfully", "success");
      })
      .addCase(bookmarkPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(unBookmarkPost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(unBookmarkPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (post) => post?._id !== action.payload?.postId
        );
        notify("Post removed from bookmarks successfully", "success");
      })
      .addCase(unBookmarkPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});
export const { updateBookmarkedPosts } = bookmarkedPostsSlice.actions;
export default bookmarkedPostsSlice.reducer;
