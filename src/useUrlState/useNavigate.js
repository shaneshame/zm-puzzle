import { useCallback } from "react";

import { isBrowser } from "./util";

function useNavigate() {
  const navigate = useCallback((url, replace = false) => {
    if (!isBrowser()) return;

    const method = replace ? "replaceState" : "pushState";

    window.history[method]({}, "", url);

    window.dispatchEvent(new Event("popstate"));
  }, []);

  return navigate;
}

export default useNavigate;
