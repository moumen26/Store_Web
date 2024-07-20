import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data with days of the week and sales information
const data = [
  { day: "Monday", revenue: 200, orders: 50 },
  { day: "Tuesday", revenue: 300, orders: 80 },
  { day: "Wednesday", revenue: 250, orders: 70 },
  { day: "Thursday", revenue: 400, orders: 90 },
  { day: "Friday", revenue: 350, orders: 60 },
  { day: "Saturday", revenue: 500, orders: 100 },
  { day: "Sunday", revenue: 450, orders: 90 },
];

export default function SalesChart() {
  return (
    <div className="dashboadChart">
      <div className="w-full flex items-center justify-between ">
        <h3 className="dashboardTitleItem">Sales Overtime</h3>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="cercleChartItemRevenue"></div>
              <span className="spanChartItemRevenue">Revenue</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="cercleChartItemOrder"></div>
              <span className="spanChartItemOrder">Order</span>
            </div>
          </div>
          <div className="selectOptionChartClass">
            <select
              className="selectOptionChart"
              name="selectOptionChart"
              id="selectOptionChart"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3e9cb9"
            activeDot={{ r: 8 }}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#26667e"
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
