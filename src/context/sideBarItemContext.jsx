import React, { createContext, useContext, useState } from "react";

const SideBarItemContext = createContext();
const SideBarItemProvider = ({ children }) => {
  const [activeName, setActiveName] = useState("Home");

  return (
    <SideBarItemContext.Provider value={{ activeName, setActiveName }}>
      {children}
    </SideBarItemContext.Provider>
  );
};

const useSideBarItem = () => useContext(SideBarItemContext);
export { useSideBarItem, SideBarItemProvider };
