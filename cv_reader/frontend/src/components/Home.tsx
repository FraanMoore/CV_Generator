import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchApplications, type Application } from "../utils/api";
import Navbar from "./Navbar";
import PostulationCard from "./PostulationCard";

const Home = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchApplications();
                setApplications(data);
            } catch {
                setError("Error cargando aplicaciones");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <p>Cargando...</p>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <p>{error}</p>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <CardWrapper>
                {applications.map((app) => (
                    <PostulationCard
                        key={app.id}
                        company={app.company}
                        role={app.role}
                        jobURL={app.job_url}
                        status={(["applied", "interviewing", "offer", "rejected", "draft"].includes(app.status ?? "applied") ? app.status ?? "applied" : "applied") as 'applied' | 'interviewing' | 'offer' | 'rejected' | 'draft'}
                        notes={app.notes || "Sin notas"}
                        jobDescription={"Sin descripción"}
                        keyWords={""}
                    />
                ))}
            </CardWrapper>
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