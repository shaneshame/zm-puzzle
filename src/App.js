import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
  coordsToFlattenedIndex,
  createNewGame,
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

const initialGame = createNewGame(BOARD_SIZE, DEFAULT_COMPLEXITY);

function App() {
  const [complexity, setComplexity] = useState(DEFAULT_COMPLEXITY);
  const [startingState, setStartingState] = useState(initialGame);
  const [game, setGameState] = useState(initialGame);
  const [isShowingSolution, setIsShowingSolution] = useState(false);
  const [clickCounter, setClickCounter] = useState(0);
  const [highlightInstructions, setHighlightInstructions] = useState(false);

  useEffect(() => {
    if (highlightInstructions) {
      const timer = setTimeout(() => {
        setHighlightInstructions(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [highlightInstructions]);

  const resetState = () => {
    setIsShowingSolution(false);
    setClickCounter(0);
  };

  const restartGame = () => {
    resetState();

    setGameState({
      ...startingState,
    });
  };

  const newGame = (settings = {}) => {
    const newComplexity = settings.complexity || DEFAULT_COMPLEXITY;
    const newBoardSize = settings.boardSize || BOARD_SIZE;

    const game = createNewGame(newBoardSize, newComplexity);

    resetState();
    setGameState(game);
    setStartingState(game);
  };

  const handleShowSolution = () => {
    setIsShowingSolution(!isShowingSolution);
  };

  const handleSelectComplexity = (event) => {
    const newComplexity = event.target.value;

    setComplexity(newComplexity);

    newGame({ complexity: newComplexity });
  };

  const handleTileClick = (clickedX, clickedY) => {
    const grid = clickTile(clickedX, clickedY, game.grid);
    const clickedTiles = [...game.clickedTiles];

    const clickedIndex = coordsToFlattenedIndex(clickedX, clickedY, BOARD_SIZE);

    clickedTiles[clickedIndex] = toggleBinary(clickedTiles[clickedIndex]);

    setClickCounter(clickCounter + 1);

    setGameState({
      ...game,
      clickedTiles,
      grid,
      hasWon: isBoardEmpty(grid),
    });
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
      <ClickCounterContainer>
        Clicks:{' '}
        <ClickCounterSpan
          hasExceeded={complexity > 0 && clickCounter > complexity}
        >
          {clickCounter}
        </ClickCounterSpan>
        {complexity > 0 && `/${complexity}`}
      </ClickCounterContainer>
      <SpacedContent space={1}>
        <Board
          gameState={game}
          handleClick={handleTileClick}
          hasWon={game.hasWon}
          isShowingSolution={isShowingSolution}
        />
        <SpacedContent space={1}>
          <ActionBar>
            <ActionButton onClick={restartGame}>Restart</ActionButton>
            <ActionButton
              disabled={game.hasWon}
              isShowingSolution={isShowingSolution}
              onClick={handleShowSolution}
            >
              Solve
            </ActionButton>
            <ActionButton onClick={() => newGame({ complexity })}>
              New
            </ActionButton>
          </ActionBar>
          <ActionBar>
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
          </ActionBar>
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
      </SpacedContent>
    </AppContainer>
  );
}

export default App;
