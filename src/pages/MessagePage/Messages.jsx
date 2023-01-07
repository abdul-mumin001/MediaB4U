import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Loader } from "../../components";
import { useSocket } from "../../context";
import {
  deleteMessage,
  updateMessages,
} from "../../features/messages/messagesSlice";
import { fetchAllMessage } from "../../services/messages/messagesService";
import { ChatBubble } from "./ChatBubble";
export const Messages = ({ activeConversation, setActiveConversation }) => {
  const { socket } = useSocket();
  const messages = useSelector((state) => state.messages);
  const conversations = useSelector((state) => state.conversations);
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    socket.on("getMessage", (data) => {
      dispatch(
        updateMessages({
          conversationId: data.conversationId,
          sender: data.from,
          content: data.message,
          createdAt: Date.now(),
        })
      );
    });
    socket.on("getDeleteMessage", ({ messageId }) => {
      dispatch(
        deleteMessage({
          messageId,
        })
      );
    });
  }, [dispatch, socket]);
  const messgageRef = useRef();
  useEffect(() => {
    messages.status === "succeeded" &&
      messages.data.length > 0 &&
      messgageRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  }, [messgageRef, messages]);
  useEffect(() => {
    if (conversationId) {
      const _conversation = conversations?.data?.find(
        (conversation) => conversation._id === conversationId
      );
      if (_conversation) {
        setActiveConversation(_conversation);
      }
    }
  }, [conversationId]);
  useEffect(() => {
    activeConversation &&
      dispatch(
        fetchAllMessage({
          from: user._id,
          conversationId: activeConversation._id,
        })
      );
  }, [activeConversation]);
  return (
    <>
      {messages.status === "succeeded" && messages.data.length === 0 && (
        <h1 className="text-center w-full h-full grid place-content-center text-lightBlue text-lg">
          You don't have any conversation with{" "}
          {activeConversation.members[0]._id === user._id
            ? activeConversation.members[1].name
            : activeConversation.members[0].name}
        </h1>
      )}
      <div className="flex flex-col gap-2 p-4  overflow-y-auto  bg-opacity-30 ">
        {messages?.data?.length > 0 &&
          messages?.data?.map((message, i) => (
            <ChatBubble
              key={message._id}
              message={message}
              activeConversation={activeConversation}
              ref={i === messages.data.length - 1 ? messgageRef : null}
            />
          ))}
      </div>
      {messages.status === "loading" && <Loader type="medium" />}
    </>
  );
};
