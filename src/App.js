import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import {
  ActionBar,
  ActionButton,
  Board,
  BoardContainer,
  Header,
  HeaderBar,
  Select,
  SelectOption,
  SubHeader,
  WinMessage,
  WinScreen,
} from "./components";

import {
  clickTile,
  createNewGame,
  isBoardEmpty,
  range,
  setSolutions,
} from "./util";

const DEFAULT_COMPLEXITY = 5;
const MAX_COMPLEXITY = 10;
const BOARD_SIZE = 5;

const AppContainer = styled.div`
  margin: 0 auto;
  width: 500px;
`;

const initialGame = createNewGame(BOARD_SIZE, DEFAULT_COMPLEXITY);

function App() {
  const [complexity, setComplexity] = useState(DEFAULT_COMPLEXITY);
  const [startingState, setStartingState] = useState(initialGame);
  const [game, setGameState] = useState(initialGame);

  const restartGame = () => {
    setGameState({
      ...startingState,
      timestamp: uuidv4(),
    });
  };

  const newGame = (settings = {}) => {
    const newComplexity = settings.complexity || DEFAULT_COMPLEXITY;
    const newBoardSize = settings.boardSize || BOARD_SIZE;

    const game = createNewGame(newBoardSize, newComplexity);

    setGameState(game);
    setStartingState(game);
  };

  const solveGame = () => {
    const solvedGame = setSolutions(startingState);

    setGameState({
      ...solvedGame,
      timestamp: uuidv4(),
    });
  };

  const handleSelectComplexity = (event) => {
    const newComplexity = event.target.value;

    setComplexity(newComplexity);

    newGame({ complexity: newComplexity });
  };

  const handleTileClick = (clickedX, clickedY) => {
    const grid = clickTile(clickedX, clickedY, game.grid);

    setGameState({
      ...game,
      grid,
      hasWon: isBoardEmpty(grid),
      timestamp: uuidv4(),
    });
  };

  return (
    <AppContainer>
      <HeaderBar>
        <Header>ZM Puzzle</Header>
      </HeaderBar>
      <BoardContainer boardSize={BOARD_SIZE}>
        <Board gameState={game} handleClick={handleTileClick} />
        {game.hasWon && (
          <WinScreen>
            <WinMessage>You Won!!!</WinMessage>
          </WinScreen>
        )}
      </BoardContainer>
      <ActionBar>
        <ActionButton onClick={restartGame}>Restart</ActionButton>
        <ActionButton disabled={game.hasWon} onClick={solveGame}>
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
          {range(MAX_COMPLEXITY).map((n) => {
            const value = n + 1;

            return (
              <SelectOption key={value} value={value}>
                Complexity {value}
              </SelectOption>
            );
          })}
        </Select>
      </ActionBar>

      <HeaderBar>
        <SubHeader>• Clear the board by turning all tiles gray</SubHeader>
        <SubHeader>
          • Clicking a tile inverts that tile, and each tile above, below, left,
          and right of the one clicked.
        </SubHeader>
      </HeaderBar>
    </AppContainer>
  );
}

export default App;
