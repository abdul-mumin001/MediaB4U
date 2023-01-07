import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { GrEmoji } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Loader } from "../../components";
import { useSocket } from "../../context";
import { useDropDown } from "../../hooks/useDropDown";
import { sendMessage } from "../../services/messages/messagesService";
import { formatUserInfo } from "../../utils";

export const MessageForm = ({ activeConversation }) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);
  const [messageContent, setMessageContent] = useState("");
  const messages = useSelector((state) => state.messages);
  const [dropDownRef, showEmojiPicker, setShowEmojiPicker] = useDropDown();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        dispatch(
          sendMessage({
            from: user._id,
            content: messageContent,
            to:
              activeConversation.members[0]._id === user._id
                ? activeConversation.members[1]._id
                : activeConversation.members[0]._id,
          })
        );

        socket.emit("sendMessage", {
          conversationId: activeConversation._id,
          from: formatUserInfo(user),
          to:
            activeConversation.members[0]._id === user._id
              ? activeConversation.members[1]._id
              : activeConversation.members[0]._id,
          message: messageContent,
        });
        socket.emit("sendNotification", {
          type: "message",
          sender: formatUserInfo(user),
          reciever:
            activeConversation.members[0]._id === user._id
              ? activeConversation.members[1]._id
              : activeConversation.members[0]._id,
          payload: activeConversation._id,
        });
        setShowEmojiPicker(false);
        setMessageContent("");
      }}
    >
      <div
        className="form-group flex justify-between items-center  form-control
   
        w-full
        px-3
  
        text-base
        font-normal
        resize-none
        border-2
        text-gray-700
        bg-white bg-clip-padding
         border-gray-300
         
        rounded
        transition
        ease-in-out
       
        m-0
        focus-within:text-gray-700 focus-within:bg-white focus-within:border-primary focus-within:outline-none"
      >
        <textarea
          autoFocus
          className="
      w-full
      br-none
      focus:outline-none
       min-h-fit
      px-2
        py-3
      "
          id="messageContent"
          placeholder="Write something..."
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
        />
        <div className="flex justify-between items-center  gap-4 relative">
          <div className="flex gap-2 items-center">
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
              className=" absolute bottom-16 w-56 right-10"
              ref={dropDownRef}
            >
              <EmojiPicker
                onEmojiClick={(_, data) => {
                  setMessageContent(messageContent + data.emoji);
                }}
                preload={true}
              />
            </div>
          )}
          {messages.status !== "loading" ? (
            <button
              type="submit"
              disabled={messageContent.trim().length === 0}
              className={`
                    flex  gap-2 items-center
      w-full
      md:w-max
      px-6
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
      </div>
    </form>
  );
};
