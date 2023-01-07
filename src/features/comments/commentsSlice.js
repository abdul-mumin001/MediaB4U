import { createSlice } from "@reduxjs/toolkit";
import {
  addComment,
  fetchAllComment,
  removeComment,
  updateComment,
} from "../../services/comments/commentsService";
import { initialState, notify } from "../../utils";

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.data = [];
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: {
    [addComment.pending]: (state) => {
      state.status = "loading";
    },
    [addComment.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = [action.payload?.comment, ...state?.data];
      notify("Comment added successfully");
    },
    [addComment.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [removeComment.pending]: (state) => {
      state.status = "loading";
    },
    [removeComment.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = state?.data?.filter(
        (comment) => comment?._id !== action?.payload?.commentId
      );
      notify("Comment deleted successfully");
    },
    [removeComment.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [updateComment.pending]: (state) => {
      state.status = "loading";
    },
    [updateComment.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = state?.data?.map((comment) => {
        if (comment?._id !== action?.payload?.comment?.commentId)
          return action?.payload?.comment;
        return comment;
      });
      notify("Comment updated successfully");
    },
    [updateComment.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [fetchAllComment.pending]: (state) => {
      state.status = "loading";
    },
    [fetchAllComment.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = [...state?.data, ...action?.payload?.comments];
    },
    [fetchAllComment.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
  },
});
export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;
