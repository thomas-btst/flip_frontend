import { useState } from "react"
import { Cell, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

const renderActiveShape = (props: PieSectorDataItem) => {
    const RADIAN = Math.PI / 180
    const {
        cx = 0,
        cy = 0,
        midAngle = 0,
        innerRadius = 0,
        outerRadius = 0,
        startAngle = 0,
        endAngle = 0,
        fill = '',
        percent = 0,
        value = 0,
    } = props

    const payload = props.payload as {name: string}

    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#000000">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle + 1}
                endAngle={endAngle - 1}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle + 1}
                endAngle={endAngle - 1}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx.toString()},${sy.toString()}L${mx.toString()},${my.toString()}L${ex.toString()},${ey.toString()}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                {value.toString()}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    )
}

// const renderActiveShape = (props: PieSectorDataItem) => {
//     const RADIAN = Math.PI / 180
//     const { cx: _cx, cy: _cy, midAngle: _midAngle, innerRadius, outerRadius: _outerRadius, startAngle, endAngle, fill, payload, percent: _percent, value } = props
//     const midAngle = _midAngle ?? 0
//     const outerRadius = _outerRadius ?? 0
//     const cx = _cx ?? 0
//     const cy = _cy ?? 0
//     const percent = _percent ?? 0
//     const sin = Math.sin(-RADIAN * midAngle)
//     const cos = Math.cos(-RADIAN * midAngle)
//     const sx = cx + (outerRadius + 10) * cos
//     const sy = cy + (outerRadius + 10) * sin
//     const mx = cx + (outerRadius + 30) * cos
//     const my = cy + (outerRadius + 30) * sin
//     const ex = mx + (cos >= 0 ? 1 : -1) * 22
//     const ey = my
//     const textAnchor = cos >= 0 ? 'start' : 'end'
  
//     return (
//       <g>
//         <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#000000">
//             {payload.name}
//         </text>
//         <Sector
//             cx={cx}
//             cy={cy}
//             innerRadius={innerRadius}
//             outerRadius={outerRadius}
//             startAngle={startAngle ? startAngle + 1 : 0}
//             endAngle={endAngle ? endAngle - 1 : 0}
//             fill={fill}
//         />
//         <Sector
//             cx={cx}
//             cy={cy}
//             startAngle={startAngle ? startAngle + 1 : 0}
//             endAngle={endAngle ? endAngle - 1 : 0}
//             innerRadius={outerRadius + 6}
//             outerRadius={outerRadius + 10}
//             fill={fill}
//         />
//         <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
//         <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//         <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value?.toString()}`}</text>
//         <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
//             {`(${(percent * 100).toFixed(2).toString()}%)`}
//         </text>
//       </g>
//     )
// }

export function StatsStatus({delivered, canceled}: {delivered: number, canceled: number}) {
    const [activeIndex, setActiveIndex] = useState(0)
    const data = [
        {name: "Délivrées", value: delivered},
        {name: "Annulées", value: canceled},
    ]
    return <div className="flex-col bg-slate-100 p-5 rounded-md">
        <h3 className="text-xl font-semibold text-center -mb-16">Status des commandes</h3>
        <PieChart width={400} height={400}>
            <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => {setActiveIndex(index)}}
            >
                <Cell fill="#fed7aa"/>
                <Cell fill="#94a3b8"/>
            </Pie>
        </PieChart>
    </div>
}