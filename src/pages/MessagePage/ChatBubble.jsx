import React, { forwardRef, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSocket } from "../../context";
import { removeMessage } from "../../services/messages/messagesService";
import { formatDate, PROFILE_PIC_PLACEHOLDER } from "../../utils";
const WORD_LENGTH = 120;
export const ChatBubble = forwardRef(({ activeConversation, message }, ref) => {
  const user = useSelector((state) => state.auth.user);
  const { socket } = useSocket();
  const [showMore, setShowMore] = useState(false);
  const [wordLength, setWordLength] = useState(WORD_LENGTH);
  const dispatch = useDispatch();
  return (
    <div
      ref={ref}
      className={`p-1  gap-y-1  flex flex-wrap rounded-3xl sm:items-center w-fit items-center  h-fit ${
        message.sender._id === user._id
          ? "self-end  bg-primary text-white"
          : "self-start bg-white text-lightBlue"
      }  `}
    >
      <Link
        to={`/profile/${message.sender._id}`}
        className="flex items-center gap-2"
      >
        <img
          src={message.sender.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
          alt="avatar"
          className={` w-8 h-8
                rounded-full  `}
        />
      </Link>
      <p className="px-3 ">
        {message.content.slice(0, wordLength)}
        {message.content.length > WORD_LENGTH && (
          <div
            onClick={() => {
              setShowMore(!showMore);
              if (showMore) {
                setWordLength(WORD_LENGTH);
              } else {
                setWordLength(message.content.length);
              }
            }}
            className="text-primary cursor-pointer"
          >
            Show {!showMore ? "more" : "less"}
          </div>
        )}
      </p>
      <p className=" text-xs text-opacity-80 px-3">
        {formatDate(message.createdAt)}
      </p>
      {user._id === message.sender._id && (
        <BiTrash
          onClick={() => {
            dispatch(
              removeMessage({
                to:
                  activeConversation.members[0]._id === user._id
                    ? activeConversation.members[1]._id
                    : activeConversation.members[0]._id,
                from: user._id,
                _id: message._id,
                conversationId: message.conversationId,
              })
            );
            socket.emit("deleteMessage", {
              to:
                activeConversation.members[0]._id === user._id
                  ? activeConversation.members[1]._id
                  : activeConversation.members[0]._id,
              messageId: message._id,
            });
          }}
          className="fill-lightBlue cursor-pointer focus:bg-primary hover:bg-primary hover:fill-white focus:fill-white w-6  h-6 p-1 shadow-md rounded-full bg-white transition-all ease-in-out"
        />
      )}
    </div>
  );
});
