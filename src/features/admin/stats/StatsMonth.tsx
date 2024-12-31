import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CommandsStatsMonthDto } from "../../../api/dto/CommandDto";
import { formatYourMonth } from "../../../utils/date";
import { Price } from "../../../utils/price";

export function StatsMonth({months}: {months: CommandsStatsMonthDto[]}) {
    const data = months.map(month => ({
        date: formatYourMonth(new Date(month.date)),
        count: month.count,
        total: Price.toPrice(month.total),
    }))
    return <div className="flex-col items-baseline space-y-6 md:w-1/2 bg-slate-100 p-5 rounded-md">
        <h3 className="text-xl font-semibold text-center">Evolution des commandes par mois</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                    title="Evolution des commandes par mois"
                    width={600}
                    height={300}
                    data={data}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                    <YAxis yAxisId="left" label={{ value: "Nombre de commandes", angle: -90, dy: 90, position: "insideLeft" }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: "Prix total (€)", angle: -90, position: "insideRight" }} />

                    <Line type="monotone" dataKey="count" name="Nombre de commandes" stroke="#991b1b" yAxisId="left" />
                    <Line type="monotone" dataKey="total" name="Prix total des commandes" unit="€" stroke="#475569" yAxisId="right" />

                    <XAxis
                        dataKey="date"
                        tick={{ dy: 10 }}
                        label={{
                            value: "Mois",
                            position: "insideBottomRight",
                            offset: 0,
                            dy: 25,
                        }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{
                            paddingTop: 18,
                        }}
                    />
                    <Tooltip />
                </LineChart>
        </ResponsiveContainer>
    </div>
}