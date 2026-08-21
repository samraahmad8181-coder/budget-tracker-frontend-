import React, { useEffect, useState } from "react";
import { TasksAndExpenses } from "@/components/admin/Home/taskexpenses";
import { QuickAccess } from "@/components/admin/Home/quickCard";
import { MonthlyReport } from "@/components/admin/Home/barCharts";

const API_URL = `${import.meta.env.VITE_API_URL}/dashboard`;

const Home = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await fetch(
                API_URL
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setDashboard(result.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-black">
            <TasksAndExpenses dashboard={dashboard} />
            <QuickAccess />
            <MonthlyReport dashboard={dashboard} />
        </div>
    );
};

export default Home;