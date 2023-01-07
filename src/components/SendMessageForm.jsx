import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { GrEmoji } from "react-icons/gr";
import { MdClose, MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconButton, Loader } from ".";
import { useSocket } from "../context";
import { useDropDown } from "../hooks/useDropDown";
import { sendMessage } from "../services/messages/messagesService";
import { formatUserInfo, PROFILE_PIC_PLACEHOLDER } from "../utils";
export const SendMessageForm = ({ profile, setShowSendMessageModal }) => {
  const messages = useSelector((state) => state.messages);
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [messageContent, setMessageContent] = useState("");
  const [dropDownRef, showEmojiPicker, setShowEmojiPicker] = useDropDown();

  return (
    <div
      style={{
        maxWidth: "90vw",
      }}
      className="  md:p-6 p-4 rounded-lg shadow-lg bg-white 
      overflow-y-auto m-4
        
       "
    >
      <div className="relative flex items-center gap-3 mb-3">
        <IconButton
          onClick={() => {
            setShowSendMessageModal(false);
          }}
          Icon={MdClose}
          className="absolute right-0 top-0 "
        />

        <Link to={`/profile/${profile?._id}`}>
          <img
            className=" shadow-sm cursor-pointer rounded-full w-10 h-10 "
            src={profile.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
            alt={profile.name}
          />
        </Link>
        <span className="text-lightBlue">{profile.name}</span>
      </div>
      <form
        onSubmit={() => {
          dispatch(
            sendMessage({
              from: user._id,
              content: messageContent,
              to: profile._id,
            })
          );
          socket.emit("sendNotification", {
            type: "message",
            sender: formatUserInfo(user),
            reciever: profile._id,
          });
          setMessageContent("");
          setShowEmojiPicker(false);
          setShowSendMessageModal(false);
        }}
      >
        <div className="form-group mb-6">
          <textarea
            autoFocus
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
            id="messageContent"
            rows={3}
            placeholder="Write something..."
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
          />
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4 relative">
          <div className="flex gap-2 items-center ">
            <IconButton
              Icon={GrEmoji}
              onClick={() => {
                setShowEmojiPicker(
                  (prevShowEmojiPicker) => !prevShowEmojiPicker
                );
              }}
            />
          </div>

          {messages.status !== "loading" ? (
            <button
              type="submit"
              disabled={messageContent.trim().length === 0}
              className={`
      w-full
      md:w-fit
      flex items-center
      justify-center
      gap-2
      px-3
      py-2.5
      ${
        messageContent.length === 0 && messages.status !== "loading"
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
              <span className="text-sm">Send</span>
              <MdSend size={15} />
            </button>
          ) : (
            <Loader type="mini" />
          )}
        </div>
        {showEmojiPicker && (
          <div className="mt-5" ref={dropDownRef}>
            <EmojiPicker
              onEmojiClick={(_, data) => {
                setMessageContent(messageContent + data.emoji);
              }}
              preload={true}
            />
          </div>
        )}
      </form>
    </div>
  );
};
