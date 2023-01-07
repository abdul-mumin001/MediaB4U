import { createSlice } from "@reduxjs/toolkit";
import { fetchSuggestedUsers } from "../../services/auth/authService";
import { initialState } from "../../utils";

export const suggestedUsersSlice = createSlice({
  name: "suggestedUsers",
  initialState,
  reducers: {
    clearSuggestedUsers: (state) => {
      state.data = [];
    },
    updateSuggestedUsers: (state, action) => {
      state.data = state?.data?.filter(
        (user) => user?._id !== action.payload?.followingId
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSuggestedUsers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = [...state?.data, ...action.payload?.users];
    });
    builder.addCase(fetchSuggestedUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
  },
});
export const { clearSuggestedUsers, updateSuggestedUsers } =
  suggestedUsersSlice.actions;
export default suggestedUsersSlice.reducer;
