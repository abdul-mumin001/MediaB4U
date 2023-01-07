import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import { PrivateRoute } from "./components";
import { useSideBarItem } from "./context";
import {
  BookmarkedPage,
  ExplorePage,
  FollowersPage,
  FollowingPage,
  HomePage,
  LoginPage,
  MessagePage,
  PageNotFound,
  PostPage,
  ProfilePage,
  SearchedPostsPage,
  SignupPage,
  UsersPage,
} from "./pages";
import { VideoChatPage } from "./pages/VideoChatPage";
function App() {
  const { setActiveName } = useSideBarItem();
  const location = useLocation();
  // const [modalRef, showModal, setShowModal] = useDropDown();
  // const { notifications } = useNotification();
  // const {
  //   call,
  //   callAccepted,
  //   callEnded,
  //   leaveCall,
  //   answerCall,
  //   callUser,
  //   myVideoRef,
  //   userVideoRef,
  //   initiateVideoCall,
  //   setIsCalling,
  //   isCalling,
  //   stream,
  // } = useVideoCall(true);
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveName("Home");
    } else {
      let name = location.pathname.split("/")[1];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      setActiveName(name);
    }
  }, [location.pathname]);

  return (
    <div className="App">
      {/* {call.isCallRecieving && !callAccepted && (
        <Modal setShowDropDown={setShowModal}>
          <div className="flex gap-3 flex-col items-center flex-wrap justify-center">
            <h1 className="text-white text-xl text-center">
              <span className="font-bold"> {call.from.name} </span> is
              calling...
            </h1>
            <button></button>
            <button
              onClick={Navigate(
                "/videochat/" + call.from._id + "?isRecievingCall=true"
              )}
              className="px-4 rounded-full py-1.5 bg-primary text-white flex gap-1.5 items-center"
            >
              <MdCall size={20} />
              <span>Answer</span>
            </button>
            <button
              onClick={() => {
                leaveCall(call.from._id);
                setShowModal(false);
              }}
              className="px-4 rounded-full py-1.5 bg-tertiary text-white flex gap-1.5 items-center"
            >
              <MdCallEnd size={20} />
              <span>Decline</span>
            </button>
          </div>
        </Modal>
      )} */}
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookmarks" element={<BookmarkedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile/:profileId" element={<ProfilePage />} />
          <Route path="/messages/" element={<MessagePage />} />
          <Route path="/videochat/:to" element={<VideoChatPage />} />
          <Route path="/messages/:conversationId" element={<MessagePage />} />
          <Route
            path="/users/:profileId/followers"
            element={<FollowersPage />}
          />
          <Route
            path="/users/:profileId/following"
            element={<FollowingPage />}
          />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/posts" element={<SearchedPostsPage />} />
          <Route path="/posts/:id" element={<PostPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
