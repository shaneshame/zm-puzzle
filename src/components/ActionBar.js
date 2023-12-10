import styled from 'styled-components';

import colors from '../colors';

const ActionBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
`;

const ActionButton = styled.button`
  background: transparent;
  border-radius: 0.12rem;
  border: 0.1rem solid ${colors.white};
  box-sizing: border-box;
  color: ${colors.white};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 300;
  height: 5rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;

  &:disabled {
    background-color: ${colors.grayDark};
    border: 0.1rem solid ${colors.grayDark};
    color: ${colors.gray};
  }

  @media (hover: hover) {
    &:hover {
      background-color: ${colors.white};
      color: ${colors.black};
    }
  }
`;

export { ActionBar, ActionButton };
