import { createSlice } from "@reduxjs/toolkit";
import { getFollowers } from "../../services/auth/authService";
import { initialState } from "../../utils";

export const followersSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {
    clearFollowers: (state) => {
      state.data = [];
    },
  },
  extraReducers: {
    [getFollowers.pending]: (state) => {
      state.status = "loading";
    },
    [getFollowers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload?.followers?.followers;
    },
    [getFollowers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});
export const { clearFollowers } = followersSlice.actions;
export default followersSlice.reducer;
