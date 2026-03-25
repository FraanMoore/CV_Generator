import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useTranslation } from '../i18n';

export type MoreDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    jobDescription: string;
    must_Words: string;
    nice_Words: string;
    notes?: string;
};

const MoreDetailsDialog = ({ open, onClose, jobDescription, must_Words, nice_Words, notes }: MoreDetailsDialogProps) => {
    const { t } = useTranslation();
    const [scroll] = useState<DialogProps['scroll']>('paper');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={scroll}
            aria-labelledby={t("scroll-dialog-title")}
            aria-describedby={t("scroll-dialog-description")}
        >
            <DialogTitle id="scroll-dialog-title">{t('Job Details')}</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    id="scroll-dialog-description"
                    tabIndex={-1}
                    component="div"
                    autoFocus
                >
                    {notes && (
                        <>
                            <p>{t('Notes')}:</p>
                            {notes}
                        </>
                    )}
                    <p>{t('Job Description')}:</p>
                    {jobDescription}
                    <p>{t('"Must have" keywords')}:</p>
                    {must_Words}
                    <p>{t('"Nice to have" keywords')}:</p>
                    {nice_Words}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('Close')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MoreDetailsDialog;