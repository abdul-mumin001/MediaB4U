import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Layout, Loader, NotAvailable, UserListLoader } from "../../components";
import { UserList } from "../../components/UserList";
import { useSearch } from "../../context";
import { clearFollowers } from "../../features/followers/followersSlice";
import { getFollowers } from "../../services/auth/authService";

export const FollowersPage = ({ type }) => {
  const dispatch = useDispatch();
  const { profileId } = useParams();

  const { skip, setSkip } = useSearch();

  const followers = useSelector((state) => state.followers);

  const observer = useRef();
  const loaderRef = useCallback(
    (node) => {
      if (followers.status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip(followers.data.length);
        }
      });
      if (node) observer.current.observe(node);
    },
    [followers]
  );
  useEffect(() => {
    dispatch(clearFollowers());
  }, []);
  useEffect(() => {
    dispatch(getFollowers(profileId));
  }, [skip, dispatch, profileId]);

  return (
    <Layout>
      <h1 className="text-lightBlue text-center  mt-8 text-xl font-semibold">
        Your followers
      </h1>
      <div className="flex flex-col gap-4 justify-center items-center mt-5">
        {followers.status === "loading" && <UserListLoader/>}
        {followers.status === "succeeded" && followers.data.length === 0 && (
          <NotAvailable title={`No Followers found`} />
        )}
        {followers.status === "succeeded" && followers.data.length > 0 && (
          <UserList users={followers.data} ref={loaderRef} />
        )}
      </div>
    </Layout>
  );
};
