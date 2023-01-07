import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { GrEmoji } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconButton, Loader } from ".";
import { setPostUpdateStatusLoading } from "../features/posts/postsSlice";
import { useDropDown } from "../hooks/useDropDown";
import { uploadImages } from "../services/cloudinary/cloudinaryService";
import { updatePost } from "../services/posts/postsService";
import { PROFILE_PIC_PLACEHOLDER } from "../utils";
export const EditPostForm = ({ postInfo, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [post, setPost] = useState(postInfo);
  const [imgUrls, setImgUrls] = useState(postInfo?.mediaURLs ?? []);
  const [mediaURLs, setMediaURLs] = useState([]);
  const [uploadedImgUrls, setUploadedImgUrls] = useState(
    postInfo?.mediaURLs ?? []
  );
  const [dropDownRef, showEmojiPicker, setShowEmojiPicker] = useDropDown();
  const [isUpdadted, setIsUpdadted] = useState(false);
  const { postUpdateStatus } = useSelector((state) => state.posts);

  const PhotosSetcion = () => {
    return (
      <div
        onClick={(e) => {
          setIsModalOpen(true);
          e.preventDefault();
          e.stopPropagation();
        }}
        className=" p-4 relative bg-slate-200 grid photos  grid-flow-col-dense auto-cols-min gap-4 overflow-auto  "
      >
        {imgUrls.map((mediaURL, index) => (
          <div className=" relative  sm:w-60 w-48" key={mediaURL + index}>
            <MdClose
              onClick={() => {
                const newImageUrls = imgUrls.filter(
                  (url) => url.url !== mediaURL.url
                );
                setUploadedImgUrls((prevUploadedImgUrls) =>
                  prevUploadedImgUrls.filter((url) => url.url !== mediaURL.url)
                );
                const mediaURLs = Array.from(post.mediaURLs).filter(
                  (file) =>
                    file.name !== mediaURL.name &&
                    file.lastModified !== mediaURL.lastModified
                );
                setPost({ ...post, mediaURLs });
                setImgUrls(newImageUrls);
              }}
              className="cursor-pointer p-1 w-8 h-8 rounded-full fill-red-500 bg-white shadow-md absolute -right-1 -top-1"
            />
            <img
              key={index}
              src={mediaURL.url}
              alt="postImage"
              className="cursor-pointer aspect-square    p-1 bg-slate-200    object-cover shadow-sm"
            />
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    if (postUpdateStatus === "succeeded" && isUpdadted) {
      setIsModalOpen(false);
    }
  }, [postUpdateStatus, isUpdadted]);
  if (postInfo)
    return (
      <div
        style={{
          maxWidth: "80vw",
        }}
        className="sm:w-96 w-full md:p-6 p-4 rounded-lg shadow-lg bg-white 
      overflow-y-auto m-4
        
       "
      >
        <div className="relative flex items-center gap-3 mb-3">
          {postInfo && (
            <IconButton
              onClick={() => {
                setIsModalOpen(false);
              }}
              Icon={MdClose}
              className="absolute right-0 top-0 "
            />
          )}
          <Link to={`/profile/${user?._id}`}>
            <img
              className=" shadow-sm cursor-pointer rounded-full w-10 h-10 "
              src={user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
              alt={user.name}
            />
          </Link>
          <span className="text-lightBlue">{user.name}</span>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (Array.from(mediaURLs).length > 0) {
              dispatch(setPostUpdateStatusLoading());
              let urls = await uploadImages(mediaURLs, user._id);
              urls = urls.map((url) => ({
                url,
                type: "image",
              }));
              const _post = {
                content: post.content.trim(),
                mediaURLs: [...uploadedImgUrls, ...urls],
                postId: postInfo._id,
                postedBy: user?._id,
              };
              dispatch(updatePost(_post));
            } else {
              dispatch(
                updatePost({
                  content: post.content.trim(),
                  postId: postInfo._id,
                  mediaURLs: uploadedImgUrls,
                  postedBy: user?._id,
                })
              );
            }
            setIsUpdadted(true);
            setShowEmojiPicker(false);
          }}
        >
          <div className="form-group mb-6">
            <textarea
              autoFocus
              className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        resize-none
        border-b-2
        text-gray-700
        bg-white bg-clip-padding
         border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
      "
              id="post_description"
              rows={3}
              placeholder="Hey, what's on your mind?"
              value={post.content}
              onChange={(e) => {
                setPost({ ...post, content: e.target.value });
              }}
            />
            {imgUrls.length > 0 && <PhotosSetcion />}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4 relative">
            <div className="flex gap-2 items-center ">
              <div className="">
                <label htmlFor="postImage">
                  <IconButton Icon={BiImageAdd} />
                </label>
                <input
                  id="postImage"
                  style={{ display: "none" }}
                  type={"file"}
                  multiple={true}
                  accept="image/*"
                  onChange={(e) => {
                    setMediaURLs(e.target.files);
                    Array.from(e.target.files).forEach((file) => {
                      setImgUrls((prevImgUrls) => [
                        ...prevImgUrls,
                        {
                          name: file.name,
                          lastModified: file.lastModified,
                          url: URL.createObjectURL(file),
                        },
                      ]);
                    });
                  }}
                />
              </div>
              <IconButton
                Icon={GrEmoji}
                onClick={() => {
                  setShowEmojiPicker(
                    (prevShowEmojiPicker) => !prevShowEmojiPicker
                  );
                }}
              />
            </div>

            {postUpdateStatus !== "loading" ? (
              <button
                type="submit"
                disabled={
                  post.content.trim().length === 0 && imgUrls.length === 0
                }
                className={`
      w-full
      md:w-auto
      px-6
      py-2.5
      ${
        post.content.trim().length === 0 &&
        imgUrls.length === 0 &&
        postUpdateStatus !== "loading"
          ? "bg-slate-400"
          : "bg-primary"
      }
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-primary-700 hover:shadow-lg
      focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-primary-800 active:shadow-lg
      transition
      duration-150
      ease-in-out`}
              >
                Update
              </button>
            ) : (
              <Loader type="mini" />
            )}
          </div>
          {showEmojiPicker && (
            <div className="mt-5" ref={dropDownRef}>
              <EmojiPicker
                onEmojiClick={(_, data) => {
                  setPost({ ...post, content: post.content + data.emoji });
                }}
                preload={true}
              />
            </div>
          )}
        </form>
      </div>
    );
};
