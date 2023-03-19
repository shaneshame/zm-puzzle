import styled from 'styled-components';

import colors from '../colors';

const ClickCounterContainer = styled.div`
  color: ${colors.grayUnselected};
  font-size: 2rem;
  font-weight: 500;
  width: 100%;
`;

const ClickCounterSpan = styled.span`
  color: ${(props) =>
    props.hasExceeded ? colors.redSelected : colors.grayUnselected};
`;

export { ClickCounterContainer, ClickCounterSpan };
