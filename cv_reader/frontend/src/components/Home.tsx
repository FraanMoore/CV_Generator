import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchApplications, updateApplication, uploadJobText, type Application } from "../utils/api";
import LoadingIndicator from "../utils/LoadingIndicator";
import Pagination from "../utils/Pagination";

import Navbar from "./Navbar";
import type { NewEntryData } from "./NewEntryDialog";
import PostulationCard from "./PostulationCard";

import { Box } from "@mui/material";
import { useLayout } from "../hooks/useLayout";
import { cardStatusOptions } from "../utils/cardStatusOptions";
import Filter, { type CardStatusOptionType } from "../utils/Filter";
import Search from "../utils/Search";

const Home = () => {
    const { isDesktop } = useLayout();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
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
        const updated = await updateApplication(id, data);
        setApplications(prev =>
            prev.map(app => (app.id === id ? { ...app, ...updated } : app))
        );
    };

    const handleCreateEntry = async (data: NewEntryData) => {
        try {
            await uploadJobText({
                company: data.company,
                role: data.role,
                lang: 'both',
                job_url: data.jobURL,
                job_text: data.jobDescription,
                ai: data.AIEnabled,
                ai_model: 'gpt-4.1-mini',
                status: data.status,
                notes: data.notes,
            });

            const apps = await fetchApplications();
            setApplications(apps);
        } catch (e) {
            console.error("Error creating application", e);
            setError("Error creating job application");
        }
    };

    const handleCardDeleted = () => {
        fetchApplications().then(setApplications).catch(() => setError("Error refreshing applications after deletion"));
    };

    const filteredRows = applications.filter(app => {
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
        const load = async () => {
            try {
                const data = await fetchApplications();
                setApplications(data);
            } catch {
                setError("Error uploading job application");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        localStorage.setItem("statusFilter", JSON.stringify(statusFilter.map(s => s.value)));
    }, [statusFilter]);

    if (loading) {
        return (
            <>
                <Navbar onCreateEntry={handleCreateEntry} />
                <LoadingIndicator />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar onCreateEntry={handleCreateEntry} />
                <p>{error}</p>
            </>
        );
    }

    return (
        <>
            <Navbar onCreateEntry={handleCreateEntry} />
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
        </>
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