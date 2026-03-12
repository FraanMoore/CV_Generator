import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

interface SearchProps {
    roles: string[];
    companies: string[];
    value: string;
    onChange: (value: string) => void;
    width?: number | string;
}

export default function Search({
    roles,
    companies,
    value,
    onChange,
    width = 300,
}: SearchProps) {
    const options = useMemo(
        () => Array.from(new Set([...roles, ...companies])),
        [roles, companies],
    );

    return (
        <Stack spacing={2} sx={{ width }}>
            <Autocomplete
                freeSolo
                disableClearable
                options={options}
                value={value}
                onInputChange={(_, newInputValue) => onChange(newInputValue)}
                onChange={(_, newValue) => onChange(newValue || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search by role or company"
                        color='secondary'
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                type: 'search',
                                color: 'secondary',
                                endAdornment: (<SearchIcon color='secondary' />)
                            },
                        }}
                    />
                )}
            />
        </Stack>
    );
}
