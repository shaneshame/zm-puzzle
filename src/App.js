import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import colors from './colors';
import {
  ActionBar,
  ActionButton,
  Board,
  Header,
  HeaderBar,
  HeaderLink,
  Select,
  SelectOption,
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

const InstructionsAnchor = styled.a`
  color: ${colors.link};
  margin-left: 0.2em;

  &:visited {
    color: ${colors.link};
  }
`;

const InstructionLine = styled.p`
  color: ${colors.grayUnselected};
  font-weight: 500;
`;

const ClickCounterContainer = styled.div`
  color: ${colors.grayUnselected};
  font-size: 2rem;
  font-weight: 500;
  width: 100%;
`;

const SectionBar = styled.div`
  padding: 1em;
  position: relative;
  width: 100%;
`;

const FlashHighlight = styled.div`
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 5px;
  bottom: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0.5rem;
  transition: opacity 0.4s;

  &.flash {
    opacity: 1;
  }
`;

const ClickCounterSpan = styled.span`
  color: ${(props) =>
    props.hasExceeded ? colors.redSelected : colors.grayUnselected};
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

  const restartGame = () => {
    setIsShowingSolution(false);
    setClickCounter(0);

    setGameState({
      ...startingState,
    });
  };

  const newGame = (settings = {}) => {
    const newComplexity = settings.complexity || DEFAULT_COMPLEXITY;
    const newBoardSize = settings.boardSize || BOARD_SIZE;

    const game = createNewGame(newBoardSize, newComplexity);

    setClickCounter(0);
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
      <Board
        gameState={game}
        handleClick={handleTileClick}
        hasWon={game.hasWon}
        isShowingSolution={isShowingSolution}
      />
      <ActionBar>
        <ActionButton onClick={restartGame}>Restart</ActionButton>
        <ActionButton
          disabled={game.hasWon}
          isShowingSolution={isShowingSolution}
          onClick={handleShowSolution}
        >
          Solve
        </ActionButton>
        <ActionButton onClick={() => newGame({ complexity })}>New</ActionButton>
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
      <SectionBar>
        <SubHeader id="instructions">Instructions</SubHeader>
        <InstructionLine>
          • Clear the board by turning all tiles gray
        </InstructionLine>
        <InstructionLine>
          • Clicking a tile inverts that tile, and each tile above, below, left,
          and right of the one clicked.
        </InstructionLine>
        <FlashHighlight className={highlightInstructions ? 'flash' : ''} />
      </SectionBar>
    </AppContainer>
  );
}

export default App;
