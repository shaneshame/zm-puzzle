import styled from 'styled-components';
import colors from '../colors';

const HeaderBar = styled.div`
  margin: 1rem 0;
  position: relative;
`;

const Header = styled.h1`
  color: ${colors.grayUnselected};
  font-size: 2rem;
  text-align: center;
`;

const HeaderLink = styled.a`
  color: inherit;
  cursor: inherit;
  font-size: inherit;
  text-decoration: inherit;
`;

const SubHeader = styled.h2`
  color: ${colors.grayUnselected};
`;

export { Header, HeaderBar, HeaderLink, SubHeader };
