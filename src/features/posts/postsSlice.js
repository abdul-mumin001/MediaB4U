import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  fetchUserFeedPosts,
  fetchUserFeedTrendingPosts,
  updatePost,
} from "../../services/posts/postsService";
import { initialState, notify } from "../../utils";

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.data = [];
    },
    updatePosts: (state, action) => {
      state.data = state?.data?.filter(
        (post) => post.postedBy._id !== action.payload?._id
      );
    },
    setPostCreateStatusLoading: (state) => {
      state.postCreateStatus = "loading";
    },
    setPostUpdateStatusLoading: (state) => {
      state.postUpdateStatus = "loading";
    },
  },
  extraReducers: {
    [fetchUserFeedPosts.pending]: (state) => {
      state.status = "loading";
    },
    [fetchUserFeedPosts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = [...state?.data, ...action.payload?.posts];
    },
    [fetchUserFeedPosts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [fetchUserFeedTrendingPosts.pending]: (state) => {
      state.status = "loading";
    },
    [fetchUserFeedTrendingPosts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = [...state.data, ...action.payload?.posts];
    },
    [fetchUserFeedTrendingPosts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [createPost.pending]: (state) => {
      state.postCreateStatus = "loading";
    },
    [createPost.fulfilled]: (state, action) => {
      state.postCreateStatus = "succeeded";

      state.data.unshift(action.payload?.post);

      notify("Post added successfully", "success");
    },
    [createPost.rejected]: (state, action) => {
      state.postCreateStatus = "failed";
      state.error = action.error;
    },
    [deletePost.pending]: (state) => {
      state.postDeleteStatus = "loading";
    },
    [deletePost.fulfilled]: (state, action) => {
      state.postDeleteStatus = "succeeded";
      state.data = state.data.filter(
        (post) => post?._id !== action.payload?.postId
      );

      notify("Post deleted successfully", "success");
    },
    [deletePost.rejected]: (state, action) => {
      state.postDeleteStatus = "failed";
      state.error = action.error;
    },
    [updatePost.pending]: (state) => {
      state.postUpdateStatus = "loading";
    },
    [updatePost.fulfilled]: (state, action) => {
      state.postUpdateStatus = "succeeded";
      state.data = state.data.map((post) => {
        if (post?._id === action.payload?.post._id) {
          return action.payload?.post;
        }
        return post;
      });
      notify("Post updated successfully", "success");
    },
    [updatePost.rejected]: (state, action) => {
      state.postUpdateStatus = "failed";
      state.error = action.error;
    },
  },
});

export const {
  clearPosts,
  setPostCreateStatusLoading,
  setPostUpdateStatusLoading,
  updatePosts,
} = postsSlice.actions;

export default postsSlice.reducer;
