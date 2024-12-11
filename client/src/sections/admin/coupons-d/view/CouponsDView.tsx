"use client";

import React, { useState } from "react";
import { Formik } from "formik";
import {
  Card,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Select,
  MenuItem,
  Box,
  Button,
  Divider,
} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Scrollbar from "../../../../components/scrollbar";
import WrapperPage from "../../../WrapperPage";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import DialogBox from "../../../../components/dialog/DialogBox";
import { useRouter } from "next/navigation";
import Coupons from "../../../../services/Coupons";
import CouponModel from "../../../../models/Coupon.model";
import { tableHeading } from "../components/data";
import RowCouponsD from "../components/RowCouponsD";
import DetailDialog from "../components/DetailDialog";

type Props = {
  couponsData: any;
  token: string;
};
const selectOptions: { [key: string]: { value: string; label: string }[] } = {
  status: [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Hiển thị" },
    { value: "false", label: "Ẩn" },
  ],
  type: [
    { value: "", label: "Tất cả" },
    { value: "fixed", label: "Giá Cố Định" },
    { value: "percentage", label: "Phí (%)" },
    { value: "shipping_fixed", label: "Phí Vận Chuyển Cố Định" },
    { value: "shipping_percentage", label: "Phí Vận Chuyển (%)" },
  ],
};
export default function CouponsDView({ couponsData, token }: Props) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponModel[]>(
    couponsData.coupons || []
  );
  const [totalPages, setTotalPages] = useState<number>(
    couponsData.totalPages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponModel | null>(
    null
  );
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(couponsData.page || 1);
  const [currentLimit, setCurrentLimit] = useState<number>(
    couponsData.limit || 10
  );
  const pageSizes: number[] = [5, 10, 20, 50];

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleViewDetail = (coupon: CouponModel) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setSelectedCoupon(null);
    setDialogOpen(false);
  };

  const applyFilters = async (
    page: number,
    limit: number,
    filters: { [key: string]: string } = searchValues
  ) => {
    try {
      const response = await Coupons.getAllCoupons(
        token,
        true,
        limit,
        page,
        filters
      );

      if (response.success) {
        setCoupons(response.data.coupons || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.page || 1);
        setCurrentLimit(response.data.limit || 10);
      } else {
        notifyError("Có lỗi xảy ra khi tải dữ liệu.");
      }
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      const response = await Coupons.updateStatus(id, newStatus, token);

      if (response?.success || response?.data?.success) {
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon.id === id ? { ...coupon, status: newStatus } : coupon
          )
        );
        notifySuccess("Trạng thái đã được cập nhật thành công.");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data?.message || "")
        );
      }
    } catch (error: any) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái Coupon.");
    }
  };

  return (
    <WrapperPage title="Danh Sách Coupon">
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          href={`/dashboard/admin/coupons-d/create`}
          color="primary"
          variant="contained"
          startIcon={<Add />}
          LinkComponent={Link}
          sx={{
            minHeight: 44,
            textTransform: "none",
            borderRadius: 1,
            px: 3,
          }}
        >
          Thêm Coupon
        </Button>
      </Box>

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
                    <TableRow>
                      {tableHeading.map((headCell) => (
                        <StyledTableCell
                          key={headCell.id}
                          align={headCell.align}
                          width={headCell.width}
                        >
                          {headCell.id !== "action" &&
                          headCell.id !== "code" &&
                          headCell.id !== "date" ? (
                            selectOptions[headCell.id] ? (
                              <Select
                                size="small"
                                value={searchValues[headCell.id] || ""}
                                onChange={(e) => {
                                  const value = e.target.value as string;
                                  handleSearchChange(headCell.id, value);
                                  applyFilters(values.page, values.limit, {
                                    ...searchValues,
                                    [headCell.id]: value,
                                  });
                                }}
                                displayEmpty
                                sx={{ width: "100%" }}
                              >
                                {selectOptions[headCell.id].map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              <TextField
                                size="small"
                                value={searchValues[headCell.id] || ""}
                                onChange={(e) =>
                                  handleSearchChange(
                                    headCell.id,
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSubmit();
                                  }
                                }}
                                sx={{ width: "100%" }}
                              />
                            )
                          ) : null}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coupons.length > 0 ? (
                      coupons.map((coupon) => (
                        <RowCouponsD
                          key={coupon.id}
                          coupon={coupon}
                          onToggleStatus={handleToggleStatus}
                          onViewDetail={handleViewDetail}
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
                  <Select
                    value={values.limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setFieldValue("limit", newLimit);
                      setFieldValue("page", 1);
                      setCurrentLimit(newLimit);
                      setCurrentPage(1);
                      handleSubmit();
                    }}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    {pageSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size} mục/trang
                      </MenuItem>
                    ))}
                  </Select>

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
      <DetailDialog
        open={dialogOpen}
        onClose={handleCloseDetailDialog}
        coupon={selectedCoupon}
      />
    </WrapperPage>
  );
}
