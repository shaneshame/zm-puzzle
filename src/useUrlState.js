import { useEffect, useState } from 'react';

const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

const updateSearchParams = (searchParams) => {
  const url = new URL(window.location);

  [...searchParams.entries()].forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  window.history.pushState({}, '', url);
};

const stateToSearchString = (state) => {
  const searchParams = new URLSearchParams(state);

  return searchParams.toString();
};

const searchStringToState = (string) => {
  const searchParams = new URLSearchParams(string);

  return Object.fromEntries([...searchParams.entries()]);
};

const pushStateToUrl = (state = {}) => {
  const searchParams = getSearchParams();

  Object.entries(state).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  updateSearchParams(searchParams);
};

function useUrlState(initialState, serialize, deserialize) {
  const searchParams = getSearchParams();

  const currentState = Object.entries(initialState).reduce(
    (acc, [key, value]) => {
      const currentValue = searchParams.get(key);

      return {
        ...acc,
        [key]: currentValue ? deserialize(currentValue) : value,
      };
    },
    {},
  );

  const [state, setState] = useState(currentState);

  // useEffect(() => {
  //   if (currentSearchString !== stateToSearchString(state)) {
  //     setState(searchStringToState(currentSearchString));
  //   }
  // }, [currentSearchString, state]);

  const setUrlState = (newState) => {
    setState({
      ...state,
      ...newState,
    });

    pushStateToUrl(
      serialize({
        ...state,
        ...newState,
      }),
    );
  };

  return [state, setUrlState];
}

export default useUrlState;
