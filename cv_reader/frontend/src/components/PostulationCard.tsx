import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import styled from 'styled-components';
import { useLayout } from '../hooks/useLayout';
import BaseTypography from '../utils/BaseTypography';
import StatusButton from './StatusButton';

export type PostulationCardProps = {
    company: string;
    role: string;
    jobURL: string;
    status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft';
    notes: string;
};

const PostulationCard = ({
    company,
    role,
    jobURL,
    status,
    notes
}: PostulationCardProps) => {
    const { isMobile } = useLayout();

    const card = (
        <React.Fragment>
            <CardContent>
                <RoleTypography gutterBottom>
                    {role}
                </RoleTypography>
                <CompanyTypography>
                    {company}
                </CompanyTypography>
                <StatusButton jobStatus={status} />
                <Typography variant="body2">
                    {jobURL}.
                    <br />
                    {notes}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">More details</Button>
            </CardActions>
        </React.Fragment>
    );
    return (
        <Container>
            <CardContainer $isMobile={isMobile}>
                <StyledCard $isMobile={isMobile} variant="outlined">{card}</StyledCard>
            </CardContainer>
        </Container>
    );

}

export default PostulationCard;

const Container = styled(Box)`
    margin-top: 80px;
`;
const CardContainer = styled(Box) <{ $isMobile: boolean }> `
    display: flex;
    justify-content: ${props => props.$isMobile ? 'center' : 'flex-start'};
    align-items: center;
`;
const StyledCard = styled(Card) <{ $isMobile: boolean }>`
    width: ${props => props.$isMobile ? '100%' : '30%'};
    margin: 20px;
`;

const RoleTypography = styled(BaseTypography)`
    font-size: var(--font-size-h6);
    color: var(--color-primary-light);
`;
const CompanyTypography = styled(BaseTypography)`
    font-size: var(--font-size-h5);
    color: var(--color-primary);
`;