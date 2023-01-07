import React from "react";
import { SideBarItem } from ".";
import { useSideBarItem } from "../context";
import { sideBarItems } from "../utils";

export const SideBar = () => {
  const { activeName, setActiveName } = useSideBarItem("Home");
  return (
    <ul className="z-20  md:gap-1 justify-center md:justify-start xsm:justify-between  md:w-max w-screen   md:min-h-screen fixed bg-white md:bg-slate-100 bottom-0 md:top-16 md:mt-3 flex md:flex-col   text-lightBlue md:p-4">
      {sideBarItems.map((item, i) => (
        <SideBarItem
          key={i}
          {...item}
          index={i}
          activeName={activeName}
          _id={JSON.parse(localStorage?.getItem("user"))._id}
          onClick={() => {
            setActiveName(item.name);
          }}
        />
      ))}
    </ul>
  );
};
