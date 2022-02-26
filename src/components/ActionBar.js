import styled from "styled-components";

import colors from "../colors";

const ActionBar = styled.div`
  display: flex;
  height: 5em;
  justify-content: space-between;
  margin: 1rem 0;
  width: 100%;
`;

const ActionButton = styled.button`
  background: transparent;
  border-radius: 0.12em;
  border: 0.1em solid ${colors.white};
  box-sizing: border-box;
  color: ${colors.white};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-size: 1.5em;
  font-weight: 300;
  height: 100%;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    &:not([disabled]) {
      color: ${colors.black};
      background-color: ${colors.white};
    }
  }

  &:disabled {
    background-color: ${colors.grayDark};
    border: 0.1em solid ${colors.grayDark};
    color: ${colors.gray};
  }

  @media all and (max-width: 30em) {
    display: block;
    margin: 0.4em auto;
  }
`;

export { ActionBar, ActionButton };
