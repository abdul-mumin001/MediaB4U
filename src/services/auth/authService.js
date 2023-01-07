import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatePosts } from "../../features/posts/postsSlice";
import {
  clearSuggestedUsers,
  updateSuggestedUsers,
} from "../../features/suggestedUsers/suggestedUsersSlice";
import { callApi, formatError } from "../../utils";
export const login = createAsyncThunk(
  "auth/login",
  async (loginCred, { rejectWithValue }) => {
    try {
      const { email, password } = loginCred;
      const response = await callApi("post", "auth/login", false, {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);
export const signup = createAsyncThunk(
  "auth/signup",
  async (signupCred, { rejectWithValue }) => {
    try {
      const { name, email, password } = signupCred;
      const response = await callApi("post", "auth/signup", false, {
        name,
        email,
        password,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(formatError(err));
    }
  }
);

export const getProfileInfo = createAsyncThunk(
  "auth/getProfileInfo",
  async (id) => {
    const response = await callApi("get", `user/profile/${id}`, true);
    return response.data;
  }
);
export const updateProfileInfo = createAsyncThunk(
  "auth/updateProfileInfo",
  async (profileInfo) => {
    const response = await callApi(
      "put",
      `user/profile/${profileInfo.id}`,
      true,
      profileInfo
    );
    return response.data;
  }
);

export const followUser = createAsyncThunk(
  "auth/followUser",
  async (user, { dispatch }) => {
    const response = await callApi(
      "put",
      `user/${user.followerId}/follow/${user.followingId}`,
      true
    );
    dispatch(updateSuggestedUsers(response.data));
    return response.data;
  }
);

export const unfollowUser = createAsyncThunk(
  "auth/unfollowUser",
  async (user, { dispatch }) => {
    const response = await callApi(
      "put",
      `user/${user.followerId}/unfollow/${user.followingId}`,
      true
    );
    dispatch(updatePosts({ _id: response.data.followingId }));
    dispatch(clearSuggestedUsers());
    dispatch(searchUsers({ skip: 0 }));

    return response.data;
  }
);

export const getFollowing = createAsyncThunk(
  "auth/getFollowing",
  async (id) => {
    const response = await callApi("get", `user/${id}/following/`, true);
    return response.data;
  }
);

export const getFollowers = createAsyncThunk(
  "auth/getFollowers",
  async (id) => {
    const response = await callApi("get", `user/${id}/followers/`, true);

    return response.data;
  }
);

export const searchUsers = createAsyncThunk(
  "auth/searchUsers",
  async (data) => {
    console.log("search", data.search, data.skip);
    const response = await callApi(
      "get",
      `user?search=${data.search}&skip=${data.skip}`,
      true
    );
    return response.data;
  }
);
export const fetchSuggestedUsers = createAsyncThunk(
  "auth/fetchSuggestedUsers",
  async (data) => {
    const response = await callApi(
      "get",
      `user?search=${data.search}&skip=${data.skip}`,
      true
    );
    return response.data;
  }
);
