import React from "react";

export const DropDownOption = ({ type, name, onClick, Icon }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        type === "small" ? "p-2 gap-1 rounded-md" : "px-3 py-2 gap-2"
      } flex  hover:bg-slate-700 focus:bg-slate-700 ease-in-out transition-colors bg-slate-600 items-center`}
    >
      <Icon />
      <span className={`${type === "small" ? "text-sm" : ""}`}>{name}</span>
    </button>
  );
};
