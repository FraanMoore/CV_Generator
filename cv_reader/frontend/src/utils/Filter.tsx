import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { cardStatusOptions } from './cardStatusOptions';

export interface CardStatusOptionType {
    label: string;
    value: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft';
}

export default function Filter(props: {
    value?: CardStatusOptionType[];
    onChangeValues?: (values: CardStatusOptionType[]) => void;
}) {
    return (
        <Stack spacing={3} sx={{ width: 300 }}>
            <Autocomplete
                multiple
                id="card-status-filter"
                value={props.value}
                options={cardStatusOptions}
                getOptionLabel={(option) => option?.label}
                onChange={(_, value) => props.onChangeValues?.(Array.isArray(value) ? value : [])}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Status Filter"
                        placeholder="Status"
                    />
                )}
            />
        </Stack>
    );
}