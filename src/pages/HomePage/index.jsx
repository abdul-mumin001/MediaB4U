import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Layout,
  OnlineUsers,
  PostsSection,
  SuggestionSection,
} from "../../components";
import { useOnlineUsers } from "../../context/onlineUsersContext";
import { AddPostForm } from "./AddPostForm";

export const HomePage = () => {
  const { onlineUsers } = useOnlineUsers();
  const { user } = useSelector((state) => state.auth);
  const _onlineUsers = useMemo(
    () =>
      onlineUsers.filter(
        (_user) =>
          user.following.some((follower) => _user._id === follower) &&
          _user._id !== user._id
      ),
    [onlineUsers, user]
  );
  return (
    <Layout>
      <div className="flex gap-4 w-full relative">
        <div
          className="flex flex-col gap-8 md:w-8/12 w-full "
          id="left-section"
        >
          <AddPostForm />
          <PostsSection type="userFeed" />
        </div>
        <div
          id="right-section"
          className="md:flex flex-col hidden items-center h-screen gap-2   md:w-2/12 fixed right-20"
        >
          {_onlineUsers.length > 0 && <OnlineUsers />}
          <SuggestionSection />
        </div>
      </div>
    </Layout>
  );
};
