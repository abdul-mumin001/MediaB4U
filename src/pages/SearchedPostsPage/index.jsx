import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Layout, PostsWrapper } from "../../components";
import { clearSearchedPosts } from "../../features/searchedPosts/searchedPostsSlice";
import { searchPostsByHashTag } from "../../services/posts/postsService";

export const SearchedPostsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const hashtag = searchParams.get("hashtag");
  const searchedPosts = useSelector((state) => state.searchedPosts);
  const [skip, setSkip] = useState(0);
  const observer = useRef();
  useEffect(() => {
    dispatch(clearSearchedPosts());
  }, [dispatch]);
  const loaderRef = useCallback(
    (node) => {
      if (searchedPosts.status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip(searchedPosts.data.length);
        }
      });
      if (node) observer.current.observe(node);
    },
    [searchedPosts]
  );
  useEffect(() => {
    dispatch(searchPostsByHashTag({ hashtag, skip }));
  }, [hashtag, skip, dispatch]);
  return (
    <Layout>
      <h1 className="text-lightBlue text-center  mt-8 text-xl font-semibold">
        <span className="text-lightBlue font-medium">
          {searchedPosts?.data.length} Post
          {searchedPosts?.data.length > 1 && "s"} found for hashtag
        </span>{" "}
        <span className="text-lightBlue text-opacity-80">#{hashtag}</span>
      </h1>
      <div className="flex flex-col gap-4 justify-center items-center mt-5 w-ful">
        <PostsWrapper
          width="md:w-4/5 w-full"
          posts={searchedPosts}
          ref={loaderRef}
        />
      </div>
    </Layout>
  );
};
