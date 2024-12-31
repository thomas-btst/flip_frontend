import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CommandsTopProductDto } from "../../../api/dto/CommandDto";
import { useNavigate } from "react-router-dom";

export function StatsTopProducts({products}: {products: CommandsTopProductDto[]}) {
    const navigate = useNavigate()
    const data = products.map(product => ({
        id: product.id,
        name: product.product?.name ?? "Produit supprimé",
        quantity: product.count,
    }))
    return <div className="flex-col items-baseline space-y-6 md:w-1/2 bg-slate-100 p-5 rounded-md">
        <h3 className="text-xl font-semibold text-center">Produits les plus vendus</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart width={600} height={300} data={data}>
                <XAxis dataKey="name" tick={{dy: 10, fontSize: 12}}/>
                <YAxis label={{value: "Quantité vendue", position: "insideTopLeft", dx: 65}}/>
                <Tooltip/>
                <Bar
                    name="Quantité"
                    onClick={(event: {id: string}) => { navigate(`/product/${event.id}`); }}
                    className="hover:cursor-pointer"
                    dataKey="quantity"
                    fill="#991b1b"
                    activeBar={<Rectangle fill="#7f1d1d"/>}
                />
            </BarChart>
        </ResponsiveContainer>
    </div>
}