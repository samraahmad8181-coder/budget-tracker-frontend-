import { useEffect, useState } from "react";

import {
    MoreHorizontal,
    SlidersHorizontal,
    ArrowUpDown,
    Utensils,
    Scissors,
    Plane,
    BedDouble,
    Newspaper,
    BriefcaseBusiness,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";


const getCategoryIcon = (category) => {
    switch (category) {
        case "Food":
            return Utensils;

        case "Travel":
        case "Transport":
            return Plane;

        case "Accommodation":
            return BedDouble;

        case "Office Supplies":
            return Scissors;

        case "Communication":
            return Newspaper;

        default:
            return BriefcaseBusiness;
    }
};


export default function ExpenseTable() {
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Fetch expenses from PostgreSQL through API
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3000/api/expenses"
            );

            const result = await response.json();

            console.log("Expenses API:", result);

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to fetch expenses"
                );
            }

            setExpenses(result.data || []);

        } catch (error) {
            console.error("Fetch expenses error:", error);

            setError(error.message || "Failed to load expenses");

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleStatusChange = async (expense, newStatus) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/expenses/${expense.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subject: expense.subject,
                        merchant: expense.merchant,
                        expense_date: expense.expense_date,
                        amount: expense.amount,
                        currency: expense.currency,
                        reimbursable: expense.reimbursable,
                        category: expense.category,
                        description: expense.description,
                        employee: expense.employee,
                        report_name: expense.report_name,
                        status: newStatus,
                        invoice_url: expense.invoice_url,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update status"
                );
            }

            // Update table immediately
            setExpenses((prev) =>
                prev.map((item) =>
                    item.id === expense.id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
        } catch (error) {
            console.error("Update status error:", error);
            alert(error.message);
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-GB");
    };


    // Format amount
    const formatAmount = (amount, currency) => {
        const number = Number(amount);

        if (Number.isNaN(number)) {
            return `${amount} ${currency || ""}`;
        }

        return `${currency === "EUR" ? "€" : currency || ""}${number.toFixed(
            2
        )}`;
    };


    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-black p-6">
            <div className="overflow-hidden rounded-xl border border-gray-400 dark:border-[#292D33] bg-white dark:bg-[#191C20]">

                {/* Table Toolbar */}
                <div className="flex items-center justify-between border-b border-b-gray-400 dark:border-[#292D33] px-5 py-4">

                    <div>
                        <h2 className="text-2xl font-bold dark:text-white">
                            Expenses
                        </h2>
                    </div>


                    <div className="flex items-center gap-2">

                        {/* New Expense */}
                        <button
                            onClick={() =>
                                navigate("/admin/expenses/new")
                            }
                            className="rounded-lg bg-[#00D5C8] px-4 py-2 text-sm font-semibold dark:text-[#101315] transition hover:bg-[#12E4D7]"
                        >
                            + New expense
                        </button>


                        {/* Filter */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-[#353A42] dark:bg-[#1E2126] text-neutral-500 hover:bg-[#292D33] hover:text-white"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>


                        {/* Sort */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-[#353A42] dark:bg-[#1E2126] text-neutral-400 hover:bg-[#292D33] hover:text-white"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>


                        {/* More */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-[#353A42] dark:bg-[#1E2126] text-neutral-400 hover:bg-[#292D33] hover:text-white"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>

                    </div>
                </div>


                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-sm text-neutral-500">
                            Loading expenses...
                        </p>
                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-16">

                        <p className="text-sm text-red-400">
                            {error}
                        </p>

                        <button
                            onClick={fetchExpenses}
                            className="mt-4 rounded-lg bg-[#00D5C8] px-4 py-2 text-sm font-semibold dark:text-black"
                        >
                            Try again
                        </button>

                    </div>
                )}


                {/* Table */}
                {!loading && !error && (
                    <div className="overflow-x-auto">

                        <Table className="min-w-[950px]">

                            <TableHeader>

                                <TableRow className="border-b border-b-gray-400 dark:border-[#292D33] dark:bg-[#151719] bg-white text-black ">

                                    <TableHead className="w-[55px] px-5">
                                        <Checkbox className="border-[#5A5F66] data-[state=checked]:border-[#00D5C8] data-[state=checked]:bg-[rgb(0,213,200)]" />
                                    </TableHead>


                                    <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide dark:text-[#8F949B]">
                                        Details
                                    </TableHead>


                                    <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide dark:text-[#8F949B]">
                                        Merchant
                                    </TableHead>


                                    <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide dark:text-[#8F949B]">
                                        Amount
                                    </TableHead>


                                    <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide dark:text-[#8F949B]">
                                        Report
                                    </TableHead>


                                    <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide dark:text-[#8F949B]">
                                        Status
                                    </TableHead>

                                </TableRow>

                            </TableHeader>


                            <TableBody>

                                {/* No expenses */}
                                {expenses.length === 0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-sm text-neutral-500"
                                        >
                                            No expenses found.
                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    expenses.map((expense, index) => {

                                        const Icon = getCategoryIcon(
                                            expense.category
                                        );


                                        return (
                                            <TableRow
                                                key={expense.id}
                                                className={`
                                                h-[79px]
                                                border-b border-b-gray-400 dark:border-[#292D33]
                                                dark:text-white
                                                transition-colors
                                                
                                                ${index % 2 === 0
                                                        ? "dark:bg-[#1B1D20]"
                                                        : "dark:bg-[#242629]"
                                                    }
                                            `}
                                            >

                                                {/* Checkbox */}
                                                <TableCell className="px-5">

                                                    <Checkbox
                                                        className="border-[#5A5F66] data-[state=checked]:border-[#00D5C8] data-[state=checked]:bg-[#00D5C8]"
                                                    />

                                                </TableCell>


                                                {/* Details */}
                                                <TableCell>

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full dark:bg-[#073F40]">

                                                            <Icon
                                                                size={16}
                                                                strokeWidth={2}
                                                                className="text-[#00D5C8]"
                                                            />

                                                        </div>


                                                        <div className="leading-tight">

                                                            <p className="text-[10px] font-medium dark:text-[#858A91]">
                                                                {formatDate(
                                                                    expense.expense_date
                                                                )}
                                                            </p>


                                                            <p className="mt-1 text-xs font-semibold dark:text-white">
                                                                {expense.subject}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </TableCell>


                                                {/* Merchant */}
                                                <TableCell className="text-xs font-semibold dark:text-white">

                                                    {expense.merchant}

                                                </TableCell>


                                                {/* Amount */}
                                                <TableCell className="text-xs font-semibold dark:text-white">

                                                    {formatAmount(
                                                        expense.amount,
                                                        expense.currency
                                                    )}

                                                </TableCell>


                                                {/* Report */}
                                                <TableCell className="text-xs font-semibold dark:text-white">

                                                    {expense.report_name || "-"}

                                                </TableCell>


                                                {/* Status */}
                                                <TableCell>
                                                    <select
                                                        value={expense.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(expense, e.target.value)
                                                        }
                                                        className={`rounded-full border-0 px-3 py-1 text-[10px] font-semibold outline-none cursor-pointer ${expense.status === "Submitted"
                                                            ? "bg-[#6419E8] text-white"
                                                            : "bg-[#9E155F] text-white"
                                                            }`}
                                                    >
                                                        <option value="Not Submitted">
                                                            Not Submitted
                                                        </option>

                                                        <option value="Submitted">
                                                            Submitted
                                                        </option>
                                                    </select>
                                                </TableCell>

                                            </TableRow>
                                        );

                                    })

                                )}

                            </TableBody>

                        </Table>

                    </div>
                )}

            </div>
        </div>
    );
}