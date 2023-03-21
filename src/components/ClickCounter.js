import styled from 'styled-components';

import colors from '../colors';

const Container = styled.div`
  color: ${colors.grayUnselected};
  font-size: 2rem;
  font-weight: 500;
  width: 100%;
`;

const Clicks = styled.span`
  color: ${(props) => (props.hasExceeded ? colors.red : colors.grayUnselected)};
`;

const ClickCounter = ({ clickedTiles = [], complexity, count, label }) => {
  const numUniqueClicks = clickedTiles.filter(Boolean).length;

  const innerHtml =
    complexity > 0 ? (
      <>
        <Clicks hasExceeded={complexity > 0 && count > complexity}>
          {count}
        </Clicks>
        /{complexity}
      </>
    ) : (
      <>_/{numUniqueClicks}</>
    );

  return (
    <Container>
      {label}
      {innerHtml}
    </Container>
  );
};

ClickCounter.displayName = 'ClickCounter';

export { ClickCounter };
