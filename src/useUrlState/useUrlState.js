import { useCallback, useMemo, useRef } from 'react';

import { identity, isFunction, queryString, updateUrlQuery } from './util';

const setUrlQuery = (query) => {
  const updatedUrl = updateUrlQuery(window.location.toString(), query);

  window.history.replaceState({}, '', updatedUrl);
};

// Inspired by @remix react-router `useSearchParam` hook
// https://github.com/remix-run/react-router/blob/590b7a25a454d998c83f4e5d6f00ad5a6217533b/packages/react-router-dom/index.tsx#L785

function useUrlState(initialState = {}, options = {}) {
  const location = window.location;

  const serialize = useMemo(() => {
    return options.serialize ?? queryString.stringify;
  }, [options]);

  const deserialize = useMemo(() => {
    return options.deserialize ?? queryString.parse;
  }, [options]);

  const processState = useMemo(() => {
    return options.processState ?? identity;
  }, [options]);

  const initialStateRef = useRef(
    isFunction(initialState) ? initialState() : initialState,
  );

  const hasSetSearchParamsRef = useRef(false);

  const urlState = useMemo(() => {
    const currentUrlState = deserialize(location.search);

    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setUrlState({}) if it has an initial value
    const initState = hasSetSearchParamsRef.current
      ? {}
      : initialStateRef.current;

    return processState({
      ...initState,
      ...currentUrlState,
    });
  }, [deserialize, location.search, processState]);

  if (!hasSetSearchParamsRef.current) {
    const initialQuery = serialize(urlState);

    setUrlQuery(initialQuery);
  }

  const setUrlState = useCallback(
    (state) => {
      hasSetSearchParamsRef.current = true;

      const passedState = isFunction(state) ? state(urlState) : state;

      const newState = {
        ...urlState,
        ...passedState,
      };

      const query = serialize(newState);

      setUrlQuery(query);

      return newState;
    },
    [serialize, urlState],
  );

  return [urlState, setUrlState];
}

export default useUrlState;
