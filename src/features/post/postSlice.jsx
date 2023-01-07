import { createSlice } from "@reduxjs/toolkit";
import { fetchPostInfo } from "../../services/posts/postsService";
import { initialState } from "../../utils";

export const postSlice = createSlice({
  initialState,
  name: "post",
  reducers: {
    updatePostInfo: (state, action) => {
      state.data = action?.payload?.post;
    },
  },
  extraReducers: {
    [fetchPostInfo.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchPostInfo.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload?.post;
    },
    [fetchPostInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});
export const { updatePostInfo } = postSlice.actions;
export default postSlice.reducer;
