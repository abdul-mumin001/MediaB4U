import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AuthButton, IconButton, Loader } from "../../components";
import { updateProfileInfo } from "../../services/auth/authService";
import { uploadImages } from "../../services/cloudinary/cloudinaryService";
import { COVER_PHOTO_PLACEHOLDER, PROFILE_PIC_PLACEHOLDER } from "../../utils";

export const ProfileEditForm = ({ profileInfo, setIsEditProfile }) => {
  const user = useSelector((state) => state.auth?.user);
  const profileUpdateStatus = useSelector((state) => state.profile?.status);
  const dispatch = useDispatch();
  const initialProfileState = {
    name: profileInfo.name,
    profilePictureURL: profileInfo.profilePictureURL,
    coverPictureURL: profileInfo.coverPictureURL,
    bio: profileInfo.bio,
    portfolioUrl: profileInfo.portfolioUrl,
  };
  const [isUpdadted, setIsUpdadted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [profileData, setProfileData] = useState(initialProfileState);
  useEffect(() => {
    if (profileUpdateStatus === "succeeded" && isUpdadted) {
      setIsEditProfile(false);
    }
  }, [profileUpdateStatus]);
  return (
    <form
      className="bg-white p-6 rounded-md m-6 relative  overflow-auto"
      onSubmit={async (e) => {
        e.preventDefault();
        const urls = [];
        setLoading(true);
        if (profileImage) {
          const _urls = await uploadImages([profileImage], user?._id);
          urls.push(_urls[0]);
        }
        if (coverImage) {
          const _urls = await uploadImages([coverImage], user?._id);
          urls.push(_urls[0]);
        }
        let _profileInfo;
        if (urls.length > 0) {
          _profileInfo = {
            ...profileData,
            profilePictureURL: urls[0],
            coverPictureURL: urls[1],
            id: user?._id,
          };
        } else {
          _profileInfo = {
            ...profileData,
            id: user?._id,
          };
        }
        dispatch(updateProfileInfo(_profileInfo));
        setProfileData(initialProfileState);
        setProfileImage("");
        setCoverImage("");
        setLoading(false);
        setIsUpdadted(true);
      }}
    >
      <IconButton
        onClick={() => {
          setIsEditProfile(false);
        }}
        Icon={MdClose}
        className="absolute right-4 top-4 "
      />
      <h1 className="mb-4 text-lightBlue">Update Profile</h1>
      <div className="form-group mb-4 flex gap-4">
        <label htmlFor="profilePic" className="cursor-pointer">
          <h2 className="text-lightBlue mb-4">Profile Photo</h2>

          <img
            src={profileData.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
            alt={profileData.name}
            className="  object-cover w-48"
          />
        </label>
        <input
          type="file"
          accept="image/*"
          multiple={false}
          className="hidden"
          id="profilePic"
          onChange={(e) => {
            setProfileImage(e.target.files[0]);
            setProfileData({
              ...profileData,
              profilePictureURL: URL.createObjectURL(e.target.files[0]),
            });
          }}
        />
        <label htmlFor="coverPic" className="cursor-pointer">
          <h2 className="text-lightBlue mb-4">Cover Photo</h2>
          <img
            src={profileData.coverPictureURL ?? COVER_PHOTO_PLACEHOLDER}
            alt={profileData.name}
            className=" object-cover w-48"
          />
        </label>
        <input
          type="file"
          className="hidden"
          id="coverPic"
          accept="image/*"
          onClick={(e) => {
            setCoverImage(e.target.files[0]);
            setProfileData({
              ...profileData,
              coverPictureURL: URL.createObjectURL(e.target.files[0]),
            });
          }}
        />
      </div>

      <div className="form-group mb-4">
        <label
          htmlFor="name"
          className="form-label inline-block mb-2 text-gray-700"
        >
          Full name
        </label>
        <input
          value={profileData.name}
          onChange={(e) =>
            setProfileData({ ...profileData, name: e.target.value })
          }
          type="text"
          className="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none"
          id="name"
          aria-describedby="emailHelp"
          placeholder="Enter full name"
          required
        />
      </div>
      <div className="form-group mb-6">
        <label
          htmlFor="bio"
          className="form-label inline-block mb-2 text-gray-700"
        >
          Update Bio
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) =>
            setProfileData({ ...profileData, bio: e.target.value })
          }
          className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        resize-none
        border-b-2
        text-gray-700
        bg-white bg-clip-padding
         border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
      "
          id="bio"
          rows={3}
          placeholder="Enter your bio"
        />
      </div>
      <div className="form-group mb-4">
        <label
          htmlFor="portfolio"
          className="form-label inline-block mb-2 text-gray-700"
        >
          Portfolio Url
        </label>
        <input
          value={profileData.portfolioUrl}
          onChange={(e) =>
            setProfileData({ ...profileData, portfolioUrl: e.target.value })
          }
          type="url"
          className="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none"
          id="portfolio"
          aria-describedby="emailHelp"
          placeholder="Enter Portfolio Url"
        />
      </div>
      {!profileUpdateStatus === "loading" || loading ? (
        <Loader type="mini" />
      ) : (
        <AuthButton name="Update Profile" />
      )}
    </form>
  );
};
