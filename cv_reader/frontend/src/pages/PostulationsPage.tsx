import Box from '@mui/material/Box';
import * as React from 'react';
import NewEntryDialog, { type NewEntryData, NewEntryButton } from '../components/NewEntryDialog';
import PostulationCard from '../components/PostulationCard';

const PostulationsPage = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [postulations, setPostulations] = React.useState<NewEntryData[]>([]);

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    const handleCreate = (data: NewEntryData) => {
        setPostulations(prev => [...prev, data]);
    };

    return (
        <Box>
            <NewEntryButton onClick={handleOpenDialog}>New Entry</NewEntryButton>
            {postulations.map((p, index) => (
                <PostulationCard
                    key={index}
                    company={p.company}
                    role={p.role}
                    jobURL={p.jobURL}
                    status={p.status}
                    notes={p.notes}
                    jobDescription={p.jobDescription}
                    keyWords={''}
                />
            ))}
            <NewEntryDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onCreate={handleCreate}
            />
        </Box>
    );
};

export default PostulationsPage;