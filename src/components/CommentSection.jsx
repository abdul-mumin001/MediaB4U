import React, { useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { MdMoreHoriz } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDropDown } from "../hooks/useDropDown";
import { removeComment } from "../services/comments/commentsService";
import { PROFILE_PIC_PLACEHOLDER, timeSince } from "../utils";
import { DropDownOption } from "./DropDownOption";

const WORD_LENGTH = 250;
export const CommentSection = ({
  commentInfo,
  setIsCommentRemoved,
  setIsCommentAdded,
  setIsEditComment,
  setComment,
  setCommentId,
}) => {
  const {
    postId,
    _id,
    comment,
    commentedBy: { _id: id, profilePictureURL, name },
    createdAt,
  } = commentInfo;
  const dispatch = useDispatch();
  const [dropDownRef, showDropDown, setShowDropDown] = useDropDown();
  const [showMore, setShowMore] = useState(false);
  const [wordLength, setWordLength] = useState(WORD_LENGTH);
  const user = useSelector((state) => state.auth.user);
  const DropDown = () => {
    return (
      <div
        ref={dropDownRef}
        className="z-10  rounded-md p-05  flex flex-col   bg-slate-600 shadow-xl text-white absolute right-0 top-10"
      >
        <DropDownOption
          Icon={BiEdit}
          type="small"
          name="Edit"
          onClick={() => {
            setIsEditComment(true);
            setComment(comment);
            setCommentId(_id);

            setShowDropDown(false);
          }}
        />
        <DropDownOption
          Icon={BiTrash}
          type="small"
          name="Delete"
          onClick={() => {
            dispatch(removeComment({ _id, postId }));
            setIsCommentRemoved(true);
            setIsCommentAdded(false);
          }}
        />
      </div>
    );
  };
  return (
    <div className="flex flex-wrap  gap-2 item-center  ">
      <Link to={`/profile/${id}`}>
        <img
          className=" shadow-xl border-lightBlue border-opacity-30 border cursor-pointer rounded-full w-8 h-8 "
          src={profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
          alt="profilePicture"
        />
      </Link>
      <div className="flex flex-col flex-wrap gap-1 w-full ">
        <div className="relative flex flex-wrap justify-between bg-lightBlue bg-opacity-5 p-2.5 rounded-md     min-w-fit w-full">
          <div className="flex flex-col flex-wrap">
            <span className="text-lightBlue">{name}</span>
            <span className="text-sm text-lightBlue text-opacity-80 break-words">
              {comment
                ?.substr(0, wordLength)
                ?.split(" ")
                .map((word, i) => {
                  if (word.startsWith("#"))
                    return (
                      <>
                        {" "}
                        <Link
                          key={word}
                          to={`/posts?hashtag=${word.slice(1)}`}
                          className={`text-primary`}
                        >
                          {word}
                        </Link>
                      </>
                    );

                  return word + " ";
                })}
              {comment.length > WORD_LENGTH && (
                <div
                  onClick={() => {
                    setShowMore(!showMore);
                    if (showMore) {
                      setWordLength(WORD_LENGTH);
                    } else {
                      setWordLength(comment.length);
                    }
                  }}
                  className="text-primary cursor-pointer"
                >
                  Show {!showMore ? "more" : "less"}
                </div>
              )}
            </span>
            <span className="text-xs text-lightBlue text-opacity-60">
              {timeSince(createdAt)} ago
            </span>
          </div>
          {commentInfo.commentedBy._id === user._id && (
            <MdMoreHoriz
              onClick={() =>
                setShowDropDown((prevshowDropDown) => !prevshowDropDown)
              }
              className="fill-lightBlue cursor-pointer focus:bg-primary hover:bg-primary hover:fill-white focus:fill-white w-6 h-6 p-1 shadow-md rounded-md transition-all ease-in-out"
            />
          )}
          {showDropDown && <DropDown />}
        </div>
      </div>
    </div>
  );
};
