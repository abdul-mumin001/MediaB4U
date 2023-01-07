import React, { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSocket } from "../context";
import { useOnlineUsers } from "../context/onlineUsersContext";
import { followUser } from "../services/auth/authService";
import { formatUserInfo, PROFILE_PIC_PLACEHOLDER } from "../utils";
import { Modal } from "./Modal";
import { SendMessageForm } from "./SendMessageForm";
import { Status } from "./Status";

const UserCard = forwardRef(({ _user, type }, loaderRef) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const isFollowing = (id) => user?.following.includes(id);
  const isFollower = (id) => user?.followers.includes(id);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const { onlineUsers } = useOnlineUsers();
  const { socket } = useSocket();
  return (
    <div
      ref={loaderRef}
      key={_user._id}
      className={`p-2  gap-1 rounded-md flex flex-wrap   shadow-md  sm:items-center ${
        type === "small" ? "w-80" : "min-w-96"
      }  justify-between bg-white w-full`}
    >
      {showSendMessageModal && (
        <Modal setShowDropDown={setShowSendMessageModal}>
          <SendMessageForm
            profile={_user}
            setShowSendMessageModal={setShowSendMessageModal}
          />
        </Modal>
      )}
      <Link to={`/profile/${_user._id}`} className="flex items-center gap-2">
        <Status isOnline={onlineUsers.some((user) => user._id === _user._id)}>
          <img
            src={_user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
            alt="avatar"
            className={`${
              type === "small" ? "w-6 h-6" : "w-12 h-12"
            } rounded-full  mr-4`}
          />
        </Status>

        <h3
          className={`${
            type === "small" ? "text-md" : "text-lg"
          } text-lightBlue`}
        >
          {_user.name.length > 15
            ? _user.name.substr(0, 15) + "..."
            : _user.name}
        </h3>
      </Link>
      {_user._id !== user?._id && isFollowing(_user._id) && (
        <button
          // to={"/messages?to=" + _user._id}
          onClick={() => {
            setShowSendMessageModal(true);
          }}
          className={`bg-primary text-white rounded-full text-sm px-3 py-2
          `}
        >
          Send Message
        </button>
      )}
      {_user._id !== user?._id && !isFollowing(_user._id) && (
        <button
          onClick={() => {
            dispatch(
              followUser({
                followingId: _user._id,
                followerId: user?._id,
              })
            );
            socket.emit("sendNotification", {
              type: "follow",
              sender: formatUserInfo(user),
              reciever: _user._id,
            });
          }}
          className={`bg-primary text-white rounded-full text-sm px-3 py-2
          } `}
        >
          Follow {isFollower(_user._id) ? "Back" : ""}
        </button>
      )}
    </div>
  );
});

export default UserCard;
