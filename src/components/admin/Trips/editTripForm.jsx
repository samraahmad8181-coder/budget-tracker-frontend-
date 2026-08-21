import { useState } from "react";
import { X } from "lucide-react";
const API_URL = `${import.meta.env.VITE_API_URL}/trips`;
export default function EditTripForm({
    trip,
    onCancel,
    onSaved,
}) {
    const [formData, setFormData] = useState({
        name: trip.name || "",
        category: trip.category || "International",
        purpose: trip.purpose || "",
        flight_type: trip.flight_type || "Roundtrip",
        depart_form: trip.depart_form || "",
        destination: trip.destination || "",
        start_date: trip.start_date
            ? trip.start_date.split("T")[0]
            : "",
        end_date: trip.end_date
            ? trip.end_date.split("T")[0]
            : "",
        amount: trip.amount || "",
        check_in: trip.check_in
            ? trip.check_in.split("T")[0]
            : "",
        check_out: trip.check_out
            ? trip.check_out.split("T")[0]
            : "",
        hotel: trip.hotel || "",
        currency: trip.currency || "EUR",
        report_name: trip.report_name || "",
        status: trip.status || "Pending",
        approved_by: trip.approved_by || "",
        policy: trip.policy || "",
        travel_documents: trip.travel_documents || "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/${trip.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update trip"
                );
            }

            alert("Trip updated successfully");

            // Send updated trip back to TripDetails
            onSaved(data.data);

        } catch (error) {
            console.error("Update trip error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#1E2126] px-6 py-6 text-black dark:text-white">

            <div className="mx-auto max-w-7xl rounded-xl bg-white dark:bg-[#101010] border border-gray-400 dark:border-transparent p-6">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-gray-400 dark:border-[#353A42] pb-4">

                    <h1 className="text-xl font-semibold">
                        Edit Trip
                    </h1>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-400 dark:border-[#353A42] text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#292D33] hover:text-black dark:hover:text-white"
                    >
                        <X size={16} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6"
                >

                    {/* NAME */}

                    <div className="grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Name*
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="h-10 w-[300px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                        />

                    </div>

                    {/* TYPE */}

                    <div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Type*
                        </label>

                        <div className="flex gap-6">

                            <label className="flex items-center gap-2 text-xs">
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

                            <label className="flex items-center gap-2 text-xs">
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

                    <div className="mt-5 grid grid-cols-[120px_1fr] items-start gap-5">

                        <label className="pt-2 text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Purpose
                        </label>

                        <textarea
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            rows={3}
                            className="w-[300px] resize-none rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 py-2 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                        />

                    </div>

                    {/* REPORT */}

                    <div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Report
                        </label>

                        <input
                            type="text"
                            name="report_name"
                            value={formData.report_name}
                            onChange={handleChange}
                            placeholder="e.g. November_2022"
                            className="h-10 w-[300px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8] placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                        />

                    </div>

                    {/* ITINERARY */}

                    <div className="mt-8">
                        <h2 className="border-b border-gray-400 dark:border-[#292D33] pb-3 text-sm font-bold">
                            ITINERARY
                        </h2>
                    </div>

                    {/* FLIGHT TYPE */}

                    <div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Flight
                        </label>

                        <div className="flex gap-6">

                            <label className="flex items-center gap-2 text-xs">
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

                            <label className="flex items-center gap-2 text-xs">
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

                    <div className="mt-4 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Depart from*
                        </label>

                        <div className="flex gap-4">

                            <input
                                type="text"
                                name="depart_form"
                                value={formData.depart_form}
                                onChange={handleChange}
                                required
                                className="h-10 w-[250px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                            />

                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="h-10 w-[140px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white"
                            />

                        </div>

                    </div>

                    {/* DESTINATION */}

                    <div className="mt-4 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Destination*
                        </label>

                        <div className="flex gap-4">

                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                                className="h-10 w-[250px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                            />

                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                className="h-10 w-[140px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white"
                            />

                        </div>

                    </div>

                    {/* BUDGET */}

                    <div className="mt-4 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Budget limit
                        </label>

                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="h-10 w-[300px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                        />

                    </div>

                    {/* ACCOMMODATION */}

                    <div className="mt-8">
                        <h2 className="border-b border-gray-400 dark:border-[#292D33] pb-3 text-sm font-bold">
                            ACCOMMODATION
                        </h2>
                    </div>

                    <div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Check-in
                        </label>

                        <div className="flex gap-4">

                            <input
                                type="date"
                                name="check_in"
                                value={formData.check_in}
                                onChange={handleChange}
                                className="h-10 w-[140px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white"
                            />

                            <span className="flex items-center text-xs text-gray-500 dark:text-[#A7ABB1]">
                                Check-out
                            </span>

                            <input
                                type="date"
                                name="check_out"
                                value={formData.check_out}
                                onChange={handleChange}
                                className="h-10 w-[140px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-2 text-xs text-black dark:text-white"
                            />

                        </div>

                    </div>

                    {/* HOTEL */}

                    <div className="mt-4 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Hotel
                        </label>

                        <input
                            type="text"
                            name="hotel"
                            value={formData.hotel}
                            onChange={handleChange}
                            className="h-10 w-[300px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                        />

                    </div>

                    {/* CURRENCY */}

                    <div className="mt-4 grid grid-cols-[120px_1fr] items-center gap-5">

                        <label className="text-xs font-medium text-gray-500 dark:text-[#A7ABB1]">
                            Currency
                        </label>

                        <input
                            type="text"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="h-10 w-[300px] rounded-md bg-gray-100 dark:bg-[#3A3A3A] px-3 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-[#00D5C8]"
                        />

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-8 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-lg bg-gray-200 dark:bg-[#292D33] px-5 py-2 text-xs font-semibold text-black dark:text-white hover:bg-gray-300 dark:hover:bg-[#353A42]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-[#00D5C8] px-5 py-2 text-xs font-semibold text-[#101315] hover:bg-[#12E4D7]"
                        >
                            {loading ? "Updating..." : "Update Trip"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}