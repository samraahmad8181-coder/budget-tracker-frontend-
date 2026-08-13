import React from "react";
import { X } from "lucide-react";

const ApprovalDetail = ({
    selectedApproval,
    onClose,
    handleStatus,
}) => {
    if (!selectedApproval) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm dark:bg-black/80"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[585px] rounded-xl border border-gray-200 bg-white p-8 text-gray-900 shadow-2xl dark:border-[#353A42] dark:bg-[#292929] dark:text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-2xl text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* HEADER */}
                <div className="mb-8 flex items-center gap-5">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Expense Request
                    </h2>

                    <span
                        className={`rounded-full px-6 py-2 text-xs font-semibold ${selectedApproval.status === "Approved"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100"
                                : selectedApproval.status === "Rejected"
                                    ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                                    : "bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-100"
                            }`}
                    >
                        {selectedApproval.status}
                    </span>
                </div>

                {/* DETAILS */}
                <div className="space-y-5">

                    {/* OWNER */}
                    <div className="flex items-center justify-between gap-6">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                            Owner
                        </span>

                        <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedApproval.name}
                        </span>
                    </div>

                    {/* AMOUNT */}
                    <div className="flex items-start justify-between gap-6">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                            Amount
                        </span>

                        <span className="font-semibold text-gray-900 dark:text-white">
                            €
                            {Number(
                                selectedApproval.amount
                            ).toFixed(2)}
                        </span>
                    </div>

                    {/* CATEGORY */}
                    <div className="flex items-center justify-between gap-6">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                            Category
                        </span>

                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-purple-500" />

                            <span className="font-semibold text-gray-900 dark:text-white">
                                {selectedApproval.category}
                            </span>
                        </div>
                    </div>

                    {/* FREQUENCY */}
                    <div className="flex items-center justify-between gap-6">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                            Frequency
                        </span>

                        <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedApproval.frequency}
                        </span>
                    </div>

                    {/* SOURCE */}
                    <div className="flex items-center justify-between gap-6">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                            Source
                        </span>

                        <span className="capitalize font-semibold text-gray-900 dark:text-white">
                            {selectedApproval.source_type}
                        </span>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-8 flex justify-center gap-5">

                    {/* APPROVE */}
                    <button
                        disabled={
                            selectedApproval.status === "Approved"
                        }
                        onClick={() =>
                            handleStatus(
                                selectedApproval.id,
                                "Approved"
                            )
                        }
                        className={`rounded-lg px-9 py-3 font-semibold transition ${selectedApproval.status === "Approved"
                                ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-400"
                                : "bg-gray-200 text-cyan-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-cyan-400 dark:hover:bg-gray-600"
                            }`}
                    >
                        Approve
                    </button>

                    {/* DECLINE */}
                    <button
                        disabled={
                            selectedApproval.status === "Rejected"
                        }
                        onClick={() =>
                            handleStatus(
                                selectedApproval.id,
                                "Rejected"
                            )
                        }
                        className={`rounded-lg px-9 py-3 font-semibold transition ${selectedApproval.status === "Rejected"
                                ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-400"
                                : "bg-cyan-500 text-white hover:bg-cyan-400 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300"
                            }`}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalDetail;