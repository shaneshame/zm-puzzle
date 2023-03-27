import useUrlState from './useUrlState';

import { isBoardEmpty } from './util';

let hasInit = false;

function useAppState(initialState) {
  const [urlState, setUrlState] = useUrlState(initialState);

  let state = urlState;

  if (!hasInit) {
    hasInit = true;

    const { clickedTiles = [], startingClickedTiles = [] } = urlState;

    if (isBoardEmpty(startingClickedTiles)) {
      state = {
        ...urlState,
        startingClickedTiles: clickedTiles,
      };
    } else {
      state = {
        ...urlState,
        clickedTiles: startingClickedTiles,
      };
    }

    setUrlState(state);
  }

  return [state, setUrlState];
}

export default useAppState;
