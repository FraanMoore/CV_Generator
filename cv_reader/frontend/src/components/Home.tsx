import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchApplications, updateApplication, uploadJobText, type Application } from "../utils/api";
import Navbar from "./Navbar";
import type { NewEntryData } from "./NewEntryDialog";
import TablePaginationDemo from "./Pagination";
import PostulationCard from "./PostulationCard";

const Home = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }

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
                <p>Cargando...</p>
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
            <CardWrapper>
                {applications.map((app) => (
                    <PostulationCard
                        key={app.id}
                        application={app}
                        onUpdated={handleUpdateApplication}
                        onDeleted={handleCardDeleted}
                    />
                ))}
            </CardWrapper>
            <TablePaginationDemo />
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