"use client";

import React, { Fragment, useState, useEffect } from "react";
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
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { get } from "lodash";

import {
  StyledTableCell,
  StyledPagination,
} from "../../../../components/table/styles";
import Scrollbar from "../../../../components/scrollbar";
import WrapperPage from "../../../WrapperPage";
import RowOrder from "../components/RowOrder";
import { tableHeading } from "../components/data";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Orders from "../../../../services/Order";

type Props = {
  ordersData: any;
  token: string;
};

export default function OrdersView({ ordersData, token }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>(
    flattenOrders(ordersData?.order_bills || [])
  );
  const [totalPages, setTotalPages] = useState<number>(
    ordersData?.totalPages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentLimit, setCurrentLimit] = useState<number>(10);
  const pageSizes: number[] = [5, 10, 20, 50];

  function flattenOrders(order_bills: any[]): any[] {
    let flattened: any[] = [];
    order_bills.forEach((order) => {
      order.skus.forEach((sku: any) => {
        flattened.push({
          ...sku,
          order_id: order.order_id,
        });
      });
    });
    return flattened;
  }

  const applyFilters = async (
    page: number,
    limit: number,
    filters: { [key: string]: string } = searchValues
  ) => {
    try {
      const response = await Orders.getAllOrderByVendor(
        token,
        true,
        limit,
        page,
        filters
      );
      if (response?.success || response?.data?.success) {
        const flattenedOrders = flattenOrders(
          get(response, "data.order_bills", [])
        );
        setOrders(flattenedOrders);
        setTotalPages(get(response, "data.totalPages", 1));
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
                          align={
                            headCell.align as
                              | "left"
                              | "center"
                              | "right"
                              | "justify"
                              | "inherit"
                          }
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
                        <RowOrder key={order.sku_id} order={order} />
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
