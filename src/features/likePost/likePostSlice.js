import { createSlice } from "@reduxjs/toolkit";
import { dislikePost, likePost } from "../../services/likePost/likePostService";
import { initialState, notify } from "../../utils";

export const likePostSlice = createSlice({
  name: "likedPost",
  initialState,
  reducers: {},
  extraReducers: {
    [likePost.pending]: (state, action) => {
      state.status = "loading";
    },
    [likePost.fulfilled]: (state, action) => {
      notify("Post liked successfully");
      state.status = "succeeded";
    },
    [likePost.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [dislikePost.pending]: (state, action) => {
      state.status = "loading";
    },
    [dislikePost.fulfilled]: (state, action) => {
      notify("Post disliked successfully");
      state.status = "succeeded";
    },
    [dislikePost.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});

export default likePostSlice.reducer;
