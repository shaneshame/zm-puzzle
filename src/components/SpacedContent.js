import styled from 'styled-components';

const Grid = styled.div`
  display: grid;

  ${(props) =>
    props.space &&
    `
    row-gap: ${props.space}rem;
  `}
`;

const SpacedContent = ({ children, space }) => {
  return <Grid space={space}>{children}</Grid>;
};

SpacedContent.displayName = 'SpacedContent';

export { SpacedContent };
