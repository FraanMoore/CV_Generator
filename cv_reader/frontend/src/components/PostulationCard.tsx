import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { fetchApplicationDescription } from '../utils/api';
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
    id: number;
};

const PostulationCard = ({
    company,
    role,
    jobURL,
    status,
    keyWords,
    notes,
    id
}: PostulationCardProps) => {
    const [open, setOpen] = useState(false);
    const [jobDescription, setJobDescription] = useState<string>("Loading job description...");
    const [loading, setLoading] = useState(false);

    const handleMoreDetails = async () => {
        setOpen(true);
        if (!jobDescription || jobDescription === "Loading job description...") {
            try {
                setLoading(true);
                const text = await fetchApplicationDescription(id);
                setJobDescription(text);
            } catch {
                setJobDescription("Error loading job description");
            } finally {
                setLoading(false);
            }
        }
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
                    {jobURL &&
                        <Link onClick={() => window.open(jobURL, '_blank')}>
                            URL job offer
                        </Link>
                    }
                    <br />
                    {notes}
                </URLNotesTypography>
            </CardContent>
            <CardActions>
                <StyledButton size="small" onClick={handleMoreDetails}>More details</StyledButton>
                <StyledButton size="small" onClick={handleMoreDetails}>Edit</StyledButton>
            </CardActions>
        </React.Fragment>
    );

    if (loading) {
        return (
            <>
                <p>Cargando...</p>
            </>
        );
    }

    return (
        <Container className="postulation-card-container">
            <StyledCard>{card}</StyledCard>
            <MoreDetailsDialog open={open} onClose={handleClose} jobDescription={jobDescription} keyWords={keyWords} />
        </Container>
    );

}

export default PostulationCard;

const Container = styled(Stack)`
    width: 100%;
    max-width: 350px;
    max-height: 302px;
    box-sizing: border-box;
`;

const StyledCard = styled(Card)`
    margin: 20px;
    .MuiTypography-root{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
`;

const RoleTypography = styled(BaseTypography)`
    font-size: var(--font-size-h6);
    color: var(--color-primary);
`;
const CompanyTypography = styled(BaseTypography)`
    font-size: var(--font-size-h5);
    color: var(--color-primary-dark);
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
const StyledButton = styled(Button)`
    color: var(--color-font-dark);
    font-size: var(--font-size-h6);
    text-transform: none;
`;