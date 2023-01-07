import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "./socketContext";

const OnlineUsersContext = createContext();
const OnlineUsersProvider = ({ children }) => {
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    user && socket.emit("online", { user });
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [socket, user]);
  return (
    <OnlineUsersContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

const useOnlineUsers = () => useContext(OnlineUsersContext);
export { useOnlineUsers, OnlineUsersProvider };
