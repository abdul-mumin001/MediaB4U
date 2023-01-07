import { createSlice } from "@reduxjs/toolkit";
import { getFollowing } from "../../services/auth/authService";
import { initialState } from "../../utils";

export const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    clearFollowing: (state) => {
      state.data = [];
    },
  },
  extraReducers: {
    [getFollowing.pending]: (state, action) => {
      state.status = "loading";
    },
    [getFollowing.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload?.following?.following;
    },
    [getFollowing.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});
export const { clearFollowing } = followingSlice.actions;
export default followingSlice.reducer;
