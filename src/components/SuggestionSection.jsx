import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSuggestedUsers } from "../features/suggestedUsers/suggestedUsersSlice";
import { fetchSuggestedUsers } from "../services/auth/authService";
import { NotAvailable } from "./NotAvailable";
import { UserList } from "./UserList";
import { UserListLoader } from "./UserListLoader";

export const SuggestionSection = () => {
  const suggestedUsers = useSelector((state) => state.suggestedUsers);
  const dispatch = useDispatch();
  const observer = useRef();
  const [skip, setSkip] = useState(0);

  const loaderRef = useCallback(
    (node) => {
      if (suggestedUsers.status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip(suggestedUsers.data.length);
        }
      });
      if (node) observer.current.observe(node);
    },
    [suggestedUsers]
  );
  useEffect(() => {
    dispatch(clearSuggestedUsers());
  }, []);
  useEffect(() => {
    dispatch(fetchSuggestedUsers({ skip }));
  }, [skip]);
  return (
    <div className="md:flex flex-col items-center  p-1 overflow-y-auto scrollbar-none mx-5 ">
      <h1 className=" text-lg text-lightBlue ">Suggested users</h1>
      <div className="flex flex-col gap-4 justify-center items-center mt-2">
        {suggestedUsers.status === "loading" && <UserListLoader />}
        {suggestedUsers.status !== "loading" &&
          suggestedUsers.data.length === 0 && (
            <NotAvailable title={`No suggested user available`} />
          )}
        {suggestedUsers.status !== "loading" &&
          suggestedUsers.data.length > 0 && (
            <UserList
              users={suggestedUsers.data}
              ref={loaderRef}
              type="small"
            />
          )}
      </div>
    </div>
  );
};
