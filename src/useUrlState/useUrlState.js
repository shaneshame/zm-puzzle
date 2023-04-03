import { useCallback, useMemo, useState } from 'react';

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
  const serialize = useMemo(() => {
    return options.serialize ?? queryString.stringify;
  }, [options]);

  const deserialize = useMemo(() => {
    return options.deserialize ?? queryString.parse;
  }, [options]);

  const [urlState, setReturnState] = useState(() => {
    const initState = isFunction(initialState) ? initialState() : initialState;
    const currentSearchString = getSearchString();
    const currentUrlState = deserialize(currentSearchString);

    return {
      ...initState,
      ...currentUrlState,
    };
  });

  const setUrlState = useCallback(
    (newState, method) => {
      const currentUrlState = deserialize(getSearchString());

      const nextState = isFunction(newState)
        ? newState(currentUrlState)
        : newState;

      const query = serialize({
        ...currentUrlState,
        ...nextState,
      });

      setUrlQuery(query, options.historyMethod ?? method);

      setReturnState(deserialize(query));
    },
    [deserialize, options.historyMethod, serialize],
  );

  return [urlState, setUrlState];
}

export default useUrlState;
