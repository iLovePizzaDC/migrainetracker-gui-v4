import { PieChart as RePieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { FONT_FAMILY } from "../../../../../shared/constants/style/font";
import { PIE_COLORS } from "../../../constants/card/pie-colors";
import type { ChartData } from "../../../types/card/chart";

interface IPieChart {
    data: ChartData;
}

function PieChart({ data }: IPieChart) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
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
                    itemStyle={{ color: "#000" }}
                    labelStyle={{ color: "#000" }}
                />
                <Pie
                    data={data}
                    dataKey="value"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                >
                {data.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
                </Pie>
            </RePieChart>
        </ResponsiveContainer>
    );
}

export default PieChart;
