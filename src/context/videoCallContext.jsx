import React, { createContext, useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Peer from "simple-peer";
import { formatUserInfo } from "../utils";
import { useSocket } from "./socketContext";

const VideoCallContext = createContext();
const VideoCallProvider = ({ children }) => {
  const { socket } = useSocket();
  const user = useSelector((state) => state.auth.user);
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const connectionRef = useRef();

  const initiateVideoCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideoRef.current.srcObject = currentStream;
      });
    socket.on("callUser", ({ from, signalData }) => {
      setCall({ isCallRecieving: true, from, signalData });
    });
    socket.on("callEnded", () => {
      setCallEnded(true);
      setCallEnded(true);
      setCallAccepted(false);
      setIsCalling(false);
      setCall({ isCallRecieving: false });
      connectionRef?.current?.destroy();
    });
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signalData: data, to: call.from._id });
    });
    peer.on("stream", (currentStream) => {
      userVideoRef.current.srcObject = currentStream;
    });
    peer.signal(call.signalData);
    connectionRef.current = peer;
  };
  const callUser = (to) => {
    setIsCalling(true);
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        to,
        signalData: data,
        from: formatUserInfo(user),
      });
    });
    peer.on("stream", (currentStream) => {
      userVideoRef.current.srcObject = currentStream;
    });
    socket.on("callAccepted", (signalData) => {
      setCallAccepted(true);
      peer.signal(signalData);
    });
    connectionRef.current = peer;
  };
  const leaveCall = (to) => {
    setCallEnded(true);
    setCallAccepted(false);
    setIsCalling(false);
    setCall({ isCallRecieving: false });
    socket.emit("callEnded", { to });
    connectionRef?.current?.destroy();
  };
  return (
    <VideoCallContext.Provider
      value={{
        call,
        callAccepted,
        callEnded,
        leaveCall,
        answerCall,
        callUser,
        myVideoRef,
        userVideoRef,
        stream,
        isCalling,
        setIsCalling,
        initiateVideoCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

const useVideoCall = () => useContext(VideoCallContext);
export { useVideoCall, VideoCallProvider };
