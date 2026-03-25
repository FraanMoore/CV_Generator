import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';
import { useTranslation } from '../i18n';

interface SearchProps {
    roles: string[];
    companies: string[];
    value: string;
    onChange: (value: string) => void;
    width?: number | string;
}

export const Search = ({
    roles,
    companies,
    value,
    onChange,
    width = 300,
}: SearchProps) => {
    const { t } = useTranslation();
    const options = useMemo(
        () => Array.from(new Set([...roles, ...companies])),
        [roles, companies],
    );

    return (
        <Stack spacing={2} sx={{ width }}>
            <Autocomplete
                freeSolo
                options={options}
                value={value}
                onInputChange={(_, newInputValue) => onChange(newInputValue)}
                onChange={(_, newValue) => onChange(newValue || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("Search by role or company")}
                    />
                )}
            />
        </Stack>
    );
}
