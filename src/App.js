import React, { useState } from "react";
import styled from "styled-components";

import colors from "./colors";
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

const SpacedActionRow = styled(ActionBar)`
  margin-top: 2rem;
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

const initialGame = createNewGame(BOARD_SIZE, DEFAULT_COMPLEXITY);

function App() {
  const [complexity, setComplexity] = useState(DEFAULT_COMPLEXITY);
  const [startingState, setStartingState] = useState(initialGame);
  const [game, setGameState] = useState(initialGame);
  const [isShowingSolution, setIsShowingSolution] = useState(false);
  const [clickedSolutionTiles, setClickedSolutionTiles] = useState([]);

  const defaultSolutionState = () => {
    setClickedSolutionTiles([]);
    setIsShowingSolution(false);
  };

  const restartGame = () => {
    setGameState({
      ...startingState,
    });

    defaultSolutionState();
  };

  const newGame = (settings = {}) => {
    const newComplexity = settings.complexity || DEFAULT_COMPLEXITY;
    const newBoardSize = settings.boardSize || BOARD_SIZE;

    const game = createNewGame(newBoardSize, newComplexity);

    defaultSolutionState();

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
      defaultSolutionState();
    }

    setGameState({
      ...game,
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
            <InstructionsAnchor href="#instructions">[?]</InstructionsAnchor>
          </sup>
        </Header>
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
      <SpacedActionRow>
        <Select
          id="complexity-select"
          onChange={handleSelectComplexity}
          value={complexity}
        >
          {range(MAX_COMPLEXITY + 1).map((n) => {
            return (
              <SelectOption key={n} value={n}>
                Initial Clicks: {n}
              </SelectOption>
            );
          })}
        </Select>
      </SpacedActionRow>
      <HeaderBar>
        <SubHeader id="instructions">Instructions</SubHeader>
        <InstructionLine>
          • Clear the board by turning all tiles gray
        </InstructionLine>
        <InstructionLine>
          • Clicking a tile inverts that tile, and each tile above, below, left,
          and right of the one clicked.
        </InstructionLine>
      </HeaderBar>
    </AppContainer>
  );
}

export default App;
