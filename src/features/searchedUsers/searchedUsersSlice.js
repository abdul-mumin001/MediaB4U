import { createSlice } from "@reduxjs/toolkit";
import { searchUsers } from "../../services/auth/authService";
import { initialState } from "../../utils";

export const searchedUsersSlice = createSlice({
  name: "searchedUsers",
  initialState,
  reducers: {
    clearSearchedUsers: (state) => {
      state.data = [];
    },
  },
  extraReducers: {
    [searchUsers.pending]: (state, action) => {
      state.status = "loading";
    },
    [searchUsers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = [...state?.data, ...action.payload?.users];
    },
    [searchUsers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});
export const { clearSearchedUsers } = searchedUsersSlice.actions;
export default searchedUsersSlice.reducer;
