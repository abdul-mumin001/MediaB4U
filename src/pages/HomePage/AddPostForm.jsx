import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { GrEmoji } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconButton, Loader } from "../../components";
import { setPostCreateStatusLoading } from "../../features/posts/postsSlice";
import { useDropDown } from "../../hooks/useDropDown";
import { uploadImages } from "../../services/cloudinary/cloudinaryService";
import { createPost } from "../../services/posts/postsService";
import { initialPostState, PROFILE_PIC_PLACEHOLDER } from "../../utils";

export const AddPostForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [post, setPost] = useState(initialPostState);
  const [imgUrls, setImgUrls] = useState([]);
  const { postCreateStatus } = useSelector((state) => state.posts);
  const [dropDownRef, showEmojiPicker, setShowEmojiPicker] = useDropDown();

  const PhotosSetcion = () => {
    return (
      <div className=" p-4 relative bg-slate-200 grid photos  grid-flow-col-dense auto-cols-min gap-4 overflow-auto  w-full">
        {imgUrls.map((mediaURL, index) => (
          <div className=" relative  sm:w-60 w-48" key={mediaURL}>
            <MdClose
              onClick={() => {
                const newImageUrls = imgUrls.filter(
                  (url) => url.url !== mediaURL.url
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
  return (
    <div className=" w-full md:p-6 p-4 rounded-lg shadow-lg bg-white   ">
      <Link
        to={`/profile/${user?._id}`}
        className="relative flex items-center gap-3 mb-3"
      >
        <img
          className=" shadow-sm cursor-pointer rounded-full w-10 h-10 object-cover "
          src={user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
          alt={user.name}
        />

        <span className="text-lightBlue">{user.name}</span>
      </Link>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (Array.from(post.mediaURLs).length > 0) {
            dispatch(setPostCreateStatusLoading());
            const urls = await uploadImages(post.mediaURLs, user._id);

            const _post = {
              content: post.content.trim(),
              mediaURLs: urls.map((url) => ({
                url,
                type: "image",
              })),
              postedBy: user._id,
            };
            dispatch(createPost(_post));
            setImgUrls([]);

            setPost(initialPostState);
          } else {
            dispatch(
              createPost({
                ...post,
                content: post.content.trim(),
                postedBy: user._id,
              })
            );
            setImgUrls([]);
            setShowEmojiPicker(false);
            setPost(initialPostState);
          }
        }}
      >
        <div className="form-group mb-6">
          <textarea
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
            onChange={(e) => setPost({ ...post, content: e.target.value })}
          />
          {imgUrls.length > 0 && <PhotosSetcion />}
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2 items-center">
            <div className="">
              <label htmlFor="file">
                <IconButton Icon={BiImageAdd} />
              </label>
              <input
                id="file"
                style={{ display: "none" }}
                type={"file"}
                multiple={true}
                accept="image/*"
                onChange={(e) => {
                  setPost({ ...post, mediaURLs: e.target.files });
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
          {postCreateStatus !== "loading" ? (
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
        postCreateStatus !== "loading"
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
              Post
            </button>
          ) : (
            <Loader type="mini" />
          )}
        </div>
      </form>
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
    </div>
  );
};
