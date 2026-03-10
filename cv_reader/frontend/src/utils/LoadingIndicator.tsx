import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";

const Loading = styled.div<{ size: number; color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${p => p.size}px;
  flex-grow: 1;
  color: ${p => p.color};
  padding: 4px 0;
`;

type loadingIndicatorProps = {
    size?: number;
    className?: string;
    color?: string;
};

const LoadingIndicator = (props: loadingIndicatorProps) => {
    const { className, size = 64, color = 'secondary' } = props;

    return (
        <Loading
            aria-label='Loading...'
            className={className}
            color={color}
            data-testid="loading-indicator"
            role="status"
            size={size}
        >
            <CircularProgress />
        </Loading>
    );
};

export default LoadingIndicator;
