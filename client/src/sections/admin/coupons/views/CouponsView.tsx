"use client";

import { useState, useEffect } from "react";
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
import { Add, ArrowBack } from "@mui/icons-material";
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
import { tableHeading } from "../components/data";
import RowCoupon from "../components/RowCoupons";
import Conditions from "../../../../services/Conditions";

type Props = {
  conditionsData: any;
  token: string;
};
export default function CouponsView({ conditionsData, token }: Props) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(conditionsData?.conditions || []);
  const [totalPages, setTotalPages] = useState<number>(
    conditionsData?.totalPages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentLimit, setCurrentLimit] = useState<number>(10);
  const pageSizes: number[] = [5, 10, 20, 50];

  const selectOptions: { [key: string]: { value: string; label: string }[] } =
    {};

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openDeleteDialog = (id: string) => {
    setSelectedCouponId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedCouponId(null);
  };

  const handleDelete = async () => {
    if (selectedCouponId) {
      try {
        const response = await Conditions.delete(selectedCouponId, token);

        if (response.data.success) {
          notifySuccess("Coupon đã được xoá thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xoá Coupon thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xoá Coupon.");
      } finally {
        closeDeleteDialog();
      }
    }
  };

  const applyFilters = async (
    page: number,
    limit: number,
    filters: { [key: string]: string } = searchValues
  ) => {
    try {
      const response = await Conditions.getAllConditions(
        token,
        true,
        limit,
        page,
        filters
      );

      if (response.success) {
        setCoupons(response.data?.conditions || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        notifyError("Có lỗi xảy ra khi tải dữ liệu.");
      }
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/admin/coupons");
  };

  return (
    <WrapperPage title="Danh Sách Điều Kiện Mã Giảm Giá">
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          href={`/dashboard/admin/coupons/create`}
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
          Thêm điều kiện mã giảm giá
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
                          {headCell.id === "description" ? (
                            <TextField
                              size="small"
                              value={searchValues[headCell.id] || ""}
                              onChange={(e) =>
                                handleSearchChange(headCell.id, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSubmit();
                                }
                              }}
                              sx={{ width: "100%" }}
                            />
                          ) : null}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coupons.length > 0 ? (
                      coupons.map((coupon) => (
                        <RowCoupon
                          key={coupon.ID}
                          coupon={coupon}
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
      <DialogBox
        open={dialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
      />
    </WrapperPage>
  );
}
