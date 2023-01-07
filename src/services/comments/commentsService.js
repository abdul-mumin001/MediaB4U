import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApi } from "../../utils";
export const addComment = createAsyncThunk(
  "comments/addComment",
  async (comment) => {
    const response = await callApi(
      "post",
      `posts/${comment.postId}/comments`,
      true,
      comment
    );
    return response.data;
  }
);
export const removeComment = createAsyncThunk(
  "comments/removeComment",
  async (comment) => {
    const response = await callApi(
      "delete",
      `posts/${comment.postId}/comments/${comment._id}`,
      true
    );

    return response.data;
  }
);
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (comment) => {
    const response = await callApi(
      "put",
      `posts/${comment.postId}/comments/${comment._id}`,
      true,
      comment
    );

    return response.data;
  }
);
export const fetchAllComment = createAsyncThunk(
  "comments/fetchAllComment",
  async (data) => {
    const response = await callApi(
      "get",
      `posts/${data._id}/comments?skip=${data.skip}`,
      true
    );
    return response.data;
  }
);
