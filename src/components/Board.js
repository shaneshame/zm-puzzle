import React from 'react';
import styled from 'styled-components';

import colors from '../colors';
import { coordsToFlattenedIndex, isBinaryTrue } from '../util';
import { WinOverlay } from './WinScreen';

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.boardSize}, 1fr)`};
  height: 100%;
  position: relative;
  width: 100%;
`;

const Tile = styled.div`
  align-items: center;
  aspect-ratio: 1;
  background-color: ${(props) =>
    props.isSelected ? colors.redSelected : colors.grayUnselected};
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

const Board = ({ gameState, handleClick, hasWon, isShowingSolution }) => {
  const { clickedTiles, grid } = gameState;
  const boardSize = grid.length;

  return (
    grid && (
      <BoardContainer boardSize={boardSize}>
        {grid.map((rows, y) =>
          rows.map((value, x) => {
            const flattenedIndex = coordsToFlattenedIndex(x, y, boardSize);
            const isSolutionTile = !!clickedTiles[flattenedIndex];

            return (
              <Tile
                key={`${x}.${y}`}
                isSelected={isBinaryTrue(value)}
                onClick={() => {
                  handleClick(x, y);
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

export { Board };
