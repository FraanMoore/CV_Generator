import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const BaseTypography = styled(Typography).withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  color: var(--text-600);
`;

export default BaseTypography;