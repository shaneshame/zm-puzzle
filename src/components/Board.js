import React from "react";
import styled from "styled-components";

import colors from "../colors";

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  height: 100%;
  position: relative;
  width: 100%;
`;

const Tile = styled.div`
  aspect-ratio: 1;
  background-color: ${(props) =>
    props.isSelected ? colors.selected : colors.unselected};
  border: 2px solid black;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TileText = styled.span`
  color: ${colors.solution};
  font-size: 3em;
  font-weight: 700;
  text-align: center;
  padding-bottom: 4px;
  width: 100%;
`;

const Board = ({ gameState, handleClick }) => {
  const boardSize = gameState.grid.length;

  return (
    gameState.grid && (
      <BoardContainer boardSize={boardSize}>
        {gameState.grid.map((rows) =>
          rows.map(({ x, y, solution, ...rest }) => {
            return (
              <Tile
                {...rest}
                key={`${x}.${y}`}
                onClick={() => {
                  handleClick(x, y);
                }}
              >
                {solution && <TileText>{solution}</TileText>}
              </Tile>
            );
          })
        )}
      </BoardContainer>
    )
  );
};

export { Board };
