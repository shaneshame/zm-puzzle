import React from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-rows: auto;

  ${(props) =>
    props.space &&
    `
    row-gap: ${props.space}rem;
  `}
`;

const SpacedContent = ({ children, space }) => {
  return (
    <Grid space={space} verticalCount={React.Children.count(children)}>
      {children}
    </Grid>
  );
};

SpacedContent.displayName = 'SpacedContent';

export { SpacedContent };
