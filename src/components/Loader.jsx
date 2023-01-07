import React from "react";

export const Loader = ({ status = "", type = "full" }) => {
  if (type === "full")
    return (
      <div className="flex gap-4 flex-col justify-center items-center space-x-2 w-screen h-screen fixed top-0 left-0 right-0 z-50 bg-lightBlue bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center justify-center space-x-2   animate-bounce">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <div className="w-8 h-8 bg-secondary rounded-full"></div>
          <div className="w-8 h-8 bg-tertiary rounded-full"></div>
        </div>
        <span className="text-white text-2xl">Loading...</span>
        <span className="text-white sm:text-lg text-center">{status}</span>
      </div>
    );
  else if (type === "mini") {
    return (
      <div className="flex items-center justify-center space-x-2   animate-bounce">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <div className="w-2 h-2 bg-secondary rounded-full"></div>
        <div className="w-2 h-2 bg-tertiary rounded-full"></div>
      </div>
    );
  } else if (type === "medium") {
    return (
      <div className="flex items-center justify-center space-x-2   animate-bounce">
        <div className="w-5 h-5 bg-primary rounded-full"></div>
        <div className="w-5 h-5 bg-secondary rounded-full"></div>
        <div className="w-5 h-5 bg-tertiary rounded-full"></div>
      </div>
    );
  }
};
