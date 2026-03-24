import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';

export type EditCVData = {
    profile: {
        name: string;
        title: string;
    };
    contact: {
        phone: string;
        email: string;
        links: {
            linkedin?: string;
            github?: string;
            portfolio?: string;
        };
        location: string;
    };
    summary: string;
    experience: {
        role: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        bullets: string[];
        tags: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        year: string;
        location: string;
    }[];
    skills: {
        core: string[];
        ui: string[];
        apis: string[];
        tooling: string[];
    }
    languages: {
        name: string;
        level: string;
    }[];
};

type EditCVProps = {
    onCreate?: (data: EditCVData) => void;
};

const EditCV = ({ onCreate }: EditCVProps) => {
    const { control, handleSubmit, reset } = useForm<EditCVData>({
        defaultValues: {
            profile: {
                name: '',
                title: '',
            },
            contact: {
                phone: '',
                email: '',
                links: {
                    linkedin: '',
                    github: '',
                    portfolio: '',
                },
                location: '',
            },
            summary: '',
            experience: [],
            education: [],
            skills: {
                core: [],
                ui: [],
                apis: [],
                tooling: [],
            },
            languages: [],
        },
    });

    const onSubmit = (data: EditCVData) => {
        onCreate?.(data);
        reset();
    };

    return (
        <React.Fragment>
            <div>
                <DialogContent>
                    <DialogContentText>
                        Edit your CV details
                    </DialogContentText>
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
                                    label="Name"
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
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="contact.phone"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="phone"
                                    label="Phone"
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="contact.email"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="contact.links.linkedin"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="linkedin"
                                    label="LinkedIn"
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="contact.links.github"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="github"
                                    label="GitHub"
                                    type="text"
                                    fullWidth
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="contact.location"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    required
                                    margin="dense"
                                    id="location"
                                    label="Location"
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
                                    label="Summary"
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
                                    label="Role"
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
                                    label="Location"
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
                                    label="Start Date"
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
                                    label="End Date"
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
                                    label="Bullet Point"
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
                                    label="Tag"
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
                                    label="Degree"
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
                                    label="Institution"
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
                                    label="Year"
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
                                    label="Location"
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
                                    label="Core Skill"
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
                                    label="UI Skill"
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
                                    label="APIs Skill"
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
                                    label="Tooling Skill"
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
                                    label="Language Name"
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
                                    label="Language Level"
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
                        Save
                    </Button>
                </DialogActions>
            </div>
        </React.Fragment>
    );
};

export default EditCV;