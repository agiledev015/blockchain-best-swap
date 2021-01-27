import styled from 'styled-components';
import { palette } from 'styled-theme';

import Tooltip from '../tooltip';

const sizes = {
  small: '16px',
  normal: '30px',
};

export const TooltipIconWrapper = styled(Tooltip)`
  min-width: ${sizes.normal} !important;
  width: ${sizes.normal};
  height: ${sizes.normal};
  border-radius: 50% !important;

  &:hover {
    box-shadow: 0px 0px 4px 2px ${palette('primary', 0)};
  }
`;
