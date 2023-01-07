import React from "react";
import { Link } from "react-router-dom";

export const SideBarItem = ({ name, Icon, activeName, onClick, _id }) => {
  let to = `/${name.toLowerCase()}`;
  if (name === "Home") to = "/";
  if (name === "Profile") to += `/${_id}`;
  return (
    <li
      onClick={onClick}
      className={`inline-block w-1/4 md:w-48  hover:text-white focus:text-white ${
        name === activeName ? "text-white" : ""
      }`}
    >
      <Link
        className={`flex  items-center gap-2 justify-center sm:justify-start  md:rounded-r-xl sm:py-6 sm:px-4  p-3  md:hover:border-b-4 hover:border-white hover:border-opacity-50 hover:bg-primary hover:bg-opacity-90 focus:bg-opacity-90  md:focus:border-b-4 focus:border-white  focus:border-opacity-50 focus:bg-primary ease-in-out transition-all xsm:flex-col ${
          name === activeName
            ? "md:border-b-4 border-white border-opacity-50 bg-primary"
            : "md:border-b-4 border-slate-200 bg-white"
        }`}
        to={to}
      >
        {<Icon className="md:text-4xl text-3xl " />}
        <span className="md:text-lg text-sm sm:flex hidden">{name}</span>
      </Link>
    </li>
  );
};
