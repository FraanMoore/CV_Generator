import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useLayout } from '../hooks/useLayout';
import BaseTypography from '../utils/BaseTypography';
import MoreDetailsDialog from './MoreDetailsDialog';
import StatusButton from './StatusButton';

export type PostulationCardProps = {
    company: string;
    role: string;
    jobURL: string;
    status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft';
    notes: string;
    jobDescription: string;
    keyWords: string;
};

const PostulationCard = ({
    company,
    role,
    jobURL,
    status,
    notes,
    jobDescription,
    keyWords
}: PostulationCardProps) => {
    const { isMobile } = useLayout();
    const [open, setOpen] = useState(false);

    const handleMoreDetails = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                <URLNotesTypography>
                    <Link onClick={() => window.open(jobURL, '_blank')}>
                        URL job offer
                    </Link>
                    <br />
                    {notes}
                </URLNotesTypography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleMoreDetails}>More details</Button>
            </CardActions>
        </React.Fragment>
    );

    return (
        <Container>
            <CardContainer $isMobile={isMobile}>
                <StyledCard $isMobile={isMobile} variant="outlined">{card}</StyledCard>
            </CardContainer>
            <MoreDetailsDialog open={open} onClose={handleClose} jobDescription={jobDescription} keyWords={keyWords} />
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
const URLNotesTypography = styled(BaseTypography)`
    font-size: var(--font-size-h6);
    color: var(--color-primary-light);
    margin-top: 18px;
    a{
        color: var(--color-primary-light);
        font-size: var(--font-size-h6);
        text-decoration: none;
    }
`;