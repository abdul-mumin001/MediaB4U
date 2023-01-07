import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { Layout, Loader, PostCard } from "../../components";
import { fetchPostInfo } from "../../services/posts/postsService";

export const PostPage = () => {
  const post = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { id } = useParams();
  useEffect(() => {
    if (!state) dispatch(fetchPostInfo(id));
  }, [id]);
  return (
    <Layout>
      {post.status === "succeeded" && !post.data && (
        <span className="text-center text-base font-medium text-lightBlue">
          Post not found
        </span>
      )}
      <div className="flex flex-col gap-4 ">
        {post.status === "succeeded" && post.data && (
          <PostCard post={post.data} />
        )}
        {state && <PostCard post={state} />}
      </div>
      {post.status === "loading" && <Loader type="medium" />}
    </Layout>
  );
};
