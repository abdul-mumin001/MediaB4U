import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { PROFILE_PIC_PLACEHOLDER } from "../../utils";

export const VideoCard = forwardRef(({ userInfo }, videoRef) => {
  return (
    <div className="flex flex-col gap-2  shadow-xl bg-white md:w-5/12 w-11/12 ">
      <div className="flex items-center flex-wrap gap-2 p-2 bg-primary text-white">
        <Link to={`/profile/${userInfo?._id}`}>
          <img
            className=" shadow-sm cursor-pointer rounded-full w-10 h-10 "
            src={userInfo.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
            alt={userInfo.name}
          />
        </Link>
        <span className="text-lg">{userInfo.name}</span>
      </div>
      <video
        playsInline
        muted
        autoPlay
        ref={videoRef}
        className=" aspect-video w-full"
      ></video>
    </div>
  );
});
