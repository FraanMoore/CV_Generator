import TablePagination from '@mui/material/TablePagination';
import * as React from 'react';

export interface PaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => void;
    onRowsPerPageChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
}

export default function Pagination({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: PaginationProps) {
    return (
        <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
        />
    );
}
