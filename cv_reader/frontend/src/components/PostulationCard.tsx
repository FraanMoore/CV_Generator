import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { fetchApplication, fetchApplicationDescription, type Application } from '../apis/api';
import { useTranslation } from '../i18n';
import BaseTypography from '../utils/BaseTypography';
import LoadingIndicator from '../utils/LoadingIndicator';
import DownloadDialog from './DownloadDialog';
import EditDialog, { type NewSavedData } from './EditDialog';
import MoreDetailsDialog from './MoreDetailsDialog';
import StatusButton, { type status } from './StatusButton';

export type PostulationCardProps = {
    application: Application;
    onUpdated: (
        id: number,
        data: Partial<Pick<Application, 'company' | 'role' | 'job_url' | 'status' | 'notes'>>
    ) => Promise<void>;
    onDeleted: (id: number) => void;
};

const PostulationCard = ({
    application,
    onUpdated,
    onDeleted
}: PostulationCardProps) => {
    const { t } = useTranslation();
    const [openDetails, setOpenDetails] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [mustKeyWords, setMustKeyWords] = useState<string>('');
    const [niceKeyWords, setNiceKeyWords] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [openDownload, setOpenDownload] = useState(false);
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
                setJobDescription(t("Error loading job description"));
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
    const handleOpenDownload = () => {
        setOpenDownload(true);
    }
    const handleCloseDownload = () => {
        setOpenDownload(false);
    };

    const handleEditSave = async (data: NewSavedData) => {
        await onUpdated(id, {
            company: data.company,
            role: data.role,
            job_url: data.jobURL,
            status: data.status,
            notes: data.notes
        });
    };

    const handleStatusChange = async (newStatus: status) => {
        await onUpdated(id, {
            status: newStatus
        });
    };

    const handleDeleted = (deletedId: number) => {
        if (onDeleted) {
            onDeleted(deletedId);
        }
    };

    const card = (
        <React.Fragment>
            <CardContent className="postulation-card">
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
                            {t(' URL job offer')}
                        </Link>
                    }
                    <br />
                    {notes}
                </URLNotesTypography>
            </CardContent>
            <CardActions>
                <StyledButton onClick={handleMoreDetails} aria-label={t('more-details')}>{t('More details')}</StyledButton>
                <StyledButton onClick={handleEdit} aria-label={t('edit')}>{t('Edit')}</StyledButton>
                <StyledButton onClick={handleOpenDownload} startIcon={<DownloadIcon />} aria-label={t('download')} />
            </CardActions>
        </React.Fragment>
    );

    if (loading) {
        return (
            <>
                <LoadingIndicator />
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
                onDelete={handleDeleted}
            />
            <DownloadDialog id={id} open={openDownload} onClose={handleCloseDownload} />
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
`;
const CompanyTypography = styled(BaseTypography)`
    font-size: var(--font-size-h5);
`;
const URLNotesTypography = styled(BaseTypography)`
    font-size: var(--font-size-h6);
    margin-top: 18px;
    a{
        color: var(--text-950);
        font-size: var(--font-size-h6);
        text-decoration: none;
    }
`;
const StyledButton = styled(Button)`
    font-size: var(--font-size-h6);
    text-transform: none;
    height: stretch;
    .MuiButton-startIcon {
        margin-right: 0px;
    }
`;