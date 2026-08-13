import {
    Clock,
    MapPin,
    ImageIcon,
    Users,
    RefreshCcw,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

// const pendingTasks = [
//     {
//         label: "Pending Approvals",
//         value: "5",
//         icon: Clock,
//     },
//     {
//         label: "New Trips Registered",
//         value: "1",
//         icon: MapPin,
//     },
//     {
//         label: "Unreported Expenses",
//         value: "4",
//         icon: ImageIcon,
//     },
//     {
//         label: "Upcoming Expenses",
//         value: "0",
//         icon: Users,
//     },
//     {
//         label: "Unreported Advances",
//         value: "€0.00",
//         icon: RefreshCcw,
//     },
// ];

const teamBadgeStyles = {
    Marketing:
        "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    Sales:
        "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    Operations:
        "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30",
    Finance:
        "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",

    General:
        "bg-purple-700 text-white border border-gray-500/30",
};

export function TasksAndExpenses({ dashboard }) {




    const formatAmount = (amount, currency) => {
        const symbol = currency === "EUR" ? "€" : currency || "";
        return `${symbol}${Number(amount).toFixed(2)}`;
    };
    return (
        <div className="flex flex-wrap gap-5 px-8 pt-20">
            {/* Pending Tasks */}
            <Card className="min-w-[280px] flex-1 border-2 border-white/5 dark:bg-[#1e1d1d] dark:text-white">
                <CardHeader className="pb-2 border-b-2 border-b-white/5">
                    <CardTitle className="text-sm font-semibold  dark:text-white">
                        Pending Tasks
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                    <ul className="text-purple-400">
                        {[
                            {
                                label: "Pending Approvals",
                                value: dashboard?.pendingTasks?.pendingApprovals ?? 0,
                                icon: Clock,
                            },
                            {
                                label: "New Trips Registered",
                                value: dashboard?.pendingTasks?.newTripsRegistered ?? 0,
                                icon: MapPin,
                            },
                            {
                                label: "Unreported Expenses",
                                value: dashboard?.pendingTasks?.unreportedExpenses ?? 0,
                                icon: ImageIcon,
                            },
                            {
                                label: "Upcoming Expenses",
                                value: dashboard?.pendingTasks?.upcomingExpenses ?? 0,
                                icon: Users,
                            },
                            {
                                label: "Unreported Advances",
                                value: dashboard?.pendingTasks?.unreportedAdvances ?? "€0.00",
                                icon: RefreshCcw,
                            },
                        ].map(({ label, value, icon: Icon }) => (
                            <li
                                key={label}
                                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                            >
                                <span className="flex items-center gap-3 text-sm text-neutral-500">
                                    <Icon className="h-4 w-4 text-purple-600" />
                                    {label}
                                </span>

                                <span className="text-sm font-semibold dark:text-white text-black">
                                    {value}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card className="min-w-[320px] flex-[2] border border-white/5 dark:bg-[#1e1d1d] dark:text-white">
                <CardHeader className="pb-2 border-b border-b-white/5">
                    <CardTitle className="text-sm font-semibold dark:text-white">
                        Recent Expenses
                    </CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto pt-0">
                    <table className="w-full min-w-[480px] text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-neutral-500">
                                <th className="pb-2 font-medium">Subject</th>
                                <th className="pb-2 font-medium">Employee</th>
                                <th className="pb-2 font-medium">Team</th>
                                <th className="pb-2 text-right font-medium">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dashboard?.recentExpenses?.map((expense) => (
                                <tr key={expense.id}>
                                    <td className="py-2.5 pr-2 text-neutral-500">
                                        {expense.subject}
                                    </td>

                                    <td className="py-2.5 pr-2 text-neutral-500">
                                        {expense.name || "Unknown"}
                                    </td>

                                    <td className="py-2.5 pr-2">
                                        <Badge
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${teamBadgeStyles[expense.category] ||
                                                teamBadgeStyles.General
                                                }`}
                                        >
                                            {expense.category || "General"}
                                        </Badge>
                                    </td>

                                    <td className="py-2.5 text-right font-semibold dark:text-white">
                                        {formatAmount(expense.amount, expense.currency)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}