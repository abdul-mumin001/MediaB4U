import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApi } from "../../utils";
export const addReply = createAsyncThunk(
  "replies/addReply",
  async (reply, { dispatch }) => {
    const response = await callApi(
      "post",
      `posts/comments/${reply.commentId}`,
      true,
      reply
    );
    return response.data;
  }
);

export const removeReply = createAsyncThunk(
  "replies/removeReply",
  async (replyId, { dispatch }) => {
    const response = await callApi("delete", `posts/replies/${replyId}`, true);
    return response.data;
  }
);

export const fetchAllReply = createAsyncThunk(
  "replies/fetchAllReply",
  async (commentId, { dispatch }) => {
    const response = await callApi("get", `posts/comments/${commentId}`);
    return response.data;
  }
);
