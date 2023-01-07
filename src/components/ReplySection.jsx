import React from "react";
import { Link } from "react-router-dom";
import { PROFILE_PIC_PLACEHOLDER } from "../utils";

export const ReplySection = ({ replyInfo }) => {
  const {
    reply,
    repliedBy: { _id: id, profilePictureURL, name },
  } = replyInfo;
  return (
    <div className="flex flex-wrap  gap-2 item-center  ">
      <Link to={`/profile/${id}`}>
        <img
          className=" shadow-sm cursor-pointer rounded-full w-8 h-8 "
          src={profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
          alt="profilePicture"
        />
      </Link>
      <div className="flex flex-col gap-1 w-full sm:min-w-max ">
        <div className="flex flex-col bg-lightBlue bg-opacity-5 p-2.5 rounded-md">
          <span className="text-lightBlue">{name}</span>
          <span className="text-sm text-lightBlue text-opacity-70">
            {reply}
          </span>
        </div>
      </div>
    </div>
  );
};
