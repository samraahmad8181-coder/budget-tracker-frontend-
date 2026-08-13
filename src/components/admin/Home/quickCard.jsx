import { useNavigate } from "react-router-dom";
import {
    FileText,
    Receipt,
    FilePlus2,
    Route,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const quickActions = [
    {
        label: "New expense",
        icon: FileText,
        color: "bg-pink-600",
        path: "/admin/expenses/new",
    },
    {
        label: "Add receipt",
        icon: Receipt,
        color: "bg-indigo-600",
        path: "/admin/expenses/new",
    },
    {
        label: "Create report",
        icon: FilePlus2,
        color: "bg-teal-600",
        path: "/admin/settings",
    },
    {
        label: "Create trip",
        icon: Route,
        color: "bg-rose-600",
        path: "/admin/trips/new",
    },
];

export function QuickAccess() {
    const navigate = useNavigate();

    return (
        <Card className="mx-8 mt-10 border-2 border-white/5 dark:bg-[#1e1d1d] dark:text-white">
            <CardHeader className="border-b-2 border-b-white/5 pb-2">
                <CardTitle className="text-sm font-semibold dark:text-white">
                    Quick Access
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-2">
                <div className="flex flex-wrap gap-4">
                    {quickActions.map(({ label, icon: Icon, color, path }) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => navigate(path)}
                            className="flex min-w-[180px] flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3.5 text-left text-sm font-medium text-neutral-500 transition-colors hover:bg-white/10"
                        >
                            <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}
                            >
                                <Icon className="h-4 w-4 text-white" />
                            </span>

                            + {label}
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}