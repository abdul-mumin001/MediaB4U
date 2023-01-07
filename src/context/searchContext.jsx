import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();
const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);

  return (
    <SearchContext.Provider value={{ search, setSearch, skip, setSkip }}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);
export { useSearch, SearchProvider };
