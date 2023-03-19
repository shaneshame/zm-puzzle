import styled from 'styled-components';

import colors from '../colors';

const FlashHighlight = styled.div`
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 5px;
  bottom: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0.5rem;
  transition: opacity 0.4s;

  &.flash {
    opacity: 1;
  }
`;

const InstructionsAnchor = styled.a`
  color: ${colors.link};
  margin-left: 0.2rem;

  &:visited {
    color: ${colors.link};
  }
`;

const InstructionsLine = styled.p`
  color: ${colors.grayUnselected};
  font-weight: 500;
`;

const InstructionsSection = styled.section`
  padding: 0 1rem;
  position: relative;
  width: 100%;
`;

export {
  FlashHighlight,
  InstructionsAnchor,
  InstructionsLine,
  InstructionsSection,
};
