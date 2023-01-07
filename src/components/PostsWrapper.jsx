import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { PostCard } from ".";
import { NotAvailable } from "./NotAvailable";
import { PostLoader } from "./PostLoader";

export const PostsWrapper = forwardRef(
  ({ posts, children, width = "", type }, ref) => {
    const archivedPosts = useSelector((state) => state.archivedPosts?.data);

    let isPostArchived;
    if (type === "archive") {
      isPostArchived = () => false;
    } else {
      isPostArchived = (id) => archivedPosts?.some((post) => post?._id === id);
    }
    return (
      <div className={` ${width} flex flex-col gap-4`} >
        {children}

        {posts.status === "succeeded" && posts.data.length === 0 && (
          <NotAvailable title="No posts found" />
        )}
        <div className="flex flex-col gap-4 ">
          {posts.data.map(
            (post, i) =>
              post &&
              !isPostArchived(post._id) && (
                <PostCard
                  key={post._id}
                  post={post}
                  type={type}
                  ref={i === posts.data.length - 1 ? ref : null}
                />
              )
          )}
        </div>
        {posts.status === "loading" && <PostLoader />}
      </div>
    );
  }
);
