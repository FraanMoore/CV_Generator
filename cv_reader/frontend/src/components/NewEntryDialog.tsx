import CloseIcon from '@mui/icons-material/Close';
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
                <StyledDialogTitle>New Entry
                    <Button
                        onClick={onClose}
                        endIcon={<CloseIcon />}
                    />
                </StyledDialogTitle>
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
                            multiline
                            minRows={1}
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
                            multiline
                            minRows={1}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={useAI}
                                onChange={(e) => setUseAI(e.target.checked)}
                            />
                        }
                        label={useAI ? "IA Enabled" : "IA Disabled"}
                    />
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

const StyledDialogTitle = styled(DialogTitle)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    `;

const StyledSwitch = styled(Switch)`
    .MuiButtonBase-root{
        box-shadow: none;
        background-color: transparent;
    }
   .MuiSwitch-thumb {
   color: var(--primary);
   }

& .MuiSwitch-switchBase {
    &:hover {
      background-color: transparent;
    },

    &.Mui-checked {
      color: var(--primary);
      & + .MuiSwitch-track{
        background-color: var(--primary-500);
      },
    },
  },

  & .MuiSwitch-track {
    background-color: var(--background-300);
  },
`;
