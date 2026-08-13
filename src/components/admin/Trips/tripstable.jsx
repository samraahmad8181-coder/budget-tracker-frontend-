import { useEffect, useState } from "react";

import {
    MoreHorizontal,
    SlidersHorizontal,
    ArrowUpDown,
    Plane,
    MapPin,
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

export default function TripsTable() {
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch trips
    const fetchTrips = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/api/trips"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch trips"
                );
            }

            setTrips(data.data || []);
        } catch (error) {
            console.error("Fetch trips error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    // Change status
    const handleStatusChange = async (id, status) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/trips/${id}/status`,
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
                    data.message || "Failed to update status"
                );
            }

            // Update table immediately
            setTrips((prevTrips) =>
                prevTrips.map((trip) =>
                    trip.id === id
                        ? {
                            ...trip,
                            status: data.data.status,
                        }
                        : trip
                )
            );
        } catch (error) {
            console.error("Status update error:", error);
            alert(error.message);
        }
    };

    const getStatusClass = (status) => {
        if (status === "Approved") {
            return "bg-[#6419E8] text-white hover:bg-[#6419E8]";
        }

        if (status === "Not Approved") {
            return "bg-[#B51D3A] text-white hover:bg-[#B51D3A]";
        }

        return "bg-[#9E155F] text-white hover:bg-[#9E155F]";
    };

    const getIcon = (tripType) => {
        if (
            tripType?.toLowerCase().includes("business") ||
            tripType?.toLowerCase().includes("client")
        ) {
            return BriefcaseBusiness;
        }

        return Plane;
    };

    return (
        <div className="min-h-screen w-full bg-white dark:bg-black p-6">
            <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-[#101010] border border-gray-400 dark:border-transparent">

                {/* Toolbar */}

                <div className="flex items-center justify-between border-b border-gray-400 dark:border-[#292D33] px-5 py-4">

                    <div>
                        <h2 className="text-2xl font-bold text-black dark:text-white">
                            Trips
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() =>
                                navigate("/admin/trips/new")
                            }
                            className="rounded-lg bg-[#00D5C8] px-4 py-2 text-sm font-semibold text-[#101315] hover:bg-[#12E4D7]"
                        >
                            + New trip
                        </button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-400 bg-gray-100 text-neutral-600 hover:bg-gray-200 hover:text-black dark:border-[#353A42] dark:bg-[#1E2126] dark:text-neutral-400 dark:hover:bg-[#292D33] dark:hover:text-white"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-400 bg-gray-100 text-neutral-600 hover:bg-gray-200 hover:text-black dark:border-[#353A42] dark:bg-[#1E2126] dark:text-neutral-400 dark:hover:bg-[#292D33] dark:hover:text-white"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-400 bg-gray-100 text-neutral-600 hover:bg-gray-200 hover:text-black dark:border-[#353A42] dark:bg-[#1E2126] dark:text-neutral-400 dark:hover:bg-[#292D33] dark:hover:text-white"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>

                    </div>
                </div>

                {/* Table */}

                <div className="overflow-x-auto">

                    <Table className="min-w-[950px]">

                        <TableHeader>

                            <TableRow className="border-b border-gray-400 dark:border-[#292D33] bg-gray-50 dark:bg-[#151719] hover:bg-gray-50 dark:hover:bg-[#151719]">

                                <TableHead className="w-[55px] px-5">
                                    <Checkbox className="border-gray-400 data-[state=checked]:border-[#00D5C8] data-[state=checked]:bg-[#00D5C8] dark:border-[#5A5F66]" />
                                </TableHead>

                                <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#8F949B]">
                                    Details
                                </TableHead>

                                <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#8F949B]">
                                    Trip
                                </TableHead>

                                <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#8F949B]">
                                    Amount
                                </TableHead>

                                <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#8F949B]">
                                    Report
                                </TableHead>

                                <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#8F949B]">
                                    Status
                                </TableHead>

                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-32 text-center text-sm text-neutral-500"
                                    >
                                        Loading trips...
                                    </TableCell>
                                </TableRow>
                            ) : trips.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-32 text-center text-sm text-neutral-500"
                                    >
                                        No trips found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                trips.map((trip, index) => {

                                    const Icon = getIcon(
                                        trip.category
                                    );

                                    return (
                                        <TableRow
                                            key={trip.id}
                                            onClick={() => navigate(`/admin/trips/${trip.id}`)}
                                            className={`
    h-[79px]
    cursor-pointer
    border-b border-gray-400 dark:border-[#292D33]
    text-black dark:text-white
    transition-colors
    hover:bg-gray-100 dark:hover:bg-[#25282D]
    ${index % 2 === 0
                                                    ? "bg-white dark:bg-[#1B1D20]"
                                                    : "bg-gray-50 dark:bg-[#242629]"
                                                }
`}
                                        >

                                            {/* Checkbox */}

                                            <TableCell
                                                className="px-5"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Checkbox
                                                    className="border-gray-400 data-[state=checked]:border-[#00D5C8] data-[state=checked]:bg-[#00D5C8] dark:border-[#5A5F66]"
                                                />
                                            </TableCell>

                                            {/* Details */}

                                            <TableCell>

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-[#25205B]">

                                                        <Icon
                                                            size={16}
                                                            className="text-indigo-600 dark:text-[#8C7CFF]"
                                                        />

                                                    </div>

                                                    <div className="leading-tight">

                                                        <p className="text-[10px] font-medium text-gray-500 dark:text-[#858A91]">

                                                            {new Date(
                                                                trip.start_date
                                                            ).toLocaleDateString(
                                                                "en-GB"
                                                            )}

                                                        </p>

                                                        <p className="mt-1 text-xs font-semibold text-black dark:text-white">

                                                            {trip.destination}

                                                        </p>

                                                    </div>

                                                </div>

                                            </TableCell>

                                            {/* Trip type */}

                                            <TableCell className="text-xs font-semibold text-black dark:text-white">

                                                {trip.category}

                                            </TableCell>

                                            {/* Amount */}

                                            <TableCell className="text-xs font-semibold text-black dark:text-white">
                                                {trip.currency}{" "}
                                                {trip.amount !== null &&
                                                    trip.amount !== undefined
                                                    ? Number(trip.amount).toFixed(2)
                                                    : "0.00"}
                                            </TableCell>

                                            {/* Report */}

                                            <TableCell className="text-xs font-semibold text-black dark:text-white">

                                                {trip.report_name || "-"}

                                            </TableCell>

                                            {/* Status */}

                                            <TableCell
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <select
                                                    value={trip.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            trip.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`
                                                cursor-pointer
                                                rounded-full
                                                border-0
                                                px-3
                                                py-1
                                                text-[10px]
                                                font-semibold
                                                outline-none
                                                ${getStatusClass(
                                                        trip.status
                                                    )}
                                            `}
                                                >

                                                    <option value="Pending">
                                                        Pending
                                                    </option>

                                                    <option value="Approved">
                                                        Approved
                                                    </option>

                                                    <option value="Not Approved">
                                                        Not Approved
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

            </div>
        </div>
    );
}