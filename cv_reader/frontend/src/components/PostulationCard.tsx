import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { fetchApplication, fetchApplicationDescription, type Application } from '../utils/api';
import BaseTypography from '../utils/BaseTypography';
import EditDialog, { type NewSavedData } from './EditDialog';
import MoreDetailsDialog from './MoreDetailsDialog';
import StatusButton, { type status } from './StatusButton';

export type PostulationCardProps = {
    application: Application;
    onUpdated: (
        id: number,
        data: Partial<Pick<Application, 'company' | 'role' | 'job_url' | 'status' | 'notes'>>
    ) => Promise<void>;
};

const PostulationCard = ({
    application,
    onUpdated
}: PostulationCardProps) => {
    const [openDetails, setOpenDetails] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [mustKeyWords, setMustKeyWords] = useState<string>('');
    const [niceKeyWords, setNiceKeyWords] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { id, company, role, job_url, status, notes } = application;

    const handleMoreDetails = async () => {
        setOpenDetails(true);
        if (!jobDescription) {
            try {
                setLoading(true);
                const text = await fetchApplicationDescription(id);
                const keyWords = await fetchApplication(id);
                setJobDescription(text);
                setMustKeyWords(`${keyWords.must_keywords || ''}`);
                setNiceKeyWords(`${keyWords.nice_keywords || ''}`);
            } catch {
                setJobDescription("Error loading job description");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    }

    const handleEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleEditSave = async (data: NewSavedData) => {
        await onUpdated(id, {
            company: data.company,
            role: data.role,
            job_url: data.jobURL,
            status: data.status,
            notes: data.notes
        });
    }
    const handleStatusChange = async (newStatus: status) => {
        await onUpdated(id, {
            status: newStatus
        });
    }
    const card = (
        <React.Fragment>
            <CardContent>
                <RoleTypography gutterBottom>
                    {role}
                </RoleTypography>
                <CompanyTypography>
                    {company}
                </CompanyTypography>
                <StatusButton jobStatus={status ?? 'draft'} onChangeStatus={handleStatusChange} />
                <URLNotesTypography>
                    {job_url &&
                        <Link onClick={() => window.open(job_url, '_blank')}>
                            URL job offer
                        </Link>
                    }
                    <br />
                    {notes}
                </URLNotesTypography>
            </CardContent>
            <CardActions>
                <StyledButton size="small" onClick={handleMoreDetails}>More details</StyledButton>
                <StyledButton size="small" onClick={handleEdit}>Edit</StyledButton>
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
            <MoreDetailsDialog open={openDetails} onClose={handleCloseDetails} jobDescription={jobDescription} nice_Words={niceKeyWords} must_Words={mustKeyWords} notes={notes} />
            <EditDialog
                application={application}
                open={openEdit}
                onClose={handleCloseEdit}
                onEdit={handleEditSave}
            />
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