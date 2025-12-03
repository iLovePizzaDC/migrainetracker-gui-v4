import { AreaChart as RAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartData } from "recharts/types/state/chartDataSlice";
import { FONT_FAMILY } from "../../../../../shared/constants/style/font";

interface IAreaChart {
    data: ChartData;
}

function AreaChart({ data }: IAreaChart) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RAreaChart
                data={data}
                margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity={0.05} />
                    </linearGradient>
                </defs>

                <XAxis
                    dataKey="name"
                    tick={{ fill: "#fff", fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: 500 }}
                    interval={Math.floor(data.length / 5)}
                />

                <YAxis
                    tick={{ fill: "#fff", fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: 500 }}
                />

                <Tooltip
                    contentStyle={{
                        background: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        borderRadius: "12px",
                        color: "#000",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        fontFamily: FONT_FAMILY,
                        fontSize: 14,
                    }}
                    itemStyle={{ color: "#000", fontFamily: FONT_FAMILY, fontSize: 14 }}
                    labelStyle={{ color: "#000", fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: 600 }}
                />

                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#fff"
                    fill="url(#colorArea)"
                    fillOpacity={0.4}
                    strokeWidth={2}
                />
            </RAreaChart>
        </ResponsiveContainer>
    );
}

export default AreaChart;
