import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditTripForm from "./editTripForm";
import {
    ArrowLeft,
    MoreHorizontal,
    X,
    Plane,
    Hotel,
    Car,
    Plus,
} from "lucide-react";

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchTrip = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:3000/api/trips/${id}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch trip"
                );
            }

            setTrip(data.data);

        } catch (error) {
            console.error("Fetch trip error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrip();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#1E2126] text-black dark:text-white">
                Loading trip...
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#1E2126] text-black dark:text-white">
                <p className="text-gray-500 dark:text-neutral-400">
                    Trip not found.
                </p>

                <button
                    onClick={() => navigate("/admin/trips")}
                    className="mt-4 rounded-lg bg-[#00D5C8] px-4 py-2 text-sm font-semibold text-black"
                >
                    Back to Trips
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#1E2126] text-black dark:text-white">
                Loading trip...
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#1E2126] text-black dark:text-white">
                <p className="text-gray-500 dark:text-neutral-400">
                    Trip not found.
                </p>

                <button
                    onClick={() => navigate("/admin/trips")}
                    className="mt-4 rounded-lg bg-[#00D5C8] px-4 py-2 text-sm font-semibold text-black"
                >
                    Back to Trips
                </button>
            </div>
        );
    }

    // ⭐ ADD THIS
    if (isEditing) {
        return (
            <EditTripForm
                trip={trip}
                onCancel={() => setIsEditing(false)}
                onSaved={(updatedTrip) => {
                    setTrip(updatedTrip);
                    setIsEditing(false);
                }}
            />
        );
    }


    return (

        <div className="min-h-screen bg-white dark:bg-[#101010] px-6 py-6 text-black dark:text-white">

            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-400 dark:border-[#353A42] pb-5">

                    <div className="flex items-center gap-4">

                        <div>

                            <div className="flex items-center gap-4">

                                <h1 className="text-3xl font-bold">
                                    Trips - {trip.destination}
                                </h1>

                                <span className="rounded-full bg-[#9E155F] px-3 py-1 text-xs font-semibold text-white">
                                    {trip.status}
                                </span>

                            </div>

                            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                                {new Date(
                                    trip.start_date
                                ).toLocaleDateString("en-GB")}{" "}
                                -{" "}
                                {new Date(
                                    trip.end_date
                                ).toLocaleDateString("en-GB")}
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => setIsEditing(true)}
                            className="rounded-lg bg-[#00D5C8] px-5 py-2 text-sm font-semibold text-black hover:bg-[#12E4D7]"
                        >
                            Edit
                        </button>

                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-400 dark:border-[#353A42] text-cyan-600 dark:text-cyan-500 hover:bg-gray-100 dark:hover:bg-[#292D33]"
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        <button
                            onClick={() =>
                                navigate("/admin/trips")
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-400 dark:border-[#353A42] text-cyan-600 dark:text-cyan-500 hover:bg-gray-100 dark:hover:bg-[#292D33]"
                        >
                            <X size={18} />
                        </button>

                    </div>

                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_250px]">

                    {/* Left */}
                    <div className="space-y-5">

                        {/* Flight */}
                        <section className="rounded-xl border border-gray-400 dark:border-[#353A42] bg-gray-50 dark:bg-[#191C20]">

                            <div className="flex items-center gap-3 rounded-t-xl bg-gray-100 dark:bg-[#292B2E] px-5 py-3">

                                <Plane
                                    size={17}
                                    className="text-gray-500 dark:text-neutral-300"
                                />

                                <span className="text-sm font-medium">
                                    Flight
                                </span>

                            </div>

                            <div className="p-5">

                                <div className="grid grid-cols-3 gap-4 rounded-lg border border-gray-400 dark:border-[#353A42] p-5">

                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            Departure
                                        </p>

                                        <p className="mt-2 text-sm font-semibold">
                                            {trip.start_date}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            Destination
                                        </p>

                                        <p className="mt-2 text-sm font-semibold">
                                            {trip.destination}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            Trip Type
                                        </p>

                                        <p className="mt-2 text-sm font-semibold">
                                            {trip.category}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* Hotel */}
                        <section className="rounded-xl border border-gray-400 dark:border-[#353A42] bg-gray-50 dark:bg-[#191C20]">

                            <div className="flex items-center gap-3 rounded-t-xl bg-gray-100 dark:bg-[#292B2E] px-5 py-3">

                                <Hotel
                                    size={17}
                                    className="text-gray-500 dark:text-neutral-300"
                                />

                                <span className="text-sm font-medium">
                                    Hotel
                                </span>

                            </div>

                            <div className="p-5">

                                <div className="rounded-lg border border-gray-400 dark:border-[#353A42] p-5">

                                    <p className="text-sm font-semibold">
                                        {trip.hotel || "No hotel added"}
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* Transfer */}
                        <section className="rounded-xl border border-gray-400 dark:border-[#353A42] bg-gray-50 dark:bg-[#191C20]">

                            <div className="flex items-center gap-3 rounded-t-xl bg-gray-100 dark:bg-[#292B2E] px-5 py-3">

                                <Car
                                    size={17}
                                    className="text-gray-500 dark:text-neutral-300"
                                />

                                <span className="text-sm font-medium">
                                    Transfer
                                </span>

                            </div>

                            <div className="p-5">

                                <div className="rounded-lg border border-gray-400 dark:border-[#353A42] p-5">

                                    <p className="text-sm font-semibold">
                                        {trip.transfer_details ||
                                            "No transfer added"}
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* Add section */}
                        <button className="flex w-full items-center gap-2 rounded-lg bg-gray-100 dark:bg-[#292B2E] px-5 py-3 text-sm text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-[#34373B]">
                            <Plus size={16} />
                            Add section
                        </button>

                    </div>

                    {/* Right Sidebar */}
                    <aside className="rounded-xl bg-gray-50 dark:bg-[#191C20] border border-gray-400 dark:border-transparent p-5">

                        <div className="space-y-5">

                            {/* <div>
                                <p className="text-xs text-neutral-500">
                                    Employee
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {trip.employee || "-"}
                                </p>
                            </div> */}

                            <div>
                                <p className="text-xs text-gray-500 dark:text-neutral-500">
                                    Trip type
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {trip.category}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 dark:text-neutral-500">
                                    Report
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {trip.report_name || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 dark:text-neutral-500">
                                    Spending budget
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {trip.currency}{" "}
                                    {Number(trip.amount || 0).toFixed(2)}
                                </p>
                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}