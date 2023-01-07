import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import { GrEmoji } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CommentSection } from ".";
import { useSocket } from "../context";
import { useDropDown } from "../hooks/useDropDown";
import {
  addComment,
  updateComment,
} from "../services/comments/commentsService";
import { formatUserInfo, PROFILE_PIC_PLACEHOLDER } from "../utils";
import { IconButton } from "./IconButton";
import { Loader } from "./Loader";
export const CommentsContainer = ({
  setIsCommentAdded,
  setIsCommentRemoved,
  commentCount,
  comments,
  userId,
  postId,
  postedBy,
  setSkip,
}) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const [isEditComment, setIsEditComment] = useState(false);
  const [dropDownRef, showEmojiPicker, setShowEmojiPicker] = useDropDown();

  useEffect(() => {
    setIsCommentAdded(false);
    setIsCommentRemoved(false);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditComment) {
            dispatch(
              updateComment({
                comment,
                commentedBy: userId,
                postId,
                _id: commentId,
              })
            );
            setComment("");
            return;
          }
          dispatch(addComment({ comment, commentedBy: userId, postId }));
          setIsCommentAdded(true);
          socket.emit("sendNotification", {
            type: "comment",
            sender: formatUserInfo(user),
            reciever: postedBy._id,
            payload: postId,
          });
          setIsCommentRemoved(false);
          setComment("");
        }}
        className="flex flex-wrap items-center gap-3 mb-3"
      >
        <div className="flex gap-2  md:items-center justify-between  md:flex-row flex-col px-2.5 flex-wrap  py-1 outline-none text-lightBlue  ease-in-out transition-all bg-lightBlue bg-opacity-5 focus-within:bg-opacity-5 focus-within:border-opacity-50 border border-transparent focus-within:border-primary  w-full   rounded-md ">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${userId}`}>
              <img
                className=" shadow-sm cursor-pointer rounded-full w-8 h-8 "
                src={user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
                alt="profilePicture"
              />
            </Link>
            <input
              type="text"
              name=""
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment something"
              id=""
              className=" h-auto bg-transparent outline-none  border-none w-8/12    "
              required
            />
          </div>
          <div className="flex  items-center  gap-2 relative self-end">
            <div className="flex gap-2 items-center z-10">
              <IconButton
                Icon={GrEmoji}
                onClick={() => {
                  setShowEmojiPicker(
                    (prevShowEmojiPicker) => !prevShowEmojiPicker
                  );
                }}
              />
            </div>
            {showEmojiPicker && (
              <div
                className=" absolute top-14 w-fit right-10 z-10"
                ref={dropDownRef}
              >
                <EmojiPicker
                  onEmojiClick={(_, data) => {
                    setComment(comment + data.emoji);
                  }}
                  preload={true}
                />
              </div>
            )}
            {comments.status !== "loading" ? (
              <button
                type="submit"
                disabled={comment.trim().length === 0}
                className={`
      w-full
      md:w-auto
      flex gap-1 items-center
      rounded-full
      px-3
      py-2
      ${
        comment.trim().length === 0 && comments.status !== "loading"
          ? "bg-slate-400"
          : "bg-primary"
      }
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-primary-700 hover:shadow-lg
      focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-primary-800 active:shadow-lg
      transition
      duration-150
      ease-in-out`}
              >
                <span className="text-sm">
                  {isEditComment ? "Update" : "Send"}
                </span>
                <MdSend size={15} />
              </button>
            ) : (
              <Loader type="mini" />
            )}
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-2 ml-2">
        {comments.status === "loading" && <Loader type="mini" />}
        {comments.data.length > 0 &&
          comments.data.map((comment) => {
            return (
              <CommentSection
                setIsCommentRemoved={setIsCommentRemoved}
                setIsCommentAdded={setIsCommentAdded}
                commentInfo={comment}
                postedBy={postedBy}
                key={comment._id}
                setIsEditComment={setIsEditComment}
                setComment={setComment}
                setCommentId={setCommentId}
              />
            );
          })}

        {commentCount > 5 && comments.status === "succeeded" && (
          <div
            onClick={() => {
              setSkip(comments.data.length);
            }}
            className="text-primary cursor-pointer"
          >
            Show more comments
          </div>
        )}
      </div>
    </div>
  );
};
