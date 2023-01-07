import React from "react";

export const AuthButton = ({
  disabled = false,
  color = "bg-primary",
  name,
  onClick,
  type = "submit",
}) => {
  return (
    <button
      type={`${type ? type : "button"}`}
      onClick={onClick}
      disabled={disabled}
      className={`
      w-full
      px-6
      py-2.5
      ${color}
      ${color === "bg-white" ? "text-lightBlue" : "text-white"}
      font-medium
      text-base
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:${color} hover:shadow-lg
      focus:${color} focus:shadow-lg focus:outline-none focus:ring-0
      active:${color} active:shadow-lg
      transition
      duration-150
      ease-in-out`}
    >
      {name}
    </button>
  );
};
