import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout } from "../../components";
import { Conversations } from "./Conversations";
import { MessageForm } from "./MessageForm";
import { Messages } from "./Messages";

export const MessagePage = () => {
  const [activeConversation, setActiveConversation] = useState();
  const user = useSelector((state) => state.auth.user);

  return (
    <Layout>
      <h1 className="text-center text-lightBlue text-2xl md:my-4 mt-2">
        Messages
      </h1>
      <div className="flex gap-2 md:flex-row flex-col">
        <Conversations
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
        />
        {activeConversation && (
          <div
            className={` flex flex-col justify-between  w-full shadow-md h-96 bg-lightBlue bg-opacity-30  rounded-sm`}
          >
            <Messages
              activeConversation={activeConversation}
              setActiveConversation={setActiveConversation}
            />
            <MessageForm activeConversation={activeConversation} />
          </div>
        )}
      </div>
    </Layout>
  );
};
