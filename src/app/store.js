import { configureStore } from "@reduxjs/toolkit";
import {
  allPostsReducer,
  archivedPostsReducer,
  authReducer,
  bookmarkedPostsReducer,
  commentsReducer,
  conversationsReducer,
  draftPostsReducer,
  followersReducer,
  followingReducer,
  likePostReducer,
  messagesReducer,
  postReducer,
  postsReducer,
  profileReducer,
  searchedPostsReducer,
  searchedUsersReducer,
  suggestedUsersReducer,
  userCreatedPostsReducer,
} from "../features";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    archivedPosts: archivedPostsReducer,
    bookmarkedPosts: bookmarkedPostsReducer,
    draftPosts: draftPostsReducer,
    allPosts: allPostsReducer,
    userCreatedPosts: userCreatedPostsReducer,
    profile: profileReducer,
    comments: commentsReducer,
    following: followingReducer,
    followers: followersReducer,
    searchedUsers: searchedUsersReducer,
    suggestedUsers: suggestedUsersReducer,
    searchedPosts: searchedPostsReducer,
    post: postReducer,
    conversations: conversationsReducer,
    messages: messagesReducer,
    likedPost: likePostReducer,
  },
});
