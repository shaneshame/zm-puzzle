import React from "react";
import styled from "styled-components";
import colors from "../colors";

const WinMessage = styled.span`
  color: ${colors.solution};
  font-size: 4em;
  padding-bottom: 0.5em;
  text-align: center;
  width: 100%;
`;

const WinScreen = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;
`;

const WinOverlay = ({ children }) => {
  return (
    <WinScreen>
      <WinMessage>{children}</WinMessage>
    </WinScreen>
  );
};

export { WinOverlay };
