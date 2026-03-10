import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import styled from 'styled-components';
import StatusButton, { type status } from './StatusButton';

export type NewEntryData = {
    role: string;
    company: string;
    jobURL: string;
    status: status;
    notes: string;
    jobDescription: string;
};

type NewEntryDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (data: NewEntryData) => void;
};

const NewEntryDialog = ({ open, onClose, onCreate }: NewEntryDialogProps) => {
    const [status, setStatus] = React.useState<NewEntryData['status']>('draft');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(Array.from(formData.entries()) as [string, string][]);

        const payload: NewEntryData = {
            role: formJson.role || '',
            company: formJson.company || '',
            jobURL: formJson.jobURL || '',
            status,
            notes: formJson.notes || '',
            jobDescription: formJson.jobDescription || ''
        };

        onCreate(payload);
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>New Entry</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a new postulation
                    </DialogContentText>
                    <form onSubmit={handleSubmit} id="new-entry-form">
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
                            variant="standard"
                        />
                        <TextField
                            required
                            margin="dense"
                            id="company"
                            name="company"
                            label="Company Name"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            required
                            margin="dense"
                            id="jobURL"
                            name="jobURL"
                            label="Job URL"
                            type="url"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="notes"
                            name="notes"
                            label="Notes"
                            type="text"
                            fullWidth
                            variant="standard"
                            multiline
                            minRows={2}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="jobDescription"
                            name="jobDescription"
                            label="Job Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            multiline
                            minRows={4}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="new-entry-form">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default NewEntryDialog;

export const NewEntryButton = styled(Button)`
    color: var(--color-font-primary);
    &:hover {
       none;
    }
`;
