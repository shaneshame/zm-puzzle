import React, { useState } from 'react';
import styled from 'styled-components';

import useAppState from './useAppState';
import useTimeoutBoolean from './useTimeoutBoolean';

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
  getBoardSize,
  getNewClickedTiles,
  isBoardEmpty,
  range,
  toggleBinary,
} from './util';

const DEFAULT_COMPLEXITY = 5;
const MAX_COMPLEXITY = 7;
const BOARD_SIZE = 5;
const MAX_BOARD_SIZE = 7;

const AppContainer = styled.div`
  margin-inline: auto;
  max-width: 100%;
  padding: 0 0.25rem;
  width: 500px;
`;

const getInitialTrackingState = () => ({
  clickCount: 0,
  hasWon: false,
  isShowingSolution: false,
});

function App() {
  const [trackingState, setTrackingState] = useState(getInitialTrackingState);
  const [highlightInstructions, setHighlightInstructions] =
    useTimeoutBoolean(350);

  const [urlState, setUrlState] = useAppState(() => {
    const newClickedTiles = getNewClickedTiles(BOARD_SIZE, DEFAULT_COMPLEXITY);

    return {
      clickedTiles: newClickedTiles,
      complexity: DEFAULT_COMPLEXITY,
      startingClickedTiles: newClickedTiles,
    };
  });

  const { clickedTiles, startingClickedTiles } = urlState;

  const [selectedComplexity, setSelectedComplexity] = useState(() => {
    return countTrue(clickedTiles) > 0
      ? countTrue(clickedTiles)
      : urlState.complexity;
  });

  if (typeof selectedComplexity === 'string') {
    console.error('typeof selectedComplexity is `string`');
  }

  const board = getBoardFromClickedTiles(clickedTiles);

  const boardSize = getBoardSize(board);

  const { clickCount, hasWon, isShowingSolution } = trackingState;

  const resetAppState = () => {
    setTrackingState(getInitialTrackingState);
  };

  const restartGame = () => {
    resetAppState();

    setUrlState({
      clickedTiles: startingClickedTiles,
      complexity: selectedComplexity,
    });
  };

  const newGame = (options = {}) => {
    // Need nullish coalescing `??` operator because values could be `0`
    const newBoardSize = options.boardSize ?? boardSize;
    const newComplexity = options.complexity ?? selectedComplexity;

    const newClickedTiles = getNewClickedTiles(newBoardSize, newComplexity);

    resetAppState();

    setUrlState({
      clickedTiles: newClickedTiles,
      complexity: newComplexity,
      startingClickedTiles: newClickedTiles,
    });
  };

  const handleShowSolution = () => {
    setTrackingState((curTrackingState) => ({
      ...curTrackingState,
      isShowingSolution: !isShowingSolution,
    }));
  };

  const handleSelectComplexity = (event) => {
    const newComplexity = Number(event.target.value);

    setSelectedComplexity(newComplexity);

    newGame({ complexity: newComplexity });
  };

  const handleChangeBoardSize = (event) => {
    const newBoardSize = Number(event.target.value);

    newGame({ boardSize: newBoardSize, complexity: selectedComplexity });
  };

  const handleTileClick = (clickedIndex) => {
    const newClickedTiles = clickedTiles.map((value, index) =>
      index === clickedIndex ? toggleBinary(value) : value,
    );

    const newBoard = getBoardFromClickedTiles(newClickedTiles);

    const isCustom = selectedComplexity === 0;

    setUrlState({
      clickedTiles: newClickedTiles,
      complexity: isCustom ? countTrue(newClickedTiles) : urlState.complexity,
    });

    setTrackingState((curTrackingState) => ({
      ...curTrackingState,
      clickCount: clickCount + 1,
      hasWon: isBoardEmpty(newBoard),
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
        <Select onChange={handleChangeBoardSize} value={boardSize}>
          {range(2, MAX_BOARD_SIZE + 1).map((n) => {
            return (
              <SelectOption key={n} value={n}>
                Board Size: {n}x{n}
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
