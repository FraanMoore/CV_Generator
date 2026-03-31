import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { fetchApplications, uploadJobText, type Application } from "../apis/api";
import Navbar from "../components/Navbar";
import type { NewEntryData } from "../components/NewEntryDialog";

export type RootLayoutContext = {
    applications: Application[];
    refreshApplications: () => Promise<void>;
};
const RootLayout = () => {
    const [applications, setApplications] = useState<Application[]>([]);

    const refreshApplications = async () => {
        const apps = await fetchApplications();
        setApplications(apps);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshApplications();
    }, []);

    const handleCreateEntry = async (data: NewEntryData) => {
        await uploadJobText({
            company: data.company,
            role: data.role,
            lang: "both",
            job_url: data.jobURL,
            job_text: data.jobDescription,
            ai: data.AIEnabled,
            ai_model: "gpt-4.1-mini",
            status: data.status,
            notes: data.notes,
        });

        await refreshApplications();
    };
    return (
        <>
            <Navbar onCreateEntry={handleCreateEntry} />
            <Outlet context={{ applications, refreshApplications }} />
        </>
    );
};

export default RootLayout;