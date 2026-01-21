import { useEffect, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/analytics", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <p>Loading dashboard...</p>

  const { kpis, charts } = data

  return (
    <div className="space-y-8">
      
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Orders Today" value={kpis.ordersToday} />
        <Card title="Revenue Today" value={`₹${kpis.revenueToday}`} />
        <Card title="Revenue This Month" value={`₹${kpis.revenueMonth}`} />
        <Card title="New Users" value={kpis.newUsers} />
      </div>

      {/* ORDERS CHART */}
      <Chart title="Orders (Last 7 Days)">
        <LineChart data={charts.ordersChart}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="count" stroke="#4f46e5" />
        </LineChart>
      </Chart>

      {/* REVENUE CHART */}
      <Chart title="Revenue (Last 7 Days)">
        <LineChart data={charts.revenueChart}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="revenue" stroke="#16a34a" />
        </LineChart>
      </Chart>

      {/* TOP PRODUCTS */}
      <Chart title="Top Selling Products">
        <BarChart data={charts.topProducts}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sold" fill="#f97316" />
        </BarChart>
      </Chart>
    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow font-bold">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl">{value}</p>
    </div>
  )
}

function Chart({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}
