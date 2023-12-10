import React from 'react';
import styled from 'styled-components';

import colors from '../colors';
import { boardToMatrix, coordsToBoardIndex, isBinaryTrue } from '../util';
import { WinOverlay } from './WinScreen';

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  position: relative;
`;

const Tile = styled.div`
  align-items: center;
  aspect-ratio: 1;
  background-color: ${(props) =>
    props.isSelected ? colors.red : colors.grayUnselected};
  border: 2px solid black;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const SolutionIndicator = styled.span`
  aspect-ratio: 1;
  background-color: ${colors.greenSolution};
  border-radius: 50%;
  width: 3rem;
`;

const Board = ({
  board,
  boardSize,
  clickedTiles,
  handleClick,
  hasWon,
  isShowingSolution,
}) => {
  const boardMatrix = boardToMatrix(board);

  return (
    boardSize &&
    boardMatrix && (
      <BoardContainer boardSize={boardSize}>
        {boardMatrix.map((rows, y) =>
          rows.map((value, x) => {
            const boardIndex = coordsToBoardIndex(x, y, boardSize);
            const isSolutionTile = isBinaryTrue(clickedTiles[boardIndex]);

            return (
              <Tile
                key={`${x}.${y}`}
                isSelected={isBinaryTrue(value)}
                onClick={() => {
                  handleClick(boardIndex);
                }}
              >
                {isSolutionTile && isShowingSolution && <SolutionIndicator />}
              </Tile>
            );
          }),
        )}
        {hasWon && <WinOverlay>You Won!!!</WinOverlay>}
      </BoardContainer>
    )
  );
};

Board.displayName = 'Board';

export { Board };
