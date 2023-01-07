import { createSlice } from "@reduxjs/toolkit";
import { searchPostsByHashTag } from "../../services/posts/postsService";
import { initialState } from "../../utils";

export const searchedPostsSlice = createSlice({
  name: "searchedPosts",
  initialState,
  reducers: {
    clearSearchedPosts: (state) => {
      state.data = [];
    },
  },
  extraReducers: {
    [searchPostsByHashTag.pending]: (state) => {
      state.status = "loading";
    },
    [searchPostsByHashTag.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = [...state?.data, ...action.payload?.posts];
    },
    [searchPostsByHashTag.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});

export const { clearSearchedPosts } = searchedPostsSlice.actions;
export default searchedPostsSlice.reducer;
