import React from "react";
import { useSelector } from "react-redux";
import { Loader, StoryCard } from "../../components";
import { PROFILE_PIC_PLACEHOLDER } from "../../utils";

export const StorySection = () => {
  const stories = useSelector((state) => state.stories);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="story-section grid  grid-flow-col-dense auto-cols-min gap-4  md:p-6 p-4 rounded-lg shadow-md bg-white  overflow-auto ">
      <StoryCard
        isCreateStory={true}
        profileName={user.name}
        profileImage={user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
      />
      {stories?.status === "loading" && (
        <Loader status={"Please wait until your stories are loaded"} />
      )}
      {stories?.stories?.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
};
