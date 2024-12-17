"use client";
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import { H3 } from "../../components/Typography";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Dữ liệu mẫu cho biểu đồ
const barData = [
  { name: "Tháng 1", sales: 4000, revenue: 2400 },
  { name: "Tháng 2", sales: 3000, revenue: 1398 },
  { name: "Tháng 3", sales: 2000, revenue: 9800 },
  { name: "Tháng 4", sales: 2780, revenue: 3908 },
  { name: "Tháng 5", sales: 1890, revenue: 4800 },
  { name: "Tháng 6", sales: 2390, revenue: 3800 },
  { name: "Tháng 7", sales: 3490, revenue: 4300 },
];

const lineData = [
  { name: "Ngày 1", users: 400 },
  { name: "Ngày 2", users: 300 },
  { name: "Ngày 3", users: 200 },
  { name: "Ngày 4", users: 278 },
  { name: "Ngày 5", users: 189 },
  { name: "Ngày 6", users: 239 },
  { name: "Ngày 7", users: 349 },
];

const pieData = [
  { name: "Sản phẩm A", value: 400 },
  { name: "Sản phẩm B", value: 300 },
  { name: "Sản phẩm C", value: 300 },
  { name: "Sản phẩm D", value: 200 },
];

const areaData = [
  { name: "Tháng 1", uv: 4000, pv: 2400 },
  { name: "Tháng 2", uv: 3000, pv: 1398 },
  { name: "Tháng 3", uv: 2000, pv: 9800 },
  { name: "Tháng 4", uv: 2780, pv: 3908 },
  { name: "Tháng 5", uv: 1890, pv: 4800 },
  { name: "Tháng 6", uv: 2390, pv: 3800 },
  { name: "Tháng 7", uv: 3490, pv: 4300 },
];

const scatterData = [
  { name: "A", x: 100, y: 200 },
  { name: "B", x: 300, y: 100 },
  { name: "C", x: 200, y: 300 },
  { name: "D", x: 400, y: 500 },
  { name: "E", x: 500, y: 200 },
  { name: "F", x: 700, y: 400 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const summaryData = [
  {
    title: "Tổng Doanh Số",
    value: "0",
    icon: <AttachMoneyIcon fontSize="large" color="success" />,
    color: "success.main",
  },
  {
    title: "Tổng Người Dùng",
    value: "3",
    icon: <PeopleIcon fontSize="large" color="primary" />,
    color: "primary.main",
  },
  {
    title: "Đơn Hàng Mới",
    value: "3",
    icon: <ShoppingCartIcon fontSize="large" color="warning" />,
    color: "warning.main",
  },
  {
    title: "Tỷ lệ Tăng Trưởng",
    value: "3",
    icon: <TrendingUpIcon fontSize="large" color="error" />,
    color: "error.main",
  },
];

const tableData = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", status: "Hoạt động" },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    status: "Không hoạt động",
  },
  { id: 3, name: "Lê Văn C", email: "c@example.com", status: "Hoạt động" },
  { id: 4, name: "Phạm Thị D", email: "d@example.com", status: "Hoạt động" },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "e@example.com",
    status: "Không hoạt động",
  },
];

const AdminDashboardView: React.FC = () => {
  const theme = useTheme();

  return (
    <Box p={3}>
      <H3>Dashboard Quản Trị</H3>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
              }}
            >
              <Avatar
                sx={{
                  bgcolor: item.color,
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  {item.title}
                </Typography>
                <Typography variant="h6" color="textPrimary">
                  {item.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Biểu đồ Bar */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Doanh số theo tháng
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Line */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Người dùng hoạt động
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Pie */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân bổ sản phẩm
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Area */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Xu hướng Doanh số
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Scatter */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân tích Sản phẩm
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="X" />
                  <YAxis type="number" dataKey="y" name="Y" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter name="Sản phẩm" data={scatterData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bảng dữ liệu Chi tiết */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Danh sách Người Dùng
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Tên</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Trạng Thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>
                          <Typography
                            color={
                              row.status === "Hoạt động"
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {row.status}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardView;
