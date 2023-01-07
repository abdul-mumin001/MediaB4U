import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Layout,
  Loader,
  NotAvailable,
  PostsWrapper,
  Tab,
} from "../../components";
import { clearArchivedPosts } from "../../features/archivedPosts/archivedPostsSlice";
import { clearUserCreatedPosts } from "../../features/userCreatedPosts/userCreatedPostsSlice";
import { getProfileInfo } from "../../services/auth/authService";
import {
  fetchArchivedPosts,
  fetchUserCreatedPosts,
} from "../../services/posts/postsService";
import { ProfileHeader } from "./ProfileHeader";

export const ProfilePage = () => {
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();

  const userCreatedPosts = useSelector((state) => state.userCreatedPosts);
  const archivedPosts = useSelector((state) => state.archivedPosts);
  const [activeTab, setActiveTab] = useState("All Published Posts");
  const { profileId } = useParams();
  const [skip, setSkip] = useState(0);
  const observer = useRef();

  useEffect(() => {
    setSkip(0);
    dispatch(clearArchivedPosts());
    dispatch(clearUserCreatedPosts());
  }, [activeTab, dispatch]);
  const loaderRef = useCallback(
    (node) => {
      if (
        archivedPosts.status === "loading" ||
        userCreatedPosts.status === "loading"
      )
        return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "All Published Posts") {
            setSkip(userCreatedPosts.data.length);
          } else setSkip(archivedPosts.data.length);
        }
      });
      if (node) observer.current.observe(node);
    },
    [userCreatedPosts, archivedPosts, activeTab]
  );
  useEffect(() => {
    dispatch(getProfileInfo(profileId));
  }, [profileId, dispatch]);
  useEffect(() => {
    if (activeTab === "All Published Posts") {
      dispatch(fetchUserCreatedPosts({ id: profileId, skip }));
    } else if (activeTab === "All Archived Posts") {
      dispatch(fetchArchivedPosts(profileId));
    }
  }, [activeTab, profileId, dispatch, skip]);

  return (
    <Layout>
      {profile.status === "loading" && (
        <div className="mt-24">
          <Loader type="medium" />
        </div>
      )}
      {profile.status === "succeeded" && !profile.data && (
        <NotAvailable title="Profile is not available"></NotAvailable>
      )}

      {profile.status === "succeeded" && profile.data && (
        <div className="flex flex-col gap-4 ">
          <ProfileHeader profile={profile?.data} />
          {user?._id === profileId && (
            <div className="flex gap-4 items-center">
              <Tab
                name="All Published Posts"
                setActiveTab={setActiveTab}
                activeTab={activeTab}
              />
              <Tab
                name="All Archived Posts"
                setActiveTab={setActiveTab}
                activeTab={activeTab}
              />
            </div>
          )}
          <PostsWrapper
            type={activeTab === "All Published Posts" ? "published" : "archive"}
            posts={
              activeTab === "All Published Posts"
                ? userCreatedPosts
                : archivedPosts
            }
            ref={loaderRef}
            width=" w-full"
          />
        </div>
      )}
    </Layout>
  );
};
