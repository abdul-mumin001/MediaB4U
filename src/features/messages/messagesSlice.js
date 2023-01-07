import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllMessage,
  removeMessage,
  sendMessage,
} from "../../services/messages/messagesService";
import { initialState, notify } from "../../utils";

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    updateMessages: (state, action) => {
      state?.data?.some(
        (data) => data.conversationId === action.payload.conversationId
      ) && state.data.push(action.payload);
    },
    deleteMessage: (state, action) => {
      state.data = state?.data?.filter(
        (data) => data?._id !== action?.payload?.messageId
      );
    },
    clearMessages: (state) => {
      state.data = [];
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload?.message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(removeMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state?.data.filter(
          (message) => message._id !== action?.payload?.messageId
        );
        notify("Message deleted successfully");
      })
      .addCase(removeMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(fetchAllMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload?.messages;
      })
      .addCase(fetchAllMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});
export const { clearMessages, updateMessages, deleteMessage } =
  messagesSlice.actions;

export default messagesSlice.reducer;
