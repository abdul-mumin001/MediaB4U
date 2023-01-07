import React, { useEffect, useState } from "react";
import { BiVideo, BiVideoOff, BiVolume, BiVolumeMute } from "react-icons/bi";
import { MdCall, MdCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Header, Loader } from "../../components";
import { useSocket, useVideoCall } from "../../context";
import { getProfileInfo } from "../../services/auth/authService";
import {
  formatUserInfo,
  PROFILE_PIC_PLACEHOLDER,
  toggleMic,
  toggleVideo,
} from "../../utils";

export const VideoChatPage = () => {
  const user = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.profile);
  const { socket } = useSocket();
  const { to } = useParams();
  const [searchParams] = useSearchParams();
  const [volumeMute, setVolumeMute] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const dispatch = useDispatch();
  const {
    call,
    callAccepted,
    callEnded,
    leaveCall,
    answerCall,
    callUser,
    myVideoRef,
    userVideoRef,
    initiateVideoCall,
    setIsCalling,
    isCalling,
    stream,
  } = useVideoCall(true);
  useEffect(() => {
    dispatch(getProfileInfo(to));
    initiateVideoCall();
  }, [to, dispatch]);
  // useEffect(() => {
  //   return () => {
  //     stopBothVideoAndAudio(stream);
  //   };
  // }, [stream]);
  useEffect(() => {
    if (searchParams.get("isCalling")) {
      callUser(to);
    }
    // if (searchParams.get("isRecievingCall")) {
    //   answerCall();
    // }
    if (searchParams.get("isDecliningCall")) {
      leaveCall(to);
    }
  }, [searchParams]);

  return (
    <>
      <Header />
      <div className="flex flex-col gap-2 mt-24 items-center justify-center mb-10">
        <h1 className="text-center  items-center text-lightBlue text-2xl">
          Video chat
        </h1>
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-wrap gap-2 items-center justify-center w-full ">
            {callAccepted && !callEnded && (
              <div className="flex flex-col h-auto shadow-xl bg-white  w-11/12 md:w-4/12 ">
                <div className="flex items-center flex-wrap gap-2 p-2 bg-primary text-white">
                  <Link to={`/profile/${userProfile.data?._id}`}>
                    <img
                      className=" shadow-sm cursor-pointer rounded-full w-10 h-10 "
                      src={
                        userProfile?.data?.profilePictureURL ??
                        PROFILE_PIC_PLACEHOLDER
                      }
                      alt={userProfile?.data?.name}
                    />
                  </Link>
                  <span className="text-lg">{userProfile?.data?.name}</span>
                </div>
                <video playsInline autoPlay ref={userVideoRef} className="" />
              </div>
            )}
            <div className=" scale-95 md:scale-100 md:w-4/12 w-11/12  shadow-xl bg-white   ">
              <div className="flex items-center flex-wrap gap-2 p-2 bg-primary text-white">
                <Link to={`/profile/${user?._id}`}>
                  <img
                    className=" shadow-sm cursor-pointer rounded-full w-10 h-10 "
                    src={user?.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
                    alt={user?.name}
                  />
                </Link>
                <span className="text-lg">{user?.name}</span>
              </div>
              <div className="relative flex justify-center items-center">
                <video playsInline autoPlay ref={myVideoRef} />
                <div className="flex flex-wrap gap-1 items-center absolute bottom-5  ">
                  {volumeMute ? (
                    <button
                      onClick={() => {
                        toggleMic(stream, 1);

                        setVolumeMute(false);
                      }}
                      className="px-4 rounded-full py-1.5 bg-gray-600 text-white flex  items-center"
                    >
                      <BiVolumeMute size={25} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        toggleMic(stream, 0);
                        setVolumeMute(true);
                      }}
                      className="px-4 rounded-full py-1.5 bg-lightBlue text-white flex  items-center"
                    >
                      <BiVolume size={25} />
                    </button>
                  )}
                  {videoOff ? (
                    <button
                      onClick={() => {
                        toggleVideo(stream, 1);
                        setVideoOff(false);
                      }}
                      className="px-4 rounded-full py-1.5 bg-gray-600 text-white flex  items-center"
                    >
                      <BiVideoOff size={25} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        toggleVideo(stream, 0);
                        setVideoOff(true);
                      }}
                      className="px-4 rounded-full py-1.5 bg-secondary text-white flex  items-center"
                    >
                      <BiVideo size={25} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {userProfile.status === "loading" && <Loader type="medium" />}
          </div>
          {call.isCallRecieving && !callAccepted && (
            <div className="flex gap-3 flex-col items-center flex-wrap justify-center">
              <h1 className="text-lightBlue text-xl text-center">
                <span className="font-bold"> {call.from.name} </span> is
                calling...
              </h1>
              <button
                onClick={answerCall}
                className="px-4 rounded-full py-1.5 bg-primary text-white flex gap-1.5 items-center"
              >
                <MdCall size={20} />
                <span>Answer</span>
              </button>
              <button
                onClick={() => leaveCall(userProfile?.data?._id)}
                className="px-4 rounded-full py-1.5 bg-tertiary text-white flex gap-1.5 items-center"
              >
                <MdCallEnd size={20} />
                <span>Decline</span>
              </button>
            </div>
          )}
          {callAccepted && !callEnded && (
            <button
              onClick={() => leaveCall(userProfile?.data?._id)}
              className="px-4 rounded-full py-1.5 bg-tertiary text-white flex gap-1.5 items-center"
            >
              <MdCallEnd size={20} />
              <span>Hang up</span>
            </button>
          )}
          {!call.isCallRecieving && !callAccepted && !isCalling && (
            <button
              onClick={() => {
                callUser(userProfile?.data._id);
                socket.emit("sendNotification", {
                  type: "call",
                  sender: formatUserInfo(user),
                  reciever: userProfile?.data?._id,
                });
              }}
              className="px-4 rounded-full py-1.5 bg-primary text-white flex gap-1.5 items-center w-max"
            >
              <MdCall size={20} />
              <span>Make a call</span>
            </button>
          )}

          {isCalling && !callAccepted && (
            <div className="flex items-center flex-wrap gap-3  justify-center">
              <h1 className="text-lightBlue text-xl text-center">
                Calling{" "}
                <span className="font-bold">{userProfile?.data?.name}</span>
              </h1>
              <button
                onClick={() => {
                  leaveCall(userProfile?.data?._id);
                  setIsCalling(false);
                }}
                className="px-4 rounded-full py-1.5 bg-tertiary text-white flex gap-1.5 items-center"
              >
                <MdCallEnd size={20} />
                <span>Abort Call</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
