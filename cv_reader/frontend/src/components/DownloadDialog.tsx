import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { BASE_URL, fetchApplicationFiles, type ApplicationFile } from "../utils/api";
import LoadingIndicator from "../utils/LoadingIndicator";

export type DownloadDialogProps = {
    id: number;
    open: boolean;
    onClose: () => void;
};

const DownloadDialog = ({ id, open, onClose }: DownloadDialogProps) => {
    const [scroll] = useState<DialogProps['scroll']>('paper');
    const [files, setFiles] = useState<ApplicationFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const loadFiles = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiFiles = await fetchApplicationFiles(id);
                setFiles(apiFiles);
            } catch (e) {
                console.error(e);
                setError('Error uploading the files to download');
                setFiles([]);
            } finally {
                setLoading(false);
            }
        };

        void loadFiles();
    }, [id, open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-download"
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle id="scroll-dialog-title">Files to Download</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-download"
                    tabIndex={-1}
                >
                    Select a file to download.

                </DialogContentText>

                {loading && (
                    <LoadingIndicator />
                )}

                {error && !loading && (
                    <Alert severity="error">{error}</Alert>
                )}

                {!loading && !error && (
                    <List>
                        {files.map((file) => (
                            <ListItem key={file.name} disablePadding>
                                <ListItemButton
                                    component="a"
                                    href={`${BASE_URL}/applications/${id}/files/${encodeURIComponent(file.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ListItemText primary={file.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {files.length === 0 && (
                            <ListItem>
                                <ListItemText primary="No hay archivos disponibles para descargar" />
                            </ListItem>
                        )}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DownloadDialog;