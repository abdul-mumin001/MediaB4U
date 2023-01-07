import React from "react";

export const InputSection = ({
  type = "text",
  label = "",
  placeholder = "",
  value = "",
  onChange,
  required = true,
  minLength = 5,
}) => {
  return (
    <div className="form-group mb-4">
      {label && (
        <label
          htmlFor={label.split(" ").join("-").toLowerCase()}
          className="form-label inline-block mb-2 text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        defaultValue={value}
        onChange={onChange}
        type={type}
        minLength={minLength}
        className="form-control
       
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none"
        id={label.split(" ").join("-").toLowerCase()}
        aria-describedby="emailHelp"
        placeholder={`Enter ${placeholder}`}
        required={required}
      />
    </div>
  );
};
