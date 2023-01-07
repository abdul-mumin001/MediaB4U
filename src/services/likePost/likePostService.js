import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApi } from "../../utils";

export const likePost = createAsyncThunk("posts/likePost", async (data) => {
  const { id, likedBy } = data;
  const response = await callApi("put", `posts/${id}/like`, true, { likedBy });
  return response.data;
});

export const dislikePost = createAsyncThunk(
  "posts/dislikePost",
  async (data) => {
    const { id, dislikedBy } = data;
    const response = await callApi("put", `posts/${id}/dislike`, true, {
      dislikedBy,
    });
    return response.data;
  }
);
