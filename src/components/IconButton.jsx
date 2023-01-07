import React from "react";

export const IconButton = ({ Icon, onClick, className }) => {
  return (
    <Icon
      onClick={onClick}
      className={`${className} w-10 h-10 fill-lightBlue p-2 shadow-md rounded-full hover:bg-primary hover:fill-white focus:bg-primary focus:fill-white cursor-pointer transition-all ease-in-out`}
    />
  );
};
