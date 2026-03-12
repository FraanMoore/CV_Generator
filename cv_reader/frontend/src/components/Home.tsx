import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchApplications, updateApplication, uploadJobText, type Application } from "../utils/api";
import LoadingIndicator from "../utils/LoadingIndicator";
import Pagination from "../utils/Pagination";

import Navbar from "./Navbar";
import type { NewEntryData } from "./NewEntryDialog";
import PostulationCard from "./PostulationCard";

import CustomizedHook, { type CardStatusOptionType } from "../utils/Filter";
import FreeSolo from "../utils/Search";

const Home = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [statusFilter, setStatusFilter] = useState<CardStatusOptionType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

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
            <FiltersContainer>
                <CustomizedHook onChangeValues={setStatusFilter} />
                <FreeSolo roles={applications.map(app => app.role)} companies={applications.map(app => app.company)} value={searchTerm} onChange={setSearchTerm} />
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
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 12))}
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
const FiltersContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 12px;
    flex-direction: column-reverse;
    flex-wrap: nowrap;
    align-items: center;
`;