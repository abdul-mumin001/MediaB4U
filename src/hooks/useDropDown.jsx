import { useEffect, useRef, useState } from "react";

export const useDropDown = (show) => {
  const dropDownRef = useRef(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const closeDropDown = (e) => {
    if (!dropDownRef?.current?.contains(e.target)) {
      setShowDropDown(false);
      show && show(false);
    }
  };
  useEffect(() => {
    window.addEventListener("mousedown", closeDropDown, true);
    return () => {
      window.removeEventListener("mousedown", closeDropDown, true);
    };
  }, []);
  return [dropDownRef, showDropDown, setShowDropDown];
};
