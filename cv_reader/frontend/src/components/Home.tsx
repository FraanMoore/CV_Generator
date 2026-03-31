import { useEffect, useState } from "react";
import styled from "styled-components";
import { updateApplication, type Application } from "../apis/api";
import LoadingIndicator from "../utils/LoadingIndicator";
import Pagination from "../utils/Pagination";

import PostulationCard from "./PostulationCard";

import { Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useLayout } from "../hooks/useLayout";
import { useTranslation } from "../i18n";
import { cardStatusOptions } from "../utils/cardStatusOptions";
import { Filter, type CardStatusOptionType } from "../utils/Filter";
import type { RootLayoutContext } from "../utils/RootLayout";
import { Search } from "../utils/Search";


const Home = () => {
    const { t } = useTranslation();
    const { isDesktop } = useLayout();
    const { applications, refreshApplications } = useOutletContext<RootLayoutContext>();

    const [loading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState<CardStatusOptionType[]>(() => {
        const raw = localStorage.getItem("statusFilter");
        if (!raw) {
            return [cardStatusOptions[0]];
        }
        try {
            const parsed = JSON.parse(raw) as CardStatusOptionType['value'][];
            return cardStatusOptions.filter(option => parsed.includes(option.value));
        } catch {
            return [cardStatusOptions[0]];
        }
    });
    const [searchTerm, setSearchTerm] = useState("");

    const handleChangeFilterValue = (value: CardStatusOptionType[]) => {
        setStatusFilter(value);
        localStorage.setItem("statusFilter", JSON.stringify(value.map(s => s.value)));
    }

    const handleUpdateApplication = async (
        id: number,
        data: Partial<Pick<Application, "company" | "role" | "job_url" | "status" | "notes">>
    ) => {
        try {
            await updateApplication(id, data);
            await refreshApplications();
        } catch {
            setError(t("Error updating application"));
        }
    };

    const handleCardDeleted = async () => {
        try {
            await refreshApplications();
        } catch {
            setError(t("Error refreshing applications after deletion"));
        }
    };

    const filteredRows = applications
        .slice()
        .sort((a, b) => b.id - a.id)
        .filter(app => {
            const matchesStatus =
                statusFilter.length === 0
                    ? true
                    : statusFilter.some(s => s.value === app.status);

            const term = searchTerm.trim().toLowerCase();
            if (!term) return matchesStatus;

            const matchesSearch =
                app.company.toLowerCase().includes(term) ||
                app.role.toLowerCase().includes(term);

            return matchesStatus && matchesSearch;
        });

    const paginatedRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    useEffect(() => {
        localStorage.setItem("statusFilter", JSON.stringify(statusFilter.map(s => s.value)));
    }, [statusFilter]);

    if (loading) {
        return (
            <>
                <LoadingIndicator />
            </>
        );
    }

    if (error) {
        return (
            <>
                <p>{t(error)}</p>
            </>
        );
    }

    return (
        <div data-testid="home-page">
            <FiltersContainer $isDesktop={isDesktop}>
                <Filter value={statusFilter} onChangeValues={handleChangeFilterValue} />
                <Search roles={applications.map(app => app.role)} companies={applications.map(app => app.company)} value={searchTerm} onChange={setSearchTerm} />
            </FiltersContainer>
            <CardWrapper>
                {paginatedRows.map((app) => (
                    <PostulationCard
                        key={app.id}
                        application={app}
                        onUpdated={handleUpdateApplication}
                        onDeleted={handleCardDeleted}
                    />
                ))}
            </CardWrapper>
            <Pagination
                count={filteredRows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
        </div>
    );
};
export default Home;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  padding: 24px;
`;
const FiltersContainer = styled(Box) <{ $isDesktop: boolean }>`
    display: flex;
    justify-content: center;
    padding: 12px;
    flex-wrap: nowrap;
    align-items: center;
    flex-direction: ${props => props.$isDesktop ? 'row' : 'column-reverse'};
    gap: 16px;
    background-color: rgba(129, 129, 129, 0.05);;
    border-radius: 10px;
    width: fit-content;
    margin: 30px auto;
`;