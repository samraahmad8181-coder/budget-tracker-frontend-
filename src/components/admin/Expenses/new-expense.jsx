import { useRef, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    Upload,
    X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;

export default function NewExpense() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        subject: "",
        merchant: "",
        expense_date: "",
        amount: "",
        currency: "EUR",
        reimbursable: false,
        category: "",
        description: "",
        name: "",
        report_name: "",
        status: "Not Submitted",
        invoice_url: null,
    });

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleInvoiceChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setInvoice(file);

        setFormData((prev) => ({
            ...prev,
            invoice_url: file.name,
        }));
    };

    const removeInvoice = () => {
        setInvoice(null);

        setFormData((prev) => ({
            ...prev,
            invoice_url: null,
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create expense"
                );
            }

            console.log("Expense created:", data);

            navigate("/admin/expenses");
        } catch (error) {
            console.error("Create expense error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white text-black dark:bg-black p-6">
            <div className="min-h-screen  px-4 py-6 dark:text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4 border-b border-[#353A42] pb-6">


                        <div>
                            <h1 className="text-3xl font-bold dark:text-white">
                                New Expense
                            </h1>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                            {/* LEFT SIDE */}
                            <div className="space-y-6 lg:col-span-2">

                                {/* Expense Information */}
                                <section className="rounded-xl border border-[#353A42] dark:bg-[#191C20]">
                                    <div className="border-b border-[#353A42] px-6 py-5">
                                        <h2 className="text-sm font-semibold dark:text-white">
                                            Expense information
                                        </h2>

                                        <p className="mt-1 text-xs text-neutral-500">
                                            Enter the details of your expense
                                        </p>
                                    </div>

                                    <div className="space-y-5 p-6">

                                        {/* Subject */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-neutral-500">
                                                Subject
                                            </label>

                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="e.g. Office supplies"
                                                required
                                                className="h-11 w-full rounded-lg border border-[#353A42] dark:bg-[#1E2126] px-3 text-sm dark:text-white outline-none placeholder:text-neutral-600 transition focus:border-[#00D5C8]"
                                            />
                                        </div>

                                        {/* Merchant */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-neutral-500">
                                                Merchant
                                            </label>

                                            <input
                                                type="text"
                                                name="merchant"
                                                value={formData.merchant}
                                                onChange={handleChange}
                                                placeholder="e.g. Officio"
                                                required
                                                className="h-11 w-full rounded-lg border border-[#353A42] dark:bg-[#1E2126] px-3 text-sm dark:text-white outline-none placeholder:text-neutral-600 transition focus:border-[#00D5C8]"
                                            />
                                        </div>

                                        {/* Date + Amount */}
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-neutral-500">
                                                    Date
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        name="expense_date"
                                                        value={formData.expense_date}
                                                        onChange={handleChange}
                                                        required
                                                        className="h-11 w-full rounded-lg border border-[#353A42] dark:bg-[#1E2126] px-3 pr-10 text-sm dark:text-white outline-none transition focus:border-[#00D5C8]"
                                                    />

                                                    <CalendarDays
                                                        size={17}
                                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-neutral-500">
                                                    Total
                                                </label>

                                                <div className="flex h-11 overflow-hidden rounded-lg border border-[#353A42] dark:bg-[#1E2126] focus-within:border-[#00D5C8]">

                                                    <input
                                                        type="number"
                                                        name="amount"
                                                        value={formData.amount}
                                                        onChange={handleChange}
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                        className="min-w-0 flex-1 bg-transparent px-3 text-sm dark:text-white outline-none placeholder:text-neutral-600"
                                                    />

                                                    <div className="flex items-center border-l border-[#353A42] px-3 text-sm text-neutral-400">
                                                        EUR
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Reimbursable */}
                                        <label className="flex cursor-pointer items-center gap-3">
                                            <input
                                                type="checkbox"
                                                name="reimbursable"
                                                checked={formData.reimbursable}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-[#4B5058] dark:bg-[#1E2126] accent-[#00D5C8]"
                                            />

                                            <span className="text-sm text-neutral-300">
                                                Reimbursable
                                            </span>
                                        </label>

                                        {/* Category */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                                Category
                                            </label>

                                            <div className="relative">
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-11 w-full appearance-none rounded-lg border border-[#353A42] dark:bg-[#1E2126] px-3 pr-10 text-sm text-white outline-none transition focus:border-[#00D5C8]"
                                                >
                                                    <option value="">
                                                        Select category
                                                    </option>
                                                    <option value="Office Supplies">
                                                        Office Supplies
                                                    </option>
                                                    <option value="Travel">
                                                        Travel
                                                    </option>
                                                    <option value="Food">
                                                        Food
                                                    </option>
                                                    <option value="Accommodation">
                                                        Accommodation
                                                    </option>
                                                    <option value="Transport">
                                                        Transport
                                                    </option>
                                                    <option value="Communication">
                                                        Communication
                                                    </option>
                                                    <option value="Other">
                                                        Other
                                                    </option>
                                                </select>

                                                <ChevronDown
                                                    size={17}
                                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                                Description
                                            </label>

                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Add a description..."
                                                rows={4}
                                                className="w-full resize-none rounded-lg border border-[#353A42] dark:bg-[#1E2126] px-3 py-3 text-sm text-white outline-none placeholder:text-neutral-600 transition focus:border-[#00D5C8]"
                                            />
                                        </div>

                                    </div>
                                </section>

                                {/* Assignment */}
                                <section className="rounded-xl border border-[#353A42] dark:bg-[#191C20]">

                                    <div className="border-b border-[#353A42] px-6 py-5">
                                        <h2 className="text-sm font-semibold dark:text-white">
                                            Assignment
                                        </h2>

                                        <p className="mt-1 text-xs text-neutral-500">
                                            Assign this expense to an employee or report
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                                        {/* Employee */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                                Employee
                                            </label>

                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. John Smith"
                                                required
                                                className="h-11 w-full rounded-lg border border-[#353A42] dark:bg-[#1E2126] px-3 text-sm dark:text-white outline-none placeholder:text-neutral-600 transition focus:border-[#00D5C8]"
                                            />
                                        </div>

                                        {/* Report */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                                Add to report
                                            </label>

                                            <input
                                                type="text"
                                                name="report_name"
                                                value={formData.report_name}
                                                onChange={handleChange}
                                                placeholder="e.g. August Expenses"
                                                className="h-11 w-full rounded-lg border border-[#353A42] dark:bg-[#1E2126] px-3 text-sm dark:text-white outline-none placeholder:text-neutral-600 transition focus:border-[#00D5C8]"
                                            />
                                        </div>

                                    </div>
                                </section>

                            </div>

                            {/* RIGHT SIDE */}
                            <div className="space-y-6">

                                {/* Invoice */}
                                <section className="rounded-xl border border-[#353A42] dark:bg-[#191C20]">

                                    <div className="border-b border-[#353A42] px-6 py-5">
                                        <h2 className="text-sm font-semibold dark:text-white">
                                            Invoice
                                        </h2>

                                        <p className="mt-1 text-xs text-neutral-500">
                                            Upload an invoice or receipt
                                        </p>
                                    </div>

                                    <div className="p-6">

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={handleInvoiceChange}
                                            className="hidden"
                                        />

                                        {!invoice ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#454B55] dark:bg-[#1E2126] px-5 py-10 text-center transition hover:border-[#00D5C8] hover:bg-[#20252A]"
                                            >
                                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full dark:bg-[#272C32]">
                                                    <Upload
                                                        size={18}
                                                        className="text-[#00D5C8]"
                                                    />
                                                </div>

                                                <p className="text-sm font-medium text-white">
                                                    Upload an invoice
                                                </p>

                                                <p className="mt-1 text-xs text-neutral-500">
                                                    PDF, JPG or PNG
                                                </p>
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-between rounded-lg border border-[#353A42] dark:bg-[#1E2126] p-3">

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium dark:text-white">
                                                        {invoice.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-neutral-500">
                                                        {(invoice.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={removeInvoice}
                                                    className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-500 transition hover:bg-[#292D33] hover:text-white"
                                                >
                                                    <X size={17} />
                                                </button>

                                            </div>
                                        )}

                                    </div>
                                </section>

                                {/* Summary */}
                                <section className="rounded-xl border border-[#353A42] dark:bg-[#191C20] p-6">

                                    <h2 className="text-sm font-semibold dark:text-white">
                                        Expense summary
                                    </h2>

                                    <div className="mt-5 space-y-3">

                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500">
                                                Amount
                                            </span>

                                            <span className="font-medium dark:text-white">
                                                {formData.amount || "0.00"}{" "}
                                                {formData.currency}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500">
                                                Status
                                            </span>

                                            <span className="rounded-full border border-[#353A42] px-2.5 py-1 text-xs text-neutral-300">
                                                Not Submitted
                                            </span>
                                        </div>

                                    </div>

                                </section>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#353A42] pt-6 sm:flex-row sm:justify-end">

                            <Link
                                to="/admin/expenses"
                                className="flex h-11 items-center justify-center rounded-lg border border-[#353A42] px-6 text-sm font-medium text-neutral-300 transition hover:bg-[#292D33] hover:text-white"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 rounded-lg bg-[#00D5C8] px-7 text-sm font-semibold dark:text-[#101315] transition hover:bg-[#12E4D7] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save expense"}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}