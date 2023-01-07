import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdVideoCall } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../../components";
import { SendMessageForm } from "../../components/SendMessageForm";
import { useSocket } from "../../context";
import { useOnlineUsers } from "../../context/onlineUsersContext";
import { updateUser } from "../../features/auth/authSlice";
import { updateProfile } from "../../features/profile/profileSlice";
import { followUser, unfollowUser } from "../../services/auth/authService";
import {
  COVER_PHOTO_PLACEHOLDER,
  formatUserInfo,
  notify,
  PROFILE_PIC_PLACEHOLDER,
} from "../../utils";
import { ProfileEditForm } from "./ProfileEditForm";

export const ProfileHeader = ({ profile }) => {
  const postCount = useSelector(
    (state) => state.userCreatedPosts?.data?.length
  );
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const isFollowing = user?.following.includes(profile?._id);
  const isFollower = user?.followers.includes(profile?._id);
  const { onlineUsers } = useOnlineUsers();
  const { socket } = useSocket();
  const ProfileTitle = () => {
    return (
      <div className="flex  flex-col md:flex-row justify-center md:justify-start  items-center gap-3">
        <div className="relative">
          <img
            className=" w-28 h-28  rounded-full border-4 shadow-sm aspect-square border-primary object-cover "
            src={profile.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
            alt={profile.name}
          />
          {user._id === profile._id && (
            <BiEditAlt
              onClick={() => {
                setShowEditProfileModal(true);
              }}
              className="cursor-pointer absolute top-2 right-0 p-2 w-10 h-10 rounded-full shadow-md bg-lightBlue fill-white"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <h1 className=" text-xl  text-lightBlue">{profile.name}</h1>
          {user?._id !== profile?._id && !isFollowing && (
            <button
              onClick={() => {
                dispatch(
                  followUser({
                    followingId: profile?._id,
                    followerId: user._id,
                  })
                );
                socket.emit("sendNotification", {
                  type: "follow",
                  sender: formatUserInfo(user),
                  reciever: profile._id,
                });
                const newUser = {
                  ...user,
                  following: [...user.following, profile?._id],
                };
                const newProfile = {
                  ...profile,
                  followers: [...profile.followers, user?._id],
                };
                dispatch(updateProfile({ profile: newProfile }));
                dispatch(updateUser({ user: newUser }));
              }}
              className="px-4 rounded-full py-1.5 bg-primary text-white "
            >
              Follow {isFollower ? "Back" : ""}
            </button>
          )}
          {user?._id !== profile?._id && isFollowing && (
            <button
              onClick={() => {
                dispatch(
                  unfollowUser({
                    followingId: profile?._id,
                    followerId: user._id,
                  })
                );
                const _user = user;
                const newUser = {
                  ...user,
                  following: _user.following.filter(
                    (id) => id !== profile?._id
                  ),
                };
                const _profile = profile;
                const newProfile = {
                  ...profile,
                  followers: _profile.followers.filter(
                    (id) => id !== user?._id
                  ),
                };
                dispatch(updateProfile({ profile: newProfile }));
                dispatch(updateUser({ user: newUser }));
              }}
              className="px-4 rounded-full py-1.5 bg-primary text-white "
            >
              Unfollow
            </button>
          )}
        </div>
      </div>
    );
  };
  const ProfileStats = () => {
    return (
      <div className="flex  sm:gap-6 gap-4 text-lightBlue flex-wrap items-center justify-center ">
        <h1>
          <span className="font-semibold mr-2">{postCount}</span> post
          {postCount > 1 ? "s" : ""}
        </h1>
        <Link to={`/users/${profile._id}/followers`}>
          <span className="font-semibold mr-2">{profile.followers.length}</span>
          follower{profile.followers.length > 1 ? "s" : ""}
        </Link>
        <Link to={`/users/${profile._id}/following`}>
          <span className="font-semibold mr-2">{profile.following.length}</span>
          following
        </Link>
      </div>
    );
  };
  const ProfileBio = () => {
    return (
      <div className="   flex flex-col md:items-start items-center gap-1 md:text-left text-center flex-wrap   text-lightBlue">
        {profile.bio && (
          <p className="text-lightBlue text-opacity-95">{profile.bio}</p>
        )}
        {profile.portfolioUrl && (
          <a
            className="sm:w-max text-primary"
            href={profile.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.portfolioUrl}
          </a>
        )}
      </div>
    );
  };
  const ProfileActions = () => {
    return (
      <div className="flex   items-center gap-2 flex-wrap">
        {user?._id !== profile?._id && (
          <button
            onClick={() => {
              setShowSendMessageModal(true);
            }}
            className="px-4 rounded-full py-1.5 bg-lightBlue text-white "
          >
            Send Message
          </button>
        )}
        {user?._id !== profile?._id && isFollowing && (
          <button
            onClick={() => {
              if (!onlineUsers.some((user) => user._id === profile?._id)) {
                notify("Can't make a call as the user is not online", "error");
                return;
              }
              navigate("/videochat/" + profile?._id + "?isCalling=true");
            }}
            className="px-4 rounded-full py-1.5 bg-secondary text-white flex gap-1.5 items-center"
          >
            <MdVideoCall size={20} />
            <span>Video call</span>
          </button>
        )}
      </div>
    );
  };
  return (
    <div className="flex flex-col bg-white  ">
      {showEditProfileModal && (
        <Modal setShowModal={setShowEditProfileModal}>
          <ProfileEditForm
            profileInfo={profile}
            setIsEditProfile={setShowEditProfileModal}
          />
        </Modal>
      )}
      {showSendMessageModal && (
        <Modal setShowModal={setShowSendMessageModal}>
          <SendMessageForm
            profile={profile}
            setShowSendMessageModal={setShowSendMessageModal}
          />
        </Modal>
      )}
      <img
        className="sm:h-28 h-28 object-cover"
        src={profile.coverPictureURL ?? COVER_PHOTO_PLACEHOLDER}
        alt={profile.name}
      />
      <div className="flex flex-col gap-2 md:justify-start justify-center p-6 ">
        <div className="flex flex-col flex-wrap md:flex-row items-center justify-center md:justify-start gap-1 md:gap-6">
          <ProfileTitle />
          <ProfileStats />
          <ProfileActions />
        </div>

        <ProfileBio />
      </div>
    </div>
  );
};
