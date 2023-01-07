import { createSlice } from "@reduxjs/toolkit";
import {
  addPostToDraft,
  fetchDraftPosts,
  removePostFromDraft,
} from "../../services/posts/postsService";
import { initialState, notify, updatePostsContent } from "../../utils";

export const draftPostsSlice = createSlice({
  name: "draftPosts",
  initialState,
  reducers: {
    updateDraftPosts: (state, action) => {
      updatePostsContent(state, action);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDraftPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDraftPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload?.posts?.filter(
          (post) => post != null && post
        );
      })
      .addCase(fetchDraftPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(addPostToDraft.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPostToDraft.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.unshift(action.payload?.post);
        notify("Post added to draft successfully", "success");
      })
      .addCase(addPostToDraft.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(removePostFromDraft.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removePostFromDraft.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (post) => post?._id !== action.payload?.postId
        );
        notify("Post removed from draft successfully", "success");
      })
      .addCase(removePostFromDraft.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { updateDraftPosts } = draftPostsSlice.actions;
export default draftPostsSlice.reducer;
