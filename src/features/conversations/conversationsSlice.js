import { createSlice } from "@reduxjs/toolkit";
import {
  createConversation,
  fetchAllConversation,
} from "../../services/messages/messagesService";
import { initialState } from "../../utils";

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    clearConversations: (state) => {
      state.data = [];
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllConversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...state?.data, ...action.payload?.conversations];
      })
      .addCase(fetchAllConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(createConversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.unshift(action.payload?.conversation);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});
export const { clearConversations } = conversationsSlice.actions;

export default conversationsSlice.reducer;
