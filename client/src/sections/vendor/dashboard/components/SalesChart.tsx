"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography, Grid } from "@mui/material";
import { H3 } from "../../../../components/Typography";

const salesData = [
  { month: "Tháng 1", sales: 40000 },
  { month: "Tháng 2", sales: 30000 },
  { month: "Tháng 3", sales: 50000 },
  { month: "Tháng 4", sales: 70000 },
  { month: "Tháng 5", sales: 60000 },
  { month: "Tháng 6", sales: 80000 },
  { month: "Tháng 7", sales: 75000 },
  { month: "Tháng 8", sales: 90000 },
  { month: "Tháng 9", sales: 85000 },
  { month: "Tháng 10", sales: 95000 },
  { month: "Tháng 11", sales: 100000 },
  { month: "Tháng 12", sales: 120000 },
];

const orderData = [
  { month: "Tháng 1", orders: 30 },
  { month: "Tháng 2", orders: 45 },
  { month: "Tháng 3", orders: 50 },
  { month: "Tháng 4", orders: 70 },
  { month: "Tháng 5", orders: 65 },
  { month: "Tháng 6", orders: 80 },
  { month: "Tháng 7", orders: 75 },
  { month: "Tháng 8", orders: 90 },
  { month: "Tháng 9", orders: 85 },
  { month: "Tháng 10", orders: 95 },
  { month: "Tháng 11", orders: 100 },
  { month: "Tháng 12", orders: 120 },
];

const productCategoryData = [
  { name: "Điện Thoại", value: 400 },
  { name: "Máy Tính", value: 300 },
  { name: "Phụ Kiện", value: 300 },
  { name: "Thời Trang", value: 200 },
  { name: "Khác", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const SalesChart: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, height: "100%" }}>
          <H3>Doanh Số Bán Hàng Theo Tháng</H3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={salesData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("vi-VN").format(value) + " VNĐ"
                }
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, height: "100%" }}>
          <H3>Số Lượng Đơn Hàng Theo Tháng</H3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={orderData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value} đơn hàng`} />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, height: "100%" }}>
          <H3>Tỷ Lệ Sản Phẩm Bán Được</H3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {productCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} sản phẩm`,
                  `Loại: ${name}`,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SalesChart;
