import React from "react";
import { useDropDown } from "../hooks/useDropDown";

export const Modal = ({ setShowModal, children }) => {
  const [modalRef] = useDropDown(setShowModal);
  return (
    <div className="grid place-content-center w-screen h-screen z-50 bg-lightBlue bg-opacity-10  fixed top-0 left-0 right-0  backdrop-blur-md ">
      <div ref={modalRef} className="w-full">
        {children}
      </div>
    </div>
  );
};
