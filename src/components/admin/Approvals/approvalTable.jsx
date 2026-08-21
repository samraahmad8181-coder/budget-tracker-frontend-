import React, { useEffect, useState } from "react";
import { Eye, Check, X, ChevronDown } from "lucide-react";
import ApprovalDetail from "./approvaldetail";

const API_URL = `${import.meta.env.VITE_API_URL}/approvals`;

const frequencyOptions = [
    "Once",
    "Monthly",
    "Bi-Monthly",
];

const categoryStyles = {
    Travel: "bg-indigo-900/70 text-indigo-300",
    Food: "bg-red-900/70 text-red-300",
    Software: "bg-pink-900/70 text-pink-300",
    Office: "bg-yellow-900/70 text-yellow-300",
    Marketing: "bg-purple-900/70 text-purple-300",
};

const ApprovalTable = () => {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFrequency, setOpenFrequency] = useState(null);

    const [selectedApproval, setSelectedApproval] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // ==========================================
    // GET APPROVALS
    // ==========================================
    const fetchApprovals = async () => {
        try {
            setLoading(true);

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch approvals");
            }

            const data = await response.json();

            setApprovals(data.approvals || []);
        } catch (error) {
            console.error("Fetch approvals error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    // ==========================================
    // OPEN APPROVAL DETAIL
    // ==========================================
    const handleViewApproval = (approval) => {
        setSelectedApproval(approval);
        setShowDetails(true);
    };

    // ==========================================
    // UPDATE FREQUENCY
    // ==========================================
    const handleFrequencyChange = async (id, frequency) => {
        try {
            const response = await fetch(
                `${API_URL}/${id}/frequency`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        frequency,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update frequency"
                );
            }

            // Update table
            setApprovals((prev) =>
                prev.map((approval) =>
                    approval.id === id
                        ? {
                            ...approval,
                            frequency,
                        }
                        : approval
                )
            );

            // Update detail modal if open
            setSelectedApproval((prev) =>
                prev && prev.id === id
                    ? {
                        ...prev,
                        frequency,
                    }
                    : prev
            );
        } catch (error) {
            console.error(
                "Update frequency error:",
                error
            );

            alert(error.message);

            // Reload original data
            fetchApprovals();
        }
    };

    // ==========================================
    // APPROVE / REJECT
    // ==========================================
    const handleStatus = async (id, status) => {
        try {
            // If rejected/wrong → DELETE from approvals table
            if (status === "Rejected") {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE",
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to delete approval"
                    );
                }

                // Remove row from frontend immediately
                setApprovals((prev) =>
                    prev.filter((approval) => approval.id !== id)
                );

                // Close detail modal if this approval is open
                setSelectedApproval((prev) =>
                    prev?.id === id ? null : prev
                );

                setShowDetails(false);

                return;
            }

            // Normal approve → update status
            const response = await fetch(
                `${API_URL}/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update approval status"
                );
            }

            setApprovals((prev) =>
                prev.map((approval) =>
                    approval.id === id
                        ? {
                            ...approval,
                            status,
                        }
                        : approval
                )
            );

            setSelectedApproval((prev) =>
                prev && prev.id === id
                    ? {
                        ...prev,
                        status,
                    }
                    : prev
            );
        } catch (error) {
            console.error("Approval action error:", error);
            alert(error.message);
        }
    };

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6 text-gray-900 dark:bg-[#111111] dark:text-white">
                <div className="rounded-xl bg-white p-6 dark:bg-[#090909]">

                    {/* HEADER */}
                    <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                        <h1 className="text-3xl font-bold">
                            Approvals
                        </h1>

                        <div className="text-sm text-gray-400">
                            {approvals.length}{" "}
                            {approvals.length === 1
                                ? "Approval"
                                : "Approvals"}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px]">

                            {/* TABLE HEADER */}
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                    <th className="px-5 py-4">
                                        OWNER
                                    </th>

                                    <th className="px-5 py-4">
                                        CATEGORY
                                    </th>

                                    <th className="px-5 py-4">
                                        AMOUNT
                                    </th>

                                    <th className="px-5 py-4">
                                        FREQUENCY
                                    </th>

                                    <th className="px-5 py-4">
                                        ACTION
                                    </th>
                                </tr>
                            </thead>

                            {/* TABLE BODY */}
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-12 text-center text-gray-400"
                                        >
                                            Loading approvals...
                                        </td>
                                    </tr>
                                ) : approvals.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-12 text-center text-gray-400"
                                        >
                                            No approvals found
                                        </td>
                                    </tr>
                                ) : (
                                    approvals.map(
                                        (approval) => (
                                            <tr
                                                key={
                                                    approval.id
                                                }
                                                onClick={() =>
                                                    handleViewApproval(
                                                        approval
                                                    )
                                                }
                                                className="cursor-pointer border-b border-gray-200 bg-white transition hover:bg-gray-50 even:bg-gray-50 dark:border-gray-800 dark:bg-[#191919] dark:hover:bg-[#222222] dark:even:bg-[#272727]"
                                            >

                                                {/* OWNER */}
                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-700 text-sm font-bold text-cyan-400">
                                                            {approval.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {
                                                                    approval.name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* CATEGORY */}
                                                {/* CATEGORY */}
                                                <td className="px-5 py-5">
                                                    <span
                                                        className={`inline-flex rounded-full px-6 py-1.5 text-xs font-semibold ${approval.status === "Approved"
                                                            ? "bg-purple-800 text-purple-300"
                                                            : categoryStyles[approval.category] ||
                                                            "bg-pink-800 text-gray-300"
                                                            }`}
                                                    >
                                                        {approval.category}
                                                    </span>
                                                </td>

                                                {/* AMOUNT */}
                                                <td className="px-5 py-5 font-semibold text-gray-900 dark:text-white">
                                                    €
                                                    {Number(
                                                        approval.amount
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                {/* FREQUENCY DROPDOWN */}
                                                {/* FREQUENCY DROPDOWN */}
                                                <td className="px-5 py-5">
                                                    <div
                                                        className="relative w-[130px]"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {/* SELECT BUTTON */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setOpenFrequency(
                                                                    openFrequency === approval.id
                                                                        ? null
                                                                        : approval.id
                                                                )
                                                            }
                                                            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111111] dark:text-white dark:hover:border-gray-600 dark:hover:bg-[#161616] focus:border-cyan-500/50 focus:outline-none"
                                                        >
                                                            <span>{approval.frequency}</span>

                                                            <ChevronDown
                                                                size={16}
                                                                className={`text-gray-400 transition-transform duration-200 ${openFrequency === approval.id
                                                                    ? "rotate-180"
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </button>

                                                        {/* DROPDOWN MENU */}
                                                        {openFrequency === approval.id && (
                                                            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5 shadow-2xl dark:border-gray-700 dark:bg-[#151515] dark:shadow-black/50">
                                                                {frequencyOptions.map((frequency) => (
                                                                    <button
                                                                        key={frequency}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handleFrequencyChange(
                                                                                approval.id,
                                                                                frequency
                                                                            );
                                                                            setOpenFrequency(null);
                                                                        }}
                                                                        className={`flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm transition-colors ${approval.frequency === frequency
                                                                            ? "bg-cyan-500/10 text-cyan-400"
                                                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#222222] dark:hover:text-white"
                                                                            }`}
                                                                    >
                                                                        {frequency}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* ACTION */}
                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-5">

                                                        {/* VIEW */}
                                                        <button
                                                            title="View approval"
                                                            onClick={(
                                                                e
                                                            ) => {
                                                                e.stopPropagation();

                                                                handleViewApproval(
                                                                    approval
                                                                );
                                                            }}
                                                            className="text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                        >
                                                            <Eye
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </button>

                                                        {/* APPROVE */}
                                                        <button
                                                            title="Approve"
                                                            disabled={
                                                                approval.status ===
                                                                "Approved"
                                                            }
                                                            onClick={(
                                                                e
                                                            ) => {
                                                                e.stopPropagation();

                                                                handleStatus(
                                                                    approval.id,
                                                                    "Approved"
                                                                );
                                                            }}
                                                            className={`transition ${approval.status ===
                                                                "Approved"
                                                                ? "cursor-not-allowed text-green-600"
                                                                : "text-cyan-400 hover:text-cyan-300"
                                                                }`}
                                                        >
                                                            <Check
                                                                size={
                                                                    20
                                                                }
                                                            />
                                                        </button>

                                                        {/* REJECT */}
                                                        <button
                                                            title="Reject"
                                                            disabled={
                                                                approval.status ===
                                                                "Rejected"
                                                            }
                                                            onClick={(
                                                                e
                                                            ) => {
                                                                e.stopPropagation();

                                                                handleStatus(
                                                                    approval.id,
                                                                    "Rejected"
                                                                );
                                                            }}
                                                            className={`transition ${approval.status ===
                                                                "Rejected"
                                                                ? "cursor-not-allowed text-yellow-600"
                                                                : "text-red-500 hover:text-red-400"
                                                                }`}
                                                        >
                                                            <X
                                                                size={
                                                                    20
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* APPROVAL DETAIL */}
            {showDetails && selectedApproval && (
                <ApprovalDetail
                    selectedApproval={
                        selectedApproval
                    }
                    onClose={() => {
                        setShowDetails(false);
                        setSelectedApproval(null);
                    }}
                    handleStatus={handleStatus}
                />
            )}
        </>
    );
};

export default ApprovalTable;