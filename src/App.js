import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import useUrlState from './useUrlState';

import {
  ActionBar,
  ActionButton,
  Board,
  ClickCounterContainer,
  ClickCounterSpan,
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
  clickTile,
  createNewGame,
  isBoardEmpty,
  range,
  toggleBinary,
} from './util';

const DEFAULT_COMPLEXITY = 5;
const MAX_COMPLEXITY = 7;
const BOARD_SIZE = 5;

const initialAppState = {
  isShowingSolution: false,
  clickCounter: 0,
  hasWon: false,
};

const AppContainer = styled.div`
  margin: 0 auto;
  max-width: 100%;
  width: 500px;
`;

function App() {
  const [appState, setAppState] = useState(initialAppState);
  const [highlightInstructions, setHighlightInstructions] = useState(false);

  const [urlState, setUrlState] = useUrlState({
    boardSize: BOARD_SIZE,
    complexity: DEFAULT_COMPLEXITY,
  });

  const setComplexity = useCallback(
    (value) => {
      setUrlState({
        complexity: value,
      });
    },
    [setUrlState],
  );

  const {
    board,
    boardSize,
    clickedTiles,
    complexity,
    startingBoard,
    startingClickedTiles,
  } = urlState;

  const { clickCounter, hasWon, isShowingSolution } = appState;

  useEffect(() => {
    if (highlightInstructions) {
      const timer = setTimeout(() => {
        setHighlightInstructions(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [highlightInstructions]);

  const resetAppState = () => {
    setAppState(initialAppState);
  };

  const restartGame = () => {
    resetAppState();

    setUrlState({
      board: startingBoard,
      clickedTiles: startingClickedTiles,
    });
  };

  const newGame = (options = {}) => {
    const newBoardSize = options.boardSize || boardSize;
    const newComplexity = options.complexity || complexity;

    const game = createNewGame(newBoardSize, newComplexity);

    resetAppState();

    setUrlState({
      ...game,
      startingBoard: game.board,
      startingClickedTiles: game.clickedTiles,
    });
  };

  const handleShowSolution = () => {
    setAppState({
      ...appState,
      isShowingSolution: !isShowingSolution,
    });
  };

  const handleSelectComplexity = (event) => {
    const newComplexity = event.target.value;

    setComplexity(newComplexity);

    newGame({ complexity: newComplexity });
  };

  const handleTileClick = (clickedIndex) => {
    const newBoard = clickTile(clickedIndex, board);
    const newClickedTiles = [...clickedTiles];

    newClickedTiles[clickedIndex] = toggleBinary(newClickedTiles[clickedIndex]);

    setUrlState({
      board: newBoard,
      clickedTiles: newClickedTiles,
    });

    setAppState({
      ...appState,
      clickCounter: clickCounter + 1,
      hasWon: isBoardEmpty(newBoard),
    });
  };

  useEffect(() => {
    newGame();
  }, []);

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
      <ClickCounterContainer>
        Clicks:{' '}
        <ClickCounterSpan
          hasExceeded={complexity > 0 && clickCounter > complexity}
        >
          {clickCounter}
        </ClickCounterSpan>
        {complexity > 0 && `/${complexity}`}
      </ClickCounterContainer>
      <SpacedContent space={0.5}>
        <Board
          game={{ board, boardSize, clickedTiles }}
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
          {range(MAX_COMPLEXITY + 1).map((n) => {
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
