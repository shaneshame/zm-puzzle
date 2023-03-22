import { useCallback, useMemo, useRef } from 'react';
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

const getOptions = (options = {}) => {
  const { parseOptions = {}, stringifyOptions = {} } = options;

  return {
    ...options,
    parseOptions: {
      ...defaultParseOptions,
      ...parseOptions,
    },
    stringifyOptions: {
      ...defaultStringifyOptions,
      ...stringifyOptions,
    },
  };
};

const updateSearchParams = (query) => {
  const url = new URL(`${window.location.origin}/?${query}`);

  window.history.replaceState({}, '', url);
};

function useUrlState(initialState = {}, options = {}) {
  const location = window.location;

  const { parseOptions = {}, stringifyOptions = {} } = useMemo(() => {
    return getOptions(options);
  }, [options]);

  const initialStateRef = useRef(
    isFunction(initialState) ? initialState() : initialState,
  );

  const hasSetSearchParamsRef = useRef(false);

  const urlState = useMemo(() => {
    const currentUrlState = queryString.parse(location.search, parseOptions);

    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setUrlState({}) if it has an initial value
    const initState = hasSetSearchParamsRef.current
      ? {}
      : initialStateRef.current;

    return {
      ...initState,
      ...currentUrlState,
    };
  }, [location.search, parseOptions]);

  const setUrlState = useCallback(
    (state) => {
      hasSetSearchParamsRef.current = true;

      const passedState = isFunction(state) ? state(urlState) : state;

      const newState = {
        ...urlState,
        ...passedState,
      };

      const newString = queryString.stringify(newState, stringifyOptions);

      updateSearchParams(newString);

      return newState;
    },
    [stringifyOptions, urlState],
  );

  return [urlState, setUrlState];
}

export default useUrlState;
