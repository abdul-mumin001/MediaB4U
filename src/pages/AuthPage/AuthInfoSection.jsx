import React from "react";
import LOGO from "../../assets/logo.png";
export const AuthInfoSection = () => {
  return (
    <div className="sm:flex flex-col hidden  items-center gap-6">
      <div className="flex gap-1 items-center">
        <img src={LOGO} alt="MediaB4U" className="w-24" />
        <h1 className="md:text-4xl hidden md:block   text-lightBlue font-semibold">
          MediaB4U
        </h1>
      </div>
      <p className="md:text-2xl text-center text-lg sm:text-xl text-lightBlue text-opacity-95 text-bold">
      MediaB4U - Connect and share with to explore sports
      </p>
    </div>
  );
};
