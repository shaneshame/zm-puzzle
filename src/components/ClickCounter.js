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

const DELIMITER = '/';

const ClickCounter = ({ clickedTiles = [], count, label, minClicks }) => {
  return (
    <Container>
      {label}
      {minClicks > 0 ? (
        <>
          <Clicks hasExceeded={count > minClicks}>{count}</Clicks>
          {DELIMITER}
          {minClicks}
        </>
      ) : (
        clickedTiles.filter(Boolean).length
      )}
    </Container>
  );
};

ClickCounter.displayName = 'ClickCounter';

export { ClickCounter };
