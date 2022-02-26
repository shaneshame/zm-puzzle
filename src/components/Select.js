import styled from "styled-components";

import colors from "../colors";

const Select = styled.select`
  background-color: transparent;
  border-color: ${colors.white};
  color: ${colors.white};
  font-size: 1.5em;
  text-align: center;
  width: 100%;
`;

const SelectOption = styled.option`
  background-color: ${colors.appBackground};
  border-color: ${colors.white};
  color: ${colors.white};
`;

export { Select, SelectOption };
