import { useMemo, useState } from 'react';
import queryString from 'query-string';

import { isFunction } from './util';

const defaultParseOptions = {
  arrayFormat: 'comma',
  parseNumbers: true,
  parseBooleans: true,
};

const defaultStringifyOptions = {
  arrayFormat: 'comma',
};

const updateSearchParams = (query) => {
  const url = new URL(`${window.location.origin}/?${query}`);

  window.history.replaceState({}, '', url);
};

function useUrlState(initialState = {}, options = {}) {
  const location = window.location;

  const { parseOptions = {}, stringifyOptions = {} } = options;

  const mergedParseOptions = useMemo(() => {
    return { ...defaultParseOptions, ...parseOptions };
  }, [parseOptions]);

  const mergedStringifyOptions = useMemo(() => {
    return {
      ...defaultStringifyOptions,
      ...stringifyOptions,
    };
  }, [stringifyOptions]);

  const stateFromUrl = useMemo(() => {
    return queryString.parse(location.search, mergedParseOptions);
  }, [location.search, mergedParseOptions]);

  const [currentState, setSearch] = useState(() => {
    const init = isFunction(initialState) ? initialState() : initialState;

    return {
      ...init,
      ...stateFromUrl,
    };
  });

  const mergedState = useMemo(() => {
    return {
      ...currentState,
      ...stateFromUrl,
    };
  }, [currentState, stateFromUrl]);

  const setUrlState = (state) => {
    setSearch((previousState) => {
      const passedState = isFunction(state) ? state(mergedState) : state;

      const newState = {
        ...previousState,
        ...passedState,
      };

      const newString = queryString.stringify(newState, mergedStringifyOptions);

      updateSearchParams(newString);

      return newState;
    });
  };

  return [mergedState, setUrlState];
}

export default useUrlState;
