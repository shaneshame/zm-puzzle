import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import useUrlState from './useUrlState';

import {
  ActionBar,
  ActionButton,
  Board,
  ClickCounter,
  FlashHighlight,
  Header,
  HeaderBar,
  HeaderLink,
  InstructionsAnchor,
  InstructionsItem,
  InstructionsList,
  InstructionsSection,
  Select,
  SelectOption,
  SpacedContent,
  SubHeader,
} from './components';

import {
  countTrue,
  getBoardFromClickedTiles,
  getNewClickedTiles,
  isBoardEmpty,
  range,
  toggleBinary,
} from './util';

const DEFAULT_COMPLEXITY = 5;
const MAX_COMPLEXITY = 7;
const BOARD_SIZE = 5;

const AppContainer = styled.div`
  margin: 0 auto;
  max-width: 100%;
  width: 500px;
`;

let hasInit = false;

const processUrlState = (curState) => {
  if (!hasInit && countTrue(curState.clickedTiles) === 0) {
    hasInit = true;

    return {
      ...curState,
      clickedTiles: getNewClickedTiles(
        Math.sqrt(curState.clickedTiles.length),
        curState.complexity,
      ),
    };
  }

  return curState;
};

const getInitialAppState = () => {
  return {
    clickCount: 0,
    hasWon: false,
    isShowingSolution: false,
  };
};

function App() {
  const [appState, setAppState] = useState(getInitialAppState);
  const [highlightInstructions, setHighlightInstructions] = useState(false);
  const [urlState, setUrlState] = useUrlState(
    {
      clickedTiles: getNewClickedTiles(BOARD_SIZE, DEFAULT_COMPLEXITY),
      complexity: DEFAULT_COMPLEXITY,
    },
    {
      processState: processUrlState,
    },
  );

  const { clickedTiles } = urlState;

  const [selectedComplexity, setSelectedComplexity] = useState(() => {
    return countTrue(clickedTiles) > 0
      ? countTrue(clickedTiles)
      : urlState.complexity;
  });

  if (typeof selectedComplexity === 'string') {
    console.error('typeof selectedComplexity is `string`');
  }

  const board = getBoardFromClickedTiles(clickedTiles);

  const boardSize = Math.sqrt(board.length);

  const [startingClickedTiles, setStartingClickedTiles] =
    useState(clickedTiles);

  const { clickCount, hasWon, isShowingSolution } = appState;

  useEffect(() => {
    if (highlightInstructions) {
      const timeoutId = setTimeout(() => {
        setHighlightInstructions(false);
      }, 350);
      return () => clearTimeout(timeoutId);
    }
  }, [highlightInstructions]);

  const resetAppState = () => {
    setAppState(getInitialAppState);
  };

  const restartGame = () => {
    resetAppState();

    setUrlState({
      clickedTiles: startingClickedTiles,
      complexity: selectedComplexity,
    });
  };

  const newGame = (options = {}) => {
    // Need nullish coalescing `??` because values could be `0`
    const newBoardSize = options.boardSize ?? boardSize;
    const newComplexity = options.complexity ?? selectedComplexity;

    const newClickedTiles = getNewClickedTiles(newBoardSize, newComplexity);

    resetAppState();

    setUrlState({
      clickedTiles: newClickedTiles,
      complexity: newComplexity,
    });

    setStartingClickedTiles(newClickedTiles);
  };

  const handleShowSolution = () => {
    setAppState((currentAppState) => ({
      ...currentAppState,
      isShowingSolution: !isShowingSolution,
    }));
  };

  const handleSelectComplexity = (event) => {
    const newComplexity = Number(event.target.value);

    setSelectedComplexity(newComplexity);

    newGame({ complexity: newComplexity });
  };

  const handleTileClick = (clickedIndex) => {
    const newClickedTiles = clickedTiles.map((value, index) =>
      index === clickedIndex ? toggleBinary(value) : value,
    );

    const isCustom = selectedComplexity === 0;

    setUrlState({
      clickedTiles: newClickedTiles,
      complexity: isCustom ? countTrue(newClickedTiles) : urlState.complexity,
    });

    setAppState((currentAppState) => ({
      ...currentAppState,
      clickCount: clickCount + 1,
      hasWon: isBoardEmpty(newClickedTiles),
    }));
  };

  return (
    <AppContainer>
      <HeaderBar>
        <Header>
          <HeaderLink href="/">ZM Puzzle</HeaderLink>
          <sup>
            <InstructionsAnchor
              href="#instructions"
              onClick={() => {
                setHighlightInstructions(true);
              }}
            >
              [?]
            </InstructionsAnchor>
          </sup>
        </Header>
      </HeaderBar>
      <ClickCounter
        clickedTiles={clickedTiles}
        count={clickCount}
        label="Clicks: "
        minClicks={selectedComplexity}
      />
      <SpacedContent space={0.5}>
        <Board
          board={board}
          boardSize={boardSize}
          clickedTiles={clickedTiles}
          handleClick={handleTileClick}
          hasWon={hasWon}
          isShowingSolution={isShowingSolution}
        />
        <ActionBar>
          <ActionButton onClick={restartGame}>Restart</ActionButton>
          <ActionButton
            disabled={hasWon}
            isShowingSolution={isShowingSolution}
            onClick={handleShowSolution}
          >
            Solve
          </ActionButton>
          <ActionButton
            onClick={() => newGame({ complexity: selectedComplexity })}
          >
            New
          </ActionButton>
        </ActionBar>
        <Select
          id="complexity-select"
          onChange={handleSelectComplexity}
          value={selectedComplexity}
        >
          <SelectOption key="custom" value={0}>
            Custom
            {selectedComplexity > MAX_COMPLEXITY && ` (${selectedComplexity})`}
          </SelectOption>
          {range(1, MAX_COMPLEXITY + 1).map((n) => {
            return (
              <SelectOption key={n} value={n}>
                Starting Clicks: {n}
              </SelectOption>
            );
          })}
        </Select>
        <InstructionsSection>
          <SubHeader id="instructions">Instructions</SubHeader>
          <InstructionsList>
            <InstructionsItem>
              Clear the board by turning all tiles gray
            </InstructionsItem>
            <InstructionsItem>
              Clicking a tile inverts that tile, and each tile above, below,
              left, and right of the one clicked
            </InstructionsItem>
          </InstructionsList>
          <FlashHighlight className={highlightInstructions ? 'flash' : ''} />
        </InstructionsSection>
      </SpacedContent>
    </AppContainer>
  );
}

export default App;
