import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { deleteApplication, type Application } from '../utils/api';
import StatusButton, { type status } from './StatusButton';

export type NewSavedData = {
    role: string;
    company: string;
    jobURL: string;
    status: status;
    notes: string;
};

export type EditDialogProps = {
    open: boolean;
    onClose: () => void;
    application: Application | null;
    onEdit: (data: NewSavedData) => void;
    onDelete?: (id: number) => void;
};

const EditDialog = ({ open, onClose, application, onEdit, onDelete }: EditDialogProps) => {
    const [status, setStatus] = useState<NewSavedData['status']>(
        application?.status as NewSavedData['status'] ?? 'draft'
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const role = (formData.get('role') as string) || '';
        const company = (formData.get('company') as string) || '';
        const jobURL = (formData.get('jobURL') as string) || '';
        const notes = (formData.get('notes') as string) || '';

        const payload: NewSavedData = {
            role,
            company,
            jobURL,
            status,
            notes,
        };

        onEdit(payload);
        onClose();
    };

    const handleDelete = async () => {
        if (!application) return;
        await deleteApplication(application.id);
        if (onDelete) {
            onDelete(application.id);
        }
        onClose();
    };

    if (!application) {
        return null;
    }

    return (
        <React.Fragment>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogContent>
                    <StyledDialogContentText>
                        Edit postulation
                        <Button
                            onClick={onClose}
                            endIcon={<CloseIcon />}
                        />
                    </StyledDialogContentText>
                    <form onSubmit={handleSubmit} id="edit-entry-form">
                        <StatusButton jobStatus={status} onChangeStatus={setStatus} />
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="role"
                            name="role"
                            label="Role"
                            type="text"
                            fullWidth
                            defaultValue={application.role}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="company"
                            name="company"
                            label="Company Name"
                            type="text"
                            fullWidth
                            defaultValue={application.company}
                        />
                        <TextField
                            margin="dense"
                            id="jobURL"
                            name="jobURL"
                            label="Job URL"
                            type="url"
                            fullWidth
                            defaultValue={application.job_url}
                        />
                        <TextField
                            margin="dense"
                            id="notes"
                            name="notes"
                            label="Notes"
                            type="text"
                            fullWidth
                            multiline
                            minRows={1}
                            defaultValue={application.notes}
                        />
                    </form>
                </DialogContent>
                <StyledDialogActions>
                    <Chip
                        label="Delete"
                        onClick={handleDelete}
                        onDelete={handleDelete}
                        deleteIcon={<DeleteOutlinedIcon />}
                    />
                    <BasicActionsContainer>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" form="edit-entry-form" loadingIndicator>
                            Save
                        </Button>
                    </BasicActionsContainer>
                </StyledDialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default EditDialog;

const StyledDialogContentText = styled(DialogContentText)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const StyledDialogActions = styled(DialogActions)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const BasicActionsContainer = styled.div`
    display: flex;
    gap: 8px;
`;