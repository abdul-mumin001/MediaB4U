import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApi } from "../../utils";
export const fetchStories = createAsyncThunk(
  "stories/fetchStories",
  async () => {
    const response = await callApi("get", "stories");
    return response.data;
  }
);
