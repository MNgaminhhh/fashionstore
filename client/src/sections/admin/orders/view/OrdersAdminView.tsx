"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { get } from "lodash";

import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Orders from "../../../../services/Order";
import WrapperPage from "../../../WrapperPage";
import Scrollbar from "../../../../components/scrollbar";
import RowOrdersAdmin from "../components/RowOrdersAdmin";
import { tableHeading } from "../components/data";
import { StyledPagination } from "../../../../components/table/styles";
import { StyledTableCell } from "../../../styles";

type Props = {
  initialOrders: any;
  token: string;
};

export default function OrdersAdminView({ initialOrders, token }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>(initialOrders?.order_bills || []);
  const [totalPages, setTotalPages] = useState<number>(
    initialOrders?.total_pages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentLimit, setCurrentLimit] = useState<number>(10);
  const pageSizes: number[] = [5, 10, 20, 50];

  const applyFilters = async (
    page: number,
    limit: number,
    filters: { [key: string]: string } = searchValues
  ) => {
    try {
      const response = await Orders.getAllOrderByAdmin(
        token,
        true,
        limit,
        page,
        filters
      );
      if (response?.success || response?.data?.success) {
        setOrders(response.data.order_bills || []);
        setTotalPages(response.data.total_pages || 1);
      } else {
        notifyError("Có lỗi xảy ra khi tải dữ liệu.");
      }
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openDeleteDialog = (id: string) => {
    setSelectedOrderId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleDelete = async () => {
    if (selectedOrderId) {
      try {
        const response = await Orders.deleteOrder(selectedOrderId, token);
        if (response.success) {
          notifySuccess("Đơn hàng đã được xoá thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xoá đơn hàng thất bại: " +
              (response.message || "Vui lòng thử lại.")
          );
        }
      } catch (error: any) {
        notifyError("Có lỗi xảy ra khi xoá đơn hàng.");
      } finally {
        closeDeleteDialog();
      }
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    applyFilters(value, currentLimit);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newLimit = Number(event.target.value);
    setCurrentLimit(newLimit);
    setCurrentPage(1);
    applyFilters(1, newLimit);
  };

  const handleBack = () => {
    router.push("/dashboard/admin/orders");
  };

  return (
    <WrapperPage title="Danh Sách Đơn Hàng">
      <Card>
        <Formik
          initialValues={{
            page: currentPage,
            limit: currentLimit,
          }}
          onSubmit={async (values) => {
            setCurrentPage(values.page);
            setCurrentLimit(values.limit);
            await applyFilters(values.page, values.limit);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <>
              <TableContainer component={Scrollbar}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {tableHeading.map((headCell) => (
                        <StyledTableCell
                          key={headCell.id}
                          align={headCell.align}
                          width={headCell.width}
                        >
                          {headCell.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <RowOrdersAdmin
                          key={order.id}
                          order={order}
                          onDelete={openDeleteDialog}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell
                          colSpan={tableHeading.length}
                          align="center"
                        >
                          Không tìm thấy dữ liệu
                        </StyledTableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
              <Box display="flex" justifyContent="flex-end" my={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="page-size-label">Số mục</InputLabel>
                    <Select
                      labelId="page-size-label"
                      value={values.limit}
                      label="Số mục"
                      onChange={(e) => {
                        const newLimit = Number(e.target.value);
                        setFieldValue("limit", newLimit);
                        setFieldValue("page", 1);
                        setCurrentLimit(newLimit);
                        setCurrentPage(1);
                        handleSubmit();
                      }}
                    >
                      {pageSizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size} mục/trang
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <StyledPagination
                    count={totalPages}
                    page={values.page}
                    onChange={(_, page: number) => {
                      setFieldValue("page", page);
                      setCurrentPage(page);
                      handleSubmit();
                    }}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Formik>
      </Card>
    </WrapperPage>
  );
}
