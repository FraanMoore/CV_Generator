import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import styled from 'styled-components';



const StatusButton = ({ jobStatus }: { jobStatus: string }) => {
    const [status, setStatus] = React.useState(jobStatus);

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value);
    };

    return (
        <StyledFormControl size="small">
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

const StyledFormControl = styled(FormControl)`
&.MuiFormControl-root {
    margin-top: 12px;
}
`;