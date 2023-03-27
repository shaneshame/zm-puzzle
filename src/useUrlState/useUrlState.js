import { useCallback, useMemo, useRef } from 'react';

import { isFunction, queryString, updateUrlQuery } from './util';

const getSearchString = () => {
  return window.location.search.toString();
};

const setUrlQuery = (query, historyMethod) => {
  const updatedUrl = updateUrlQuery(window.location.toString(), query);

  if (historyMethod === 'push') {
    window.history.pushState({}, '', updatedUrl);
  } else {
    window.history.replaceState({}, '', updatedUrl);
  }
};

// Inspired by @remix react-router `useSearchParam` hook
// https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx#L851

function useUrlState(initialState = {}, options = {}) {
  const currentSearchString = getSearchString();

  const serialize = useMemo(() => {
    return options.serialize ?? queryString.stringify;
  }, [options]);

  const deserialize = useMemo(() => {
    return options.deserialize ?? queryString.parse;
  }, [options]);

  const initialStateRef = useRef(
    isFunction(initialState) ? initialState() : initialState,
  );

  const urlState = useMemo(() => {
    const currentUrlState = deserialize(currentSearchString);

    return {
      ...initialStateRef.current,
      ...currentUrlState,
    };
  }, [currentSearchString, deserialize]);

  const setUrlState = useCallback(
    (state, method) => {
      const currentUrlState = deserialize(getSearchString());

      const nextState = isFunction(state) ? state(currentUrlState) : state;

      const newState = {
        ...currentUrlState,
        ...nextState,
      };

      const query = serialize(newState);

      setUrlQuery(query, options.historyMethod ?? method);
    },
    [deserialize, options.historyMethod, serialize],
  );

  return [urlState, setUrlState];
}

export default useUrlState;
