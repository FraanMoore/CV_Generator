import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import styled from 'styled-components';

export type StatusButtonProps = {
    jobStatus: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft' | string;
    onChangeStatus?: (status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft') => void;
};

type status = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft';

const StatusButton = ({ jobStatus, onChangeStatus }: StatusButtonProps) => {
    const [status, setStatus] = React.useState(jobStatus);

    const handleChange = (event: SelectChangeEvent) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        if (onChangeStatus) {
            onChangeStatus(newStatus as status);
        }
    };

    return (
        <StyledFormControl size="small" $status={status as status}>
            <InputLabel id="demo-select-small-label">Status</InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={status}
                label="Status"
                onChange={handleChange}
            >
                <MenuItem value="applied">applied</MenuItem>
                <MenuItem value="interviewing">interviewing</MenuItem>
                <MenuItem value="offer">offer</MenuItem>
                <MenuItem value="rejected">rejected</MenuItem>
                <MenuItem value="draft">draft</MenuItem>
            </Select>
        </StyledFormControl>
    );
};
export default StatusButton;

const StyledFormControl = styled(FormControl) <{ $status: status }>`
&.MuiFormControl-root {
    margin-top: 12px;

    background-color: var(--bg-${props => props.$status});
    color: var(--color-${props => props.$status});
}
.MuiOutlinedInput-root{
    background-color: var(--bg-${props => props.$status});
    color: var(--color-${props => props.$status});
    }

& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: var(--color-${props => props.$status});
    border-width: 1px;
  }
    &:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: var(--color-${props => props.$status});
  }
}
`;