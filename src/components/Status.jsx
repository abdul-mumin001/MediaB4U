import React from "react";

export const Status = ({ isOnline, children }) => {
  return (
    <div className="relative">
      {children}
      <div
        className={`${
          isOnline ? "bg-primary" : "bg-tertiary"
        } w-3 h-3 rounded-full shadow-2xl absolute top-0 right-0 border border-white`}
      ></div>
    </div>
  );
};
