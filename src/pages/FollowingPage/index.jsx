import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Layout, NotAvailable, UserListLoader } from "../../components";
import { UserList } from "../../components/UserList";
import { useSearch } from "../../context";
import { clearFollowing } from "../../features/following/followingSlice";
import { getFollowing } from "../../services/auth/authService";

export const FollowingPage = () => {
  const dispatch = useDispatch();
  const { profileId } = useParams();

  const { skip, setSkip } = useSearch();

  const following = useSelector((state) => state.following);

  const observer = useRef();
  const loaderRef = useCallback(
    (node) => {
      if (following.status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip(following.data.length);
        }
      });
      if (node) observer.current.observe(node);
    },
    [following]
  );
  useEffect(() => {
    dispatch(clearFollowing());
  }, []);
  useEffect(() => {
    dispatch(getFollowing(profileId));
  }, [skip, dispatch, profileId]);

  return (
    <Layout>
      <h1 className="text-lightBlue text-center  mt-8 text-xl font-semibold">
        Your following
      </h1>
      <div className="flex flex-col gap-4 justify-center items-center mt-5">
        {following.status === "loading" && <UserListLoader />}
        {following.status === "succeeded" && following.data.length === 0 && (
          <NotAvailable title={`There is not following`} />
        )}
        {following.status === "succeeded" && following.data.length > 0 && (
          <UserList users={following.data} ref={loaderRef} />
        )}
      </div>
    </Layout>
  );
};
