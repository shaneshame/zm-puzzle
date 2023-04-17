import { useCallback, useMemo, useRef } from 'react';

import useNavigate from './useNavigate';
import useSearchParams from './useSearchParams';
import { isFunction, queryString, getQueryNavigation } from './util';

function useUrlState(initialState = {}, options = {}) {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

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
    const currentUrlState = deserialize(searchString);

    return {
      ...initialStateRef.current,
      ...currentUrlState,
    };
  }, [deserialize, searchString]);

  const setUrlState = useCallback(
    (newState, replace) => {
      const currentUrlState = deserialize(searchString);

      const nextState = isFunction(newState)
        ? newState(currentUrlState)
        : newState;

      const query = serialize({
        ...currentUrlState,
        ...nextState,
      });

      navigate(
        getQueryNavigation(window?.location.toString(), query),
        replace || options.replace,
      );
    },
    [deserialize, navigate, options.replace, searchString, serialize],
  );

  return [urlState, setUrlState];
}

export default useUrlState;
