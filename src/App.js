import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { ActionBar, ActionButton } from "./ActionBar";
import Board from "./Board";
import { Header, HeaderBar, SubHeader } from "./Header";

import colors from "./colors";

import { clickTile, createNewGame, isBoardEmpty, setSolutions } from "./util";

const COMPLEXITY = 5;
const BOARD_SIZE = 5;

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  height: 100%;
  position: relative;
  width: 100%;
`;

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const AppFitted = styled.div`
  height: 500px;
  width: 500px;
`;

const WinScreen = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;
`;

const WinMessage = styled.span`
  color: ${colors.solution};
  font-size: 4em;
  padding-bottom: 0.5em;
  text-align: center;
  width: 100%;
`;

const initialGame = createNewGame(BOARD_SIZE, COMPLEXITY);

function App() {
  const [startingState, setStartingState] = useState(initialGame);
  const [game, setGameState] = useState(initialGame);

  const restartGame = () => {
    setGameState({
      ...startingState,
      timestamp: uuidv4(),
    });
  };

  const newGame = () => {
    const game = createNewGame(BOARD_SIZE, COMPLEXITY);

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

  const handleClick = (clickedX, clickedY) => {
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
      <AppFitted>
        <HeaderBar>
          <Header>ZM Puzzle</Header>
          <SubHeader>• Clear the board by turning all tiles gray</SubHeader>
          <SubHeader>
            • Clicking a tile inverts that tile, and each tile above, below,
            left, and right of the one clicked.
          </SubHeader>
        </HeaderBar>
        <BoardContainer boardSize={BOARD_SIZE}>
          <Board gameState={game} handleClick={handleClick} />
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
          <ActionButton onClick={newGame}>New</ActionButton>
        </ActionBar>
      </AppFitted>
    </AppContainer>
  );
}

export default App;
