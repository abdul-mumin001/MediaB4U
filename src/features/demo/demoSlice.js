import React, { createContext, useContext } from "react";

const ScrollContext = createContext();
const ScrollProvider = ({ children }) => {

  return (
    <ScrollContext.Provider
      value={{}}
    >
      {children}
    </ScrollContext.Provider>
  );
};

const useScroll = () => useContext(ScrollContext);
export { useScroll, ScrollProvider };
