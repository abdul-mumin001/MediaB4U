import { createSlice } from "@reduxjs/toolkit";
import { addReply, fetchAllReply } from "../../services/replies/repliesService";
import { initialState, notify } from "../../utils";

export const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    clearReplies: (state) => {
      state.data = [];
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addReply.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addReply.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.unshift(action.payload?.reply);
        notify("Reply added successfully");
      })
      .addCase(addReply.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(fetchAllReply.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllReply.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload?.replies;
      })
      .addCase(fetchAllReply.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});
export const { clearReplies } = replySlice.actions;

export default replySlice.reducer;
