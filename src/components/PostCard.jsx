import React, { forwardRef, useEffect, useState } from "react";
import { BiArchive, BiTrash } from "react-icons/bi";
import {
  MdArrowBack,
  MdArrowForward,
  MdBookmark,
  MdBookmarkBorder,
  MdComment,
  MdEdit,
  MdFavorite,
  MdFavoriteBorder,
  MdMoreHoriz,
  MdPersonAdd,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CommentsContainer, DropDownOption, EditPostForm, Modal } from ".";
import { useSocket } from "../context";
import { useOnlineUsers } from "../context/onlineUsersContext";
import { clearComments } from "../features/comments/commentsSlice";
import { useDropDown } from "../hooks/useDropDown";
import { followUser, unfollowUser } from "../services/auth/authService";
import { fetchAllComment } from "../services/comments/commentsService";
import { dislikePost, likePost } from "../services/likePost/likePostService";
import {
  addPostToArchive,
  bookmarkPost,
  deletePost,
  removePostFromArchive,
  unBookmarkPost,
} from "../services/posts/postsService";
import {
  formatUserInfo,
  isValidURL,
  notify,
  PROFILE_PIC_PLACEHOLDER,
  timeSince,
} from "../utils";
import { Loader } from "./Loader";
import { Status } from "./Status";
const WORD_LENGTH = 250;
export const PostCard = forwardRef(({ post, type }, ref) => {
  const {
    _id,
    postedBy: { profilePictureURL, name, _id: id },
    createdAt,
    content,
    likes,
    commentCount,
  } = post;
  let { mediaURLs } = post;
  mediaURLs = mediaURLs.filter((media) => media?.url);
  const [_likes, _setLikes] = useState(likes);
  const dispatch = useDispatch();
  const archivedPosts = useSelector((state) => state.archivedPosts);
  const bookmarkedPosts = useSelector((state) => state.bookmarkedPosts);
  const likedPost = useSelector((state) => state.likedPost);
  const following = useSelector((state) => state.following);
  const followers = useSelector((state) => state.followers);

  const isPostBookmarked = bookmarkedPosts?.data?.some(
    (post) => post?._id === _id
  );
  const isPostArchived = archivedPosts?.data?.some((post) => post?._id === _id);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const userId = useSelector((state) => state.auth?.user?._id);
  const comments = useSelector((state) => state.comments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOptionClicked, setIsEditOptionClicked] = useState(false);
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [isCommentRemoved, setIsCommentRemoved] = useState(false);
  const [skip, setSkip] = useState(0);
  const [_commentCount, _setCommentCount] = useState(commentCount);
  const [showMore, setShowMore] = useState(false);
  const [wordLength, setWordLength] = useState(WORD_LENGTH);
  const { onlineUsers } = useOnlineUsers();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { socket } = useSocket();
  const isFollowing = (id) => user?.following.includes(id);
  const isFollower = (id) => user?.followers.includes(id);
  const [dropDownRef, showDropDown, setShowDropDown] = useDropDown();
  useEffect(() => {
    if (isCommentClicked) {
      dispatch(clearComments());
      dispatch(fetchAllComment({ _id, skip }));
    }
  }, [isCommentClicked]);
  useEffect(() => {
    dispatch(fetchAllComment({ _id, skip }));
  }, [skip]);
  useEffect(() => {
    setIsCommentAdded(false);
    setIsCommentRemoved(false);
  }, []);
  useEffect(() => {
    if (comments.status === "succeeded") {
      if (isCommentAdded)
        _setCommentCount((prevCommentCount) => prevCommentCount + 1);
      if (isCommentRemoved)
        _setCommentCount((prevCommentCount) => prevCommentCount - 1);
    }
  }, [comments, isCommentAdded, dispatch, isCommentRemoved]);
  const nextMedia = () => {
    if (activeMediaIndex < mediaURLs.length - 1) {
      setActiveMediaIndex(activeMediaIndex + 1);
    } else {
      setActiveMediaIndex(0);
    }
  };
  const prevMedia = () => {
    if (activeMediaIndex > 0) {
      setActiveMediaIndex(activeMediaIndex - 1);
    } else {
      setActiveMediaIndex(mediaURLs.length - 1);
    }
  };
  const MediaSection = () => {
    if (mediaURLs.length > 0) {
      return (
        <div className="flex items-center gap-4 relative ">
          {mediaURLs.length > 1 && (
            <MdArrowBack
              onClick={prevMedia}
              className="fill-lightBlue absolute -left-5 h-8 w-8 sm:left-0 rounded-full cursor-pointer focus:bg-primary hover:bg-primary hover:fill-white focus:fill-white sm:w-10 sm:h-10 p-1 shadow-md  transition-all ease-in-out"
            />
          )}
          {mediaURLs[activeMediaIndex]?.url && (
            <Link to={`/posts/${_id}`} state={post} className="w-full">
              <img
                className="w-full object-contain max-h-48 "
                src={mediaURLs[activeMediaIndex]?.url}
                alt="postImage"
              />
            </Link>
          )}
          {mediaURLs.length > 1 && (
            <MdArrowForward
              onClick={nextMedia}
              className="fill-lightBlue absolute -right-5 sm:right-0 h-8 w-8 cursor-pointer focus:bg-primary hover:bg-primary hover:fill-white focus:fill-white sm:w-10 sm:h-10 p-1 shadow-md rounded-full transition-all ease-in-out"
            />
          )}
        </div>
      );
    }
  };
  const DropDown = () => {
    return (
      <div
        ref={dropDownRef}
        className="z-10 rounded-md p-1  flex flex-col w-max h-max   bg-slate-600 shadow-xl text-white absolute right-2 top-16"
      >
        {userId !== id && !isFollowing(id) && (
          <DropDownOption
            onClick={() => {
              dispatch(
                followUser({
                  followerId: userId,
                  followingId: id,
                })
              );
              socket.emit("sendNotification", {
                type: "follow",
                sender: formatUserInfo(user),
                reciever: id,
              });
              setShowDropDown(false);
              setIsEditOptionClicked(true);
            }}
            Icon={MdPersonAdd}
            name={isFollower(id) ? "Follow" : "Follow back"}
          />
        )}
        {userId !== id && isFollowing(id) && (
          <DropDownOption
            onClick={() => {
              dispatch(unfollowUser({ followerId: userId, followingId: id }));
              setShowDropDown(false);
              setIsEditOptionClicked(true);
            }}
            Icon={MdPersonAdd}
            name="unfollow"
          />
        )}
        {userId === id && (
          <DropDownOption
            onClick={() => {
              setIsModalOpen(true);
              setIsEditOptionClicked(true);
            }}
            Icon={MdEdit}
            name="Edit Post"
          />
        )}
        {userId === id && (
          <DropDownOption
            Icon={BiTrash}
            name="Delete Post"
            onClick={() => {
              dispatch(deletePost({ postId: _id, postedBy: userId }));
              if (pathname.includes("posts")) {
                navigate(-1);
              }
              setShowDropDown(false);
            }}
          />
        )}
        {!isPostArchived && userId === id && (
          <DropDownOption
            Icon={BiArchive}
            name="Archive Post"
            onClick={() => {
              setShowDropDown(false);
              dispatch(addPostToArchive({ postId: _id, postedBy: userId }));
            }}
          />
        )}
        {type === "archive" && (
          <DropDownOption
            Icon={BiArchive}
            name="Remove from Archive"
            onClick={() => {
              setShowDropDown(false);
              dispatch(
                removePostFromArchive({ postId: _id, postedBy: userId })
              );
            }}
          />
        )}
      </div>
    );
  };

  const [isPostLiked, setIsPostLiked] = useState(
    _likes?.some((like) => like === userId)
  );
  useEffect(() => {
    setIsPostLiked(_likes?.some((like) => like === userId));
  }, [_likes, userId]);

  return (
    <div
      ref={ref}
      className=" p-6 relative rounded-lg shadow-sm bg-white   gap-4 flex flex-col "
    >
      {(followers.status === "loading" || following.status === "loading") && (
        <Loader />
      )}
      {userId === id && isModalOpen && isEditOptionClicked && (
        <Modal setShowModal={setIsModalOpen}>
          <EditPostForm
            postInfo={post}
            setIsEditOptionClicked={setIsEditOptionClicked}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
      {showDropDown && <DropDown />}
      <div className="flex  justify-between">
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/profile/${id}`}>
            <Status isOnline={onlineUsers.some((_user) => _user._id === id)}>
              <img
                className=" shadow-sm cursor-pointer rounded-full w-10 h-10 object-cover "
                src={profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
                alt="profilePicture"
              />
            </Status>
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${id}`}>
              <span className="text-lightBlue">{name}</span>
            </Link>
            <span className="text-sm text-lightBlue text-opacity-70">
              {timeSince(createdAt)} ago
            </span>
          </div>
        </div>
        <MdMoreHoriz
          onClick={() => {
            !showDropDown && setShowDropDown(true);
          }}
          className="fill-lightBlue cursor-pointer focus:bg-primary hover:bg-primary hover:fill-white focus:fill-white w-10 h-8 p-1 shadow-md rounded-md transition-all ease-in-out"
        />
      </div>
      <div className="flex flex-col gap-5">
        <MediaSection />
        <Link
          to={`/posts/${_id}`}
          state={post}
          className="text-lightBlue leading-relaxed break-words flex flex-wrap gap-x-2 gap-y-0.5"
        >
          {content
            ?.substr(0, wordLength)
            ?.split(" ")
            .map((word, i) => {
              if (word.startsWith("#"))
                return (
                  <React.Fragment key={word + i}>
                    {" "}
                    <Link
                      to={`/posts?hashtag=${word.slice(1)}`}
                      className={`text-primary`}
                    >
                      {word}
                    </Link>
                  </React.Fragment>
                );
              if (isValidURL(word))
                return (
                  <a
                    key={word + i}
                    href={word}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary "
                  >
                    {word}
                  </a>
                );
              return word + " ";
            })}
        </Link>
        {content.length > WORD_LENGTH && (
          <div
            onClick={() => {
              setShowMore(!showMore);
              if (showMore) {
                setWordLength(WORD_LENGTH);
              } else {
                setWordLength(content.length);
              }
            }}
            className="text-primary cursor-pointer"
          >
            Show {!showMore ? "more" : "less"}
          </div>
        )}
      </div>
      <div className="flex gap-x-10 gap-y-4 items-end flex-wrap">
        <div className="flex md:gap-3 gap-1 items-center md:flex-row flex-col">
          {!isPostLiked ? (
            <MdFavoriteBorder
              onClick={() => {
                if (userId !== id) {
                  dispatch(
                    likePost({
                      likedBy: userId,
                      id: _id,
                      postedBy: id,
                    })
                  );

                  socket.emit("sendNotification", {
                    type: "like",
                    sender: formatUserInfo(user),
                    reciever: id,
                    data: _id,
                  });

                  _setLikes((_prevLikes) => [..._prevLikes, userId]);
                } else {
                  notify("You can't like your own post", "error");
                }
              }}
              size={25}
              className="fill-primary cursor-pointer order-1 md:-order-1"
            />
          ) : (
            <MdFavorite
              onClick={() => {
                if (userId !== id) {
                  dispatch(
                    dislikePost({
                      dislikedBy: userId,
                      id: _id,
                      postedBy: id,
                    })
                  );
                  _setLikes(_likes.filter((like) => like !== userId));
                } else {
                  notify("You can't dislike your own post", "error");
                }
              }}
              size={25}
              className="fill-primary cursor-pointer order-1 md:-order-1"
            />
          )}

          <span className="text-lightBlue ">
            {_likes.length}{" "}
            <span className="hidden md:inline">
              Like
              {_likes.length > 1 ? "s" : ""}
            </span>
          </span>
        </div>
        <div
          className="flex md:gap-3 gap-1 items-center md:flex-row flex-col cursor-pointer"
          onClick={() => {
            setIsCommentClicked(
              (prevIsCommentClicked) => !prevIsCommentClicked
            );
          }}
        >
          <MdComment size={25} className="fill-primary order-1 md:-order-1" />
          <span className="text-lightBlue">
            {_commentCount}{" "}
            <span className="hidden md:inline">
              Comment
              {_commentCount > 1 ? "s" : ""}
            </span>
          </span>
        </div>
        <div className="flex md:gap-3 gap-1  md:flex-row flex-col cursor-pointer">
          {type === "bookmarked" || isPostBookmarked ? (
            <MdBookmark
              onClick={() => {
                setShowDropDown(false);
                dispatch(unBookmarkPost({ postedBy: userId, postId: _id }));
              }}
              size={25}
              className="fill-primary cursor-pointer order-1 md:-order-1"
            />
          ) : (
            <MdBookmarkBorder
              size={25}
              className="fill-primary cursor-pointer order-1 md:-order-1"
              onClick={() => {
                setShowDropDown(false);
                dispatch(bookmarkPost({ postedBy: userId, postId: _id }));
              }}
            />
          )}

          <span className="hidden md:inline text-lightBlue">Bookmark</span>
        </div>
      </div>

      {isCommentClicked && (
        <CommentsContainer
          setIsCommentAdded={setIsCommentAdded}
          setIsCommentRemoved={setIsCommentRemoved}
          setSkip={setSkip}
          comments={comments}
          commentCount={commentCount}
          userId={userId}
          postId={_id}
          onClick={() => {}}
          postedBy={post.postedBy}
        />
      )}
    </div>
  );
});
