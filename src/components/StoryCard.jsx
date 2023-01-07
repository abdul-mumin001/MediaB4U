import React from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { notify, PROFILE_PIC_PLACEHOLDER } from "../utils";

export const StoryCard = ({
  storyThumbnail = "http://res.cloudinary.com/dddfc84ni/image/upload/v1651546264/dl7s7nrhfr1lojeu32gk.jpg",
  profileName = "John Doe",
  profileImage = "https://www.gravatar.com/avatar/94d093eda664addd6e450d7e9881bcad?s=32&d=identicon&r=PG",
  isCreateStory = false,
}) => {
  const user = useSelector((state) => state.auth?.user);
  if (isCreateStory) {
    profileImage = user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER;
    profileName = user.name;
  }
  return (
    <div className="shadow-md rounded-md bg-white p-4  w-40 gap-4 flex flex-col hover:scale-105 focus:scale-105 ease-in-out transition-transform">
      {!isCreateStory ? (
        <img
          src={storyThumbnail}
          alt="Story Thumbnail"
          className="cursor-pointer rounded-md h-32 w-full object-cover"
        />
      ) : (
        <div
          onClick={() => {
            notify("Story adding feature is not available yet!", "error");
          }}
          className="gap-1 cursor-pointer rounded-md h-32 bg-slate-200 grid place-content-center place-items-center"
        >
          <MdAddCircleOutline
            size={40}
            className=" fill-lightBlue opacity-30 hover:fill-primary focus:fill-primary   hover:opacity-100 focus:opacity-100"
          />
          <span className="text-sm  text-lightBlue text-opacity-50 ">
            Create Story
          </span>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <img
          src={profileImage}
          alt="Profile Image"
          className="cursor-pointer rounded-full h-6 w-6"
        />

        <span className="text-lightBlue text-sm opacity-80 overflow-ellipsis">
          {profileName}
        </span>
      </div>
    </div>
  );
};
