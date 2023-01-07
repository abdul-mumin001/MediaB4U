import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import UserCard from "./UserCard";

export const UserList = forwardRef(({ users, type }, loaderRef) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="flex flex-col gap-2">
      {users.length > 0 &&
        users.map((_user, i) => {
          if (_user._id !== user._id) {
            if (i === users.length - 1)
              return (
                <UserCard
                  ref={loaderRef}
                  _user={_user}
                  type={type}
                  key={_user._id}
                />
              );
            return <UserCard _user={_user} type={type} key={_user._id} />;
          }
        })}
    </div>
  );
});
