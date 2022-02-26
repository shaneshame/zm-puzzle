import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import {
  ActionBar,
  ActionButton,
  Board,
  Header,
  HeaderBar,
  Select,
  SelectOption,
  SubHeader,
} from "./components";

import {
  clickTile,
  createNewGame,
  isBoardEmpty,
  isTuplePresent,
  range,
} from "./util";

const DEFAULT_COMPLEXITY = 5;
const MAX_COMPLEXITY = 5;
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
  const [clickedSolutionTiles, setClickedSolutionTiles] = useState([]);

  const restartGame = () => {
    setGameState({
      ...startingState,
      // timestamp: uuidv4(),
    });

    setClickedSolutionTiles([]);
    setIsShowingSolution(false);
  };

  const newGame = (settings = {}) => {
    const newComplexity = settings.complexity || DEFAULT_COMPLEXITY;
    const newBoardSize = settings.boardSize || BOARD_SIZE;

    const game = createNewGame(newBoardSize, newComplexity);

    setIsShowingSolution(false);
    setGameState(game);
    setStartingState(game);
  };

  const handleShowSolution = () => {
    restartGame();
    setIsShowingSolution(!isShowingSolution);
  };

  const handleSelectComplexity = (event) => {
    const newComplexity = event.target.value;

    setComplexity(newComplexity);

    newGame({ complexity: newComplexity });
  };

  const handleTileClick = (clickedX, clickedY) => {
    const grid = clickTile(clickedX, clickedY, game.grid);

    if (
      isTuplePresent([clickedX, clickedY], game.clickCoords) &&
      !isTuplePresent([clickedX, clickedY], clickedSolutionTiles)
    ) {
      setClickedSolutionTiles([...clickedSolutionTiles, [clickedX, clickedY]]);
    } else {
      setIsShowingSolution(false);
      setClickedSolutionTiles([]);
    }

    setGameState({
      ...game,
      grid,
      hasWon: isBoardEmpty(grid),
      // timestamp: uuidv4(),
    });
  };

  return (
    <AppContainer>
      <HeaderBar>
        <Header>ZM Puzzle</Header>
      </HeaderBar>
      <Board
        gameState={{
          ...game,
          clickCoords: game.clickCoords.filter(
            (clickCoords) => !isTuplePresent(clickCoords, clickedSolutionTiles)
          ),
        }}
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
