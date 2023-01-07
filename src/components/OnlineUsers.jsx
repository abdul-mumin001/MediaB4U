import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useOnlineUsers } from "../context/onlineUsersContext";
import { UserList } from "./UserList";

export const OnlineUsers = () => {
  const { onlineUsers } = useOnlineUsers();
  const user = useSelector((state) => state.auth.user);
  const _onlineUsers = useMemo(
    () =>
      onlineUsers.filter((_user) =>
        user.following.some((follower) => _user._id === follower)
      ),
    [onlineUsers, user]
  );
  if (user)
    return (
      <div className="md:flex p-1 flex-col items-center  overflow-y-auto scrollbar-none mx-5">
        <h1 className=" text-lg text-lightBlue ">Online users</h1>
        <div className="flex flex-col gap-2 justify-center items-center mt-2">
          {onlineUsers.length > 0 && (
            <UserList users={_onlineUsers} type="small" />
          )}
        </div>
      </div>
    );
};
