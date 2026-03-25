import { FormControlLabel, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { fetchCvMaster, type CVMasterRaw } from '../apis/api';

type EditCVProps = {
    initialData?: EditCVData;
    onCreate?: (data: EditCVData) => void;
};

type EditCVData = {
    profile: {
        name: string;
        title: string;
        contact: {
            phone: string;
            email: string;
            links: {
                linkedin: string;
                github: string;
                portfolio: string;
            };
            location: string;
        };
    };
    summary: string;
    experience: Array<{
        role: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        bullets: string[];
        tags: string[];
    }>;
    education: Array<{
        degree: string;
        institution: string;
        year: string;
        location: string;
    }>;
    skills: {
        core: string[];
        ui: string[];
        apis: string[];
        tooling: string[];
    };
    languages: Array<{
        name: string;
        level: string;
    }>;
};

type Lang = 'es' | 'en';

function mapCvMasterToEditData(raw: CVMasterRaw, lang: Lang): EditCVData {
    const t = (obj: { es: string; en: string }) => obj[lang];
    return {
        profile: {
            name: raw.profile.name,
            title: t(raw.profile.title),
            contact: {
                phone: raw.profile.contact.phone,
                email: raw.profile.contact.email,
                links: {
                    linkedin:
                        typeof raw.profile.contact.links.linkedin === 'string'
                            ? raw.profile.contact.links.linkedin
                            : t(raw.profile.contact.links.linkedin),
                    github: raw.profile.contact.links.github ?? '',
                    portfolio: raw.profile.contact.links.portfolio ?? '',
                },
                location: t(raw.profile.contact.location),
            },
        },
        summary: raw.summary[lang],
        experience: raw.experience.map(exp => ({
            role: t(exp.role),
            company: exp.company,
            location: t(exp.location),
            startDate: String(exp.startDate),
            endDate: String(exp.endDate),
            bullets: exp.bullets[lang],
            tags: exp.tags,
        })),
        education: raw.education.map(edu => ({
            degree: t(edu.degree),
            institution: edu.institution,
            year: String(edu.year),
            location: t(edu.location),
        })),
        skills: {
            core: raw.skills.core,
            ui: raw.skills.ui ?? [],
            apis: raw.skills.apis,
            tooling: raw.skills.tooling,
        },
        languages: raw.languages.map(l => ({
            name: l.name,
            level: t(l.level),
        })),
    };
}
const EditCV = ({ onCreate }: EditCVProps) => {
    const { t } = useTranslation();
    const [rawCv, setRawCv] = useState<CVMasterRaw | null>(null);
    const [lang, setLang] = useState<Lang>('es');
    const { control, handleSubmit, reset } = useForm<EditCVData>({
        defaultValues: {
            profile: {
                name: '',
                title: '',
                contact: {
                    phone: '',
                    email: '',
                    links: { linkedin: '', github: '', portfolio: '' },
                    location: '',
                },
            },
            summary: '',
            experience: [
                {
                    role: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    bullets: [''],
                    tags: [''],
                },
            ],
            education: [
                { degree: '', institution: '', year: '', location: '' },
            ],
            skills: {
                core: [''],
                ui: [''],
                apis: [''],
                tooling: [''],
            },
            languages: [
                { name: '', level: '' },
            ],
        },
    });

    useEffect(() => {
        const load = async () => {
            try {
                const raw = await fetchCvMaster();
                setRawCv(raw);
                const mapped = mapCvMasterToEditData(raw, 'es');
                reset(mapped);
            } catch (e) {
                console.error(t('Error loading cv_master'), e);
            }
        };
        load();
    }, [reset, t]);

    useEffect(() => {
        if (!rawCv) return;
        const mapped = mapCvMasterToEditData(rawCv, lang);
        reset(mapped);
    }, [rawCv, lang, reset]);

    const onSubmit = (data: EditCVData) => {
        onCreate?.(data);
    };

    const handleSetEs = () => setLang('es');
    const handleSetEn = () => setLang('en');

    return (
        <React.Fragment>
            <div>
                <DialogContent>
                    <DialogContentText>
                        {t('Edit your CV details')}
                    </DialogContentText>
                    <Typography>{t('Choose your CV language')}</Typography>
                    <FormControlLabel
                        label={t('Language')}
                        control={
                            <>
                                <Button onClick={handleSetEn}>{t('EN')}</Button>
                                <Button onClick={handleSetEs}>{t('ES')}</Button>
                            </>
                        }
                    />
                    <form onSubmit={handleSubmit(onSubmit)} id="new-entry-form">
                        <Controller
                            name="profile.name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="name"
                                    label={t('Name')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="profile.title"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="title"
                                    label={t('Title')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="profile.contact.phone"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="phone"
                                    label={t('Phone')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="profile.contact.email"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="email"
                                    label={t('Email')}
                                    type="email"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="profile.contact.links.linkedin"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="linkedin"
                                    label={t('LinkedIn')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="profile.contact.links.github"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="github"
                                    label={t('GitHub')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="profile.contact.location"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="location"
                                    label={t('Location')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="summary"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="summary"
                                    label={t('Summary')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="experience.0.role"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="role"
                                    label={t('Role')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="experience.0.location"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="location"
                                    label={t('Location')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="experience.0.startDate"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="startDate"
                                    label={t('Start Date')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="experience.0.endDate"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="endDate"
                                    label={t('End Date')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="experience.0.bullets.0"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="bullet"
                                    label={t('Bullet Point')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="experience.0.tags.0"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="tag"
                                    label={t('Tag')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="education.0.degree"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="degree"
                                    label={t('Degree')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="education.0.institution"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="institution"
                                    label={t('Institution')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="education.0.year"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="year"
                                    label={t('Year')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="education.0.location"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="location"
                                    label={t('Location')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="skills.core.0"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="core-skill"
                                    label={t('Core Skill')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="skills.ui.0"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="ui-skill"
                                    label={t('UI Skill')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="skills.apis.0"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="apis-skill"
                                    label={t('APIs Skill')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="skills.tooling.0"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="tooling-skill"
                                    label={t('Tooling Skill')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="languages.0.name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="language-name"
                                    label={t('Language Name')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="languages.0.level"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="language-level"
                                    label={t('Language Level')}
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" form="new-entry-form">
                        {t('Save')}
                    </Button>
                </DialogActions>
            </div>
        </React.Fragment>
    );
};

export default EditCV;