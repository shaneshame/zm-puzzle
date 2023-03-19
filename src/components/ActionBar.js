import styled from 'styled-components';

import colors from '../colors';

const ActionBar = styled.div`
  display: flex;
  width: 100%;
`;

const ActionButton = styled.button`
  background: transparent;
  border-radius: 0.12rem;
  border: 0.1rem solid ${colors.white};
  box-sizing: border-box;
  color: ${colors.white};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  display: inline-block;
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 300;
  height: 5rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  width: 100%;

  &:disabled {
    background-color: ${colors.grayDark};
    border: 0.1rem solid ${colors.grayDark};
    color: ${colors.gray};
  }

  @media all and (max-width: 30rem) {
    display: block;
    margin: 0.4rem auto;
  }

  @media (hover: hover) {
    &:hover {
      background-color: ${colors.white};
      color: ${colors.black};
    }
  }
`;

export { ActionBar, ActionButton };
