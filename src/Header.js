import styled from "styled-components";
import colors from "./colors";

const HeaderBar = styled.div`
  margin: 2em 0;
  width: 100%;
`;

const Header = styled.h1`
  color: ${colors.unselected};
  text-align: center;
`;

const SubHeader = styled.h2`
  color: ${colors.unselected};
`;

export { Header, HeaderBar, SubHeader };
