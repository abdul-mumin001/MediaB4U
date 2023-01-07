import React, { createContext, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { formatUserInfo } from "../utils";

const SocketContext = createContext();
const SocketProvider = ({ children }) => {
  const socket = useRef(io(process.env.REACT_APP_API_URL));
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  useEffect(() => {
    isLoggedIn && user && socket.current.emit("online", formatUserInfo(user));
  }, [isLoggedIn]);
  return (
    <SocketContext.Provider value={{ socket: socket?.current }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);
export { useSocket, SocketProvider };
