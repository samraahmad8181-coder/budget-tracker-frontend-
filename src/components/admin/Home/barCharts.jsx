import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function MonthlyReport({ dashboard }) {
    const charts = [
        {
            title: "Team Spending Trend",
            color: "#2DD4BF",
            data:
                dashboard?.charts?.teamSpending?.map((item) => ({
                    name: item.name,
                    amount: Number(item.total),
                })) ?? [],
        },
        {
            title: "Day-to-Day Expenses",
            color: "#8B5CF6",
            data:
                dashboard?.charts?.categorySpending?.map((item) => ({
                    name: item.category,
                    amount: Number(item.total),
                })) ?? [],
        },
    ];

    return (
        <section className="mx-10 my-8 space-y-5 rounded-2xl border-2 border-white/5 bg-white pb-5 text-black dark:bg-[#1e1d1d]">
            {/* Header */}
            <div className="px-4 py-2">
                <h2 className="border-b-2 border-b-white/5 pb-2 font-semibold dark:text-white">
                    Monthly Report
                </h2>

                <p className="pt-2 text-sm text-neutral-500">
                    Track your spending and expenses
                </p>
            </div>

            {/* Charts */}
            <div className="flex flex-col gap-5 lg:flex-row">
                {charts.map(({ title, color, data }) => {
                    const avg =
                        data.length > 0
                            ? Math.round(
                                data.reduce((sum, item) => sum + item.amount, 0) /
                                data.length
                            )
                            : 0;

                    return (
                        <Card
                            key={title}
                            className="mx-8 flex-1 min-w-0 border py-4 shadow-none dark:border-[#353A42] dark:bg-[#262627] dark:text-white"
                        >
                            <CardHeader className="border-b px-5 py-4 dark:border-[#343840]">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">
                                        {title}
                                    </CardTitle>

                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span>Avg €{avg.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-5">
                                <div className="h-[260px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={data}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 10,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                vertical={false}
                                                stroke="#30343B"
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tickMargin={8}
                                                tick={{
                                                    fill: "#9CA3AF",
                                                    fontSize: 11,
                                                }}
                                            />

                                            <YAxis
                                                domain={[0, "auto"]}
                                                axisLine={false}
                                                tickLine={false}
                                                width={50}
                                                tick={{
                                                    fill: "#9CA3AF",
                                                    fontSize: 11,
                                                }}
                                            />

                                            <Tooltip
                                                cursor={{
                                                    fill: "rgba(255,255,255,0.03)",
                                                }}
                                                formatter={(value) => [
                                                    `€${Number(value).toLocaleString()}`,
                                                    "Amount",
                                                ]}
                                                contentStyle={{
                                                    backgroundColor: "#1E2126",
                                                    border: "1px solid #353A42",
                                                    borderRadius: "8px",
                                                    color: "#fff",
                                                }}
                                            />

                                            <Bar
                                                dataKey="amount"
                                                fill={color}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={40}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}