import React from "react";
import ContentLoader from "react-content-loader";

export const UserListLoader = (props) => (
  <ContentLoader
    speed={2}
    className="w-max p-2  rounded-lg shadow-sm bg-white h-min"
    backgroundColor="#f3f3f3"
    foregroundColor="#23394E"
    foregroundOpacity={0.2}
    {...props}
  >
    <circle cx="40" cy="70" r="30" />

    <rect x="100" y="55" width="296" height="10" />
    <rect x="100" y="80" width="253.5" height="10" />
  </ContentLoader>
);
