import React from "react";

export const InputCheckboxSection = ({ label = "" }) => {
  return (
    <div className="form-group form-check">
      <input
        type="checkbox"
        className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        id={label.split(" ").join("-").toLowerCase()}
      />
      <label
        className="form-check-label inline-block text-gray-800"
        htmlFor={label.split(" ").join("-").toLowerCase()}
      >
        {label}
      </label>
    </div>
  );
};
