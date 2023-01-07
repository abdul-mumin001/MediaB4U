import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, NotAvailable, Status } from "../../components";
import { useOnlineUsers } from "../../context/onlineUsersContext";
import { clearConversations } from "../../features/conversations/conversationsSlice";
import { clearMessages } from "../../features/messages/messagesSlice";
import {
  createConversation,
  fetchAllConversation,
} from "../../services/messages/messagesService";
import { PROFILE_PIC_PLACEHOLDER } from "../../utils";

export const Conversations = ({
  setActiveConversation,
  activeConversation,
}) => {
  const user = useSelector((state) => state.auth.user);
  const conversations = useSelector((state) => state.conversations);
  const { onlineUsers } = useOnlineUsers();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    dispatch(clearMessages());
    dispatch(clearConversations());
    if (searchParams?.get("to")) {
      dispatch(
        createConversation({ to: searchParams?.get("to"), from: user._id })
      );
    }

    dispatch(fetchAllConversation(user._id));
  }, [searchParams]);
  return (
    <div
      className={` flex flex-col  md:w-4/12 gap-4 ${
        conversations.status === "succeeded" && conversations.data.length === 0
          ? "md:w-full"
          : ""
      }   ${conversations.status === "loading" ? "md:w-full" : ""}
       ${!activeConversation ? "md:w-full" : ""}
      w-full  overflow-y-auto md:overflow-hidden md:overflow-x-auto md:h-96  `}
    >
      {conversations.status === "succeeded" && conversations.data.length === 0 && (
        <>
          <NotAvailable />
          <h1 className="text-center text-lightBlue text-lg">
            You don't have any conversation
          </h1>
        </>
      )}
      <div className="flex md:flex-col gap-1  ">
        {conversations.status === "succeeded" &&
          conversations?.data?.length > 0 &&
          conversations?.data?.map((conversation, i) => (
            <button
              key={conversation._id}
              onClick={() => {
                setActiveConversation(conversation);
                dispatch(clearMessages());
                navigate(`/messages/${conversation._id}`);
              }}
              className={`md:p-4 p-2  md:gap-4 gap-2   rounded-md flex flex-wrap min-w-min   shadow-xl justify-between sm:items-center md:min-w-96   ${
                activeConversation?._id === conversation._id
                  ? "bg-lightBlue text-white"
                  : "bg-white text-lightBlue"
              }`}
            >
              <div className="flex items-center gap-2">
                <Status
                  isOnline={onlineUsers.some(
                    (_user) =>
                      _user._id ===
                      (conversation.members[0]._id === user._id
                        ? conversation.members[1]._id
                        : conversation.members[0]._id)
                  )}
                >
                  {" "}
                  <img
                    src={
                      conversation.members[0]._id === user._id
                        ? conversation.members[1].profilePictureURL ??
                          PROFILE_PIC_PLACEHOLDER
                        : conversation.members[0].profilePictureURL ??
                          PROFILE_PIC_PLACEHOLDER
                    }
                    alt="avatar"
                    className={` md:w-12 md:h-12 h-8 w-8
                rounded-full  `}
                  />
                </Status>

                <h3 className={`md:text-lg text-base `}>
                  {conversation.members[1]._id === user._id
                    ? conversation.members[0].name.length > 15
                      ? conversation.members[0].name.substr(0, 15) + "..."
                      : conversation.members[0].name
                    : conversation.members[1].name.length > 15
                    ? conversation.members[1].name.substr(0, 15) + "..."
                    : conversation.members[1].name}
                </h3>
              </div>
            </button>
          ))}
      </div>
      {conversations.status === "loading" && <Loader type="medium" />}
    </div>
  );
};
