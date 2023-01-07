import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApi } from "../../utils";
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (message, { dispatch }) => {
    const response = await callApi(
      "post",
      `user/${message.from}/messages/`,

      true,
      message
    );
    return response.data;
  }
);

export const removeMessage = createAsyncThunk(
  "messages/removeMessage",
  async (message, { dispatch }) => {
    const response = await callApi(
      "delete",
      `user/${message.from}/messages/${message._id}`,
      true
    );
    return response.data;
  }
);

export const fetchAllMessage = createAsyncThunk(
  "messages/fetchAllMessage",
  async (message, { dispatch }) => {
    const response = await callApi(
      "get",
      `user/${message.from}/messages/${message.conversationId}`,
      true
    );
    return response.data;
  }
);
export const fetchAllConversation = createAsyncThunk(
  "conversations/fetchAllConversation",
  async (from, { dispatch }) => {
    const response = await callApi("get", `user/${from}/conversations`, true);
    return response.data;
  }
);
export const createConversation = createAsyncThunk(
  "conversations/createConversation",
  async (conversation, { dispatch }) => {
    const response = await callApi(
      "post",
      `user/${conversation.from}/conversations/${conversation.to}`,
      true
    );
    return response.data;
  }
);
