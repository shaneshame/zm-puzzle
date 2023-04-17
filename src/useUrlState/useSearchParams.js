import { createContext, useContext, useEffect, useState } from "react";
import { isBrowser } from "./util";

function useWindowListener(eventType, listener) {
  useEffect(() => {
    if (!isBrowser()) return;

    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}

function getCurrentSearchParams() {
  const search = isBrowser() ? window.location.search : "";
  return new URLSearchParams(search);
}

const SearchParamsContext = createContext(getCurrentSearchParams());

function SearchParamsProvider({ children }) {
  const [searchParams, setSearchParams] = useState(getCurrentSearchParams());

  useWindowListener("popstate", () => {
    setSearchParams(getCurrentSearchParams());
  });

  return (
    <SearchParamsContext.Provider value={searchParams}>
      {children}
    </SearchParamsContext.Provider>
  );
}

function useSearchParams() {
  return useContext(SearchParamsContext);
}

export default useSearchParams;
export { SearchParamsProvider };
