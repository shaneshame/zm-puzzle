import React from "react";
import styled from "styled-components";
import colors from "./colors";

const Tile = styled.div`
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
  return (
    gameState.grid && (
      <>
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
      </>
    )
  );
};

export default Board;
