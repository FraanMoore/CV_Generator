import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import { useTranslation } from "../i18n";

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
    const { t } = useTranslation();
    const { className, size = 64, color = 'var(--primary-600)' } = props;

    return (
        <Loading
            aria-label={t('Loading...')}
            className={className}
            color={color}
            data-testid="loading-indicator"
            role="status"
            size={size}
        >
            <CircularProgress aria-label={t('Loading...')} />
        </Loading>
    );
};

export default LoadingIndicator;
