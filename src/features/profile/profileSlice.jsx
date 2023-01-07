import { createSlice } from "@reduxjs/toolkit";
import {
  getProfileInfo,
  updateProfileInfo,
} from "../../services/auth/authService";
import { initialState } from "../../utils";

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.data = action.payload?.profile;
      localStorage.setItem("user", JSON.stringify(action.payload?.profile));
    },
  },
  extraReducers: {
    [getProfileInfo.pending]: (state, action) => {
      state.status = "loading";
    },
    [getProfileInfo.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload?.profile;
    },
    [getProfileInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [updateProfileInfo.pending]: (state, action) => {
      state.status = "loading";
    },
    [updateProfileInfo.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload?.profile;
    },
    [updateProfileInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});
export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;
