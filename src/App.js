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
  const [urlState, setUrlState] = useUrlState({
    clickedTiles: getNewClickedTiles(BOARD_SIZE, DEFAULT_COMPLEXITY),
  });

  const [complexity, setComplexity] = useState(
    urlState.clickedTiles.filter(Boolean).length || DEFAULT_COMPLEXITY,
  );

  const board = getBoardFromClickedTiles(urlState.clickedTiles);
  const boardSize = Math.sqrt(board.length);

  const [startingClickedTiles, setStartingClickedTiles] = useState(
    urlState.clickedTiles,
  );

  const { clickCount, hasWon, isShowingSolution } = appState;

  useEffect(() => {
    if (highlightInstructions) {
      const timer = setTimeout(() => {
        setHighlightInstructions(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [highlightInstructions]);

  const resetAppState = () => {
    setAppState(getInitialAppState);
  };

  const restartGame = () => {
    resetAppState();

    setUrlState({
      clickedTiles: startingClickedTiles,
    });
  };

  const newGame = (options = {}) => {
    const newBoardSize = options.boardSize || boardSize;
    const newComplexity = options.complexity || complexity;

    const newClickedTiles = getNewClickedTiles(newBoardSize, newComplexity);

    resetAppState();

    setUrlState({
      clickedTiles: newClickedTiles,
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
    const newComplexity = event.target.value;

    setComplexity(newComplexity);

    newGame({ complexity: newComplexity });
  };

  const handleTileClick = (clickedIndex) => {
    const newClickedTiles = urlState.clickedTiles.map((value, index) =>
      index === clickedIndex ? toggleBinary(value) : value,
    );

    setUrlState({
      clickedTiles: newClickedTiles,
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
        clickedTiles={urlState.clickedTiles}
        complexity={complexity}
        count={clickCount}
        label="Clicks: "
      />
      <SpacedContent space={0.5}>
        <Board
          board={board}
          boardSize={boardSize}
          clickedTiles={urlState.clickedTiles}
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
          <ActionButton onClick={() => newGame({ complexity })}>
            New
          </ActionButton>
        </ActionBar>
        <Select
          id="complexity-select"
          onChange={handleSelectComplexity}
          value={complexity}
        >
          <SelectOption key="custom" value={0}>
            Custom{complexity > MAX_COMPLEXITY && ` (${complexity})`}
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
