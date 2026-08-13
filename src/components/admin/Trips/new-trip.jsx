import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewTrip() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        category: "International",
        purpose: "",
        report_name: "",

        flight_type: "Roundtrip",
        depart_from: "",
        destination: "",
        start_date: "",
        end_date: "",

        amount: "",

        currency: "EUR",

        check_in: "",
        check_out: "",
        hotel: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e, isDraft = false) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/api/trips",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,

                        // Convert amount to number
                        amount:
                            formData.amount === ""
                                ? null
                                : Number(formData.amount),

                        status: isDraft ? "Draft" : "Pending",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create trip"
                );
            }

            alert(
                isDraft
                    ? "Trip saved as draft"
                    : "Trip created successfully"
            );

            navigate("/admin/trips");

        } catch (error) {
            console.error("Create trip error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="w-full rounded-xl bg-white dark:bg-[#101010] p-6 border border-gray-400 dark:border-transparent">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-400 dark:border-[#292D33] pb-4">

                <h1 className="text-xl font-semibold text-black dark:text-white">
                    New Trip
                </h1>

                <button
                    type="button"
                    onClick={() => navigate("/admin/trips")}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-400 dark:border-[#353A42] text-cyan-600 hover:bg-gray-100 dark:hover:bg-[#292D33] hover:text-black dark:hover:text-white"
                >
                    <X size={15} />
                </button>

            </div>

            <form
                onSubmit={(e) => handleSubmit(e, false)}
                className="mt-5"
            >

                {/* NAME */}

                <div className="grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Name*
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-10 w-[270px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                    />

                </div>

                {/* CATEGORY */}

                <div className="mt-5 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Category*
                    </label>

                    <div className="flex gap-6">

                        <label className="flex items-center gap-2 text-xs text-black dark:text-white">
                            <input
                                type="radio"
                                name="category"
                                value="Domestic"
                                checked={
                                    formData.category === "Domestic"
                                }
                                onChange={handleChange}
                                className="accent-[#00D5C8]"
                            />
                            Domestic
                        </label>

                        <label className="flex items-center gap-2 text-xs text-black dark:text-white">
                            <input
                                type="radio"
                                name="category"
                                value="International"
                                checked={
                                    formData.category === "International"
                                }
                                onChange={handleChange}
                                className="accent-[#00D5C8]"
                            />
                            International
                        </label>

                    </div>

                </div>

                {/* PURPOSE */}

                <div className="mt-5 grid grid-cols-[100px_1fr] items-start gap-5">

                    <label className="pt-2 text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Purpose
                    </label>

                    <textarea
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        rows={3}
                        className="w-[270px] resize-none rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 py-2 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                    />

                </div>

                {/* REPORT */}

                <div className="mt-5 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Report
                    </label>

                    <input
                        type="text"
                        name="report_name"
                        value={formData.report_name}
                        onChange={handleChange}
                        placeholder="e.g. November_2022"
                        className="h-10 w-[270px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8] placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    />

                </div>

                {/* ITINERARY */}

                <div className="mt-8">

                    <h2 className="border-b border-gray-400 dark:border-[#292D33] pb-3 text-sm font-bold text-black dark:text-white">
                        ITINERARY
                    </h2>

                </div>

                {/* FLIGHT */}

                <div className="mt-5 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        FLIGHT
                    </label>

                    <div className="flex gap-6">

                        <label className="flex items-center gap-2 text-xs text-black dark:text-white">

                            <input
                                type="radio"
                                name="flight_type"
                                value="One-way"
                                checked={
                                    formData.flight_type === "One-way"
                                }
                                onChange={handleChange}
                                className="accent-[#00D5C8]"
                            />

                            One-way

                        </label>

                        <label className="flex items-center gap-2 text-xs text-black dark:text-white">

                            <input
                                type="radio"
                                name="flight_type"
                                value="Roundtrip"
                                checked={
                                    formData.flight_type === "Roundtrip"
                                }
                                onChange={handleChange}
                                className="accent-[#00D5C8]"
                            />

                            Roundtrip

                        </label>

                    </div>

                </div>

                {/* DEPART FROM */}

                <div className="mt-4 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Depart from*
                    </label>

                    <div className="flex gap-5">

                        <input
                            type="text"
                            name="depart_from"
                            value={formData.depart_from}
                            onChange={handleChange}
                            required
                            placeholder="City / Airport"
                            className="h-10 w-[270px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8] placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                        />

                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                            className="h-10 w-[105px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white outline-none"
                        />

                    </div>

                </div>

                {/* DESTINATION */}

                <div className="mt-4 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Destination*
                    </label>

                    <div className="flex gap-5">

                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                            placeholder="City / Airport"
                            className="h-10 w-[270px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8] placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                        />

                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                            className="h-10 w-[105px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white outline-none"
                        />

                    </div>

                </div>

                {/* AMOUNT */}

                <div className="mt-4 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Amount*
                    </label>

                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="h-10 w-[270px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8] placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    />

                </div>

                {/* CURRENCY */}

                <div className="mt-4 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Currency
                    </label>

                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="h-10 w-[270px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                    >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="PKR">PKR</option>
                    </select>

                </div>

                {/* ACCOMMODATION */}

                <div className="mt-8">

                    <h2 className="border-b border-gray-400 dark:border-[#292D33] pb-3 text-sm font-bold text-black dark:text-white">
                        ACCOMMODATION
                    </h2>

                </div>

                {/* CHECK IN / CHECK OUT */}

                <div className="mt-5 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Check-in
                    </label>

                    <div className="flex gap-4">

                        <input
                            type="date"
                            name="check_in"
                            value={formData.check_in}
                            onChange={handleChange}
                            className="h-10 w-[150px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white outline-none"
                        />

                        <label className="flex items-center text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Check-out
                        </label>

                        <input
                            type="date"
                            name="check_out"
                            value={formData.check_out}
                            onChange={handleChange}
                            className="h-10 w-[150px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white outline-none"
                        />

                    </div>

                </div>

                {/* HOTEL */}

                <div className="mt-4 grid grid-cols-[100px_1fr] items-center gap-5">

                    <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                        Hotel
                    </label>

                    <input
                        type="text"
                        name="hotel"
                        value={formData.hotel}
                        onChange={handleChange}
                        placeholder="Hotel name"
                        className="h-10 w-[270px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8] placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    />

                </div>

                {/* BUTTONS */}

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        disabled={loading}
                        onClick={(e) => handleSubmit(e, true)}
                        className="rounded-lg bg-[#00D5C8] px-5 py-2 text-xs font-semibold text-[#101315] hover:bg-[#12E4D7] disabled:opacity-50"
                    >
                        Save draft
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-gray-200 dark:bg-[#25282D] px-5 py-2 text-xs font-semibold text-black dark:text-white hover:bg-gray-300 dark:hover:bg-[#353A42] disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                </div>

            </form>

        </div>
    );
}