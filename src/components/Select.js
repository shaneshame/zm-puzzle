import styled from 'styled-components';

import colors from '../colors';

const Select = styled.select`
  background-color: transparent;
  border: 0.1rem solid ${colors.white};
  color: ${colors.white};
  font-size: 1.5rem;
  height: 5rem;
  text-align: center;
`;

const SelectOption = styled.option`
  background-color: ${colors.appBackground};
  border-color: ${colors.white};
  color: ${colors.white};
`;

export { Select, SelectOption };
