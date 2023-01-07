import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./socketContext";

const NotificationContext = createContext();
const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("getNotification", ({ type, sender }) => {
      setNotifications((prev) => [...prev, { type, sender }]);
    });
  }, [socket]);
  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => useContext(NotificationContext);
export { useNotification, NotificationProvider };
