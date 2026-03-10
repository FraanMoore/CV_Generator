import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import StatusButton, { type status } from './StatusButton';

export type NewEntryData = {
    role: string;
    company: string;
    jobURL: string;
    status: status;
    notes: string;
    jobDescription: string;
    AIEnabled: boolean;
};

type NewEntryDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (data: NewEntryData) => void;
};

const NewEntryDialog = ({ open, onClose, onCreate }: NewEntryDialogProps) => {
    const [status, setStatus] = useState<NewEntryData['status']>('draft');
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [jobURL, setJobURL] = useState('');
    const [notes, setNotes] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [useAI, setUseAI] = useState(true);


    React.useEffect(() => {
        if (open) {
            setStatus('draft');
            setRole('');
            setCompany('');
            setJobURL('');
            setNotes('');
            setJobDescription('');
            setUseAI(true);
        }
    }, [open]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: NewEntryData = {
            role,
            company,
            jobURL,
            status,
            notes,
            jobDescription,
            AIEnabled: useAI,
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
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
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
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
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
                            value={jobURL}
                            onChange={(e) => setJobURL(e.target.value)}
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
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
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
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <FormControlLabel
                        control={

                            <Switch
                                checked={useAI}
                                onChange={(e) => setUseAI(e.target.checked)}
                                color="secondary"
                            />
                        }
                        label={useAI ? "IA Enabled" : "IA Disabled"}
                    />
                    <Button onClick={onClose} color='secondary'>Cancel</Button>
                    <Button type="submit" form="new-entry-form" color='secondary'>
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
