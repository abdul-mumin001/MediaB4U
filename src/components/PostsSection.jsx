import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostsWrapper, Tab } from ".";
import { clearAllPosts } from "../features/allPosts/allPostsSlice";
import { clearPosts } from "../features/posts/postsSlice";
import {
  fetchAllPosts,
  fetchAllTrendingPosts,
  fetchUserFeedPosts,
  fetchUserFeedTrendingPosts,
} from "../services/posts/postsService";
export const PostsSection = ({ type = "all" }) => {
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.auth?.user);
  const allPosts = useSelector((state) => state.allPosts);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Latest");
  const [skip, setSkip] = useState(0);
  useEffect(() => {
    setSkip(0);
    if (type === "all") dispatch(clearAllPosts());
    else dispatch(clearPosts());
  }, [type, activeTab, dispatch]);

  useEffect(() => {
    if (type === "userFeed") {
      if (activeTab === "Latest") {
        dispatch(fetchUserFeedPosts({ id: user._id, skip }));
      } else if (activeTab === "Trending") {
        dispatch(fetchUserFeedTrendingPosts({ id: user._id, skip }));
      }
    } else if (type === "all") {
      if (activeTab === "Latest") {
        dispatch(fetchAllPosts(skip));
      } else if (activeTab === "Trending") {
        dispatch(fetchAllTrendingPosts(skip));
      }
    }
  }, [user, dispatch, type, activeTab, skip]);

  const observer = useRef();
  const loaderRef = useCallback(
    (node) => {
      if (allPosts.status === "loading" || posts.status === "loading") return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (type === "all") {
            setSkip(allPosts.data.length);
          } else setSkip(posts.data.length);
        }
      });

      node && observer.current.observe(node);
    },
    [allPosts, posts, type]
  );
  // const loaderRef = useCallback(
  //   (node) => {
  //     if (allPosts.status === "loading" || posts.status === "loading") return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting) {
  //         if (type === "all") {
  //           setSkip(allPosts.data.length);
  //         } else setSkip(posts.data.length);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [allPosts, posts, type]
  // );
  return (
    <PostsWrapper
      posts={type === "all" ? allPosts : posts}
      postType={type}
      ref={loaderRef}
    >
      <div className="flex gap-4">
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          name="Latest"
          onClick={() => {}}
        ></Tab>
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          name="Trending"
          onClick={() => {}}
        />
      </div>
    </PostsWrapper>
  );
};
