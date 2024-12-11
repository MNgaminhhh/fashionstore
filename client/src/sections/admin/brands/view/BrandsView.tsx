"use client";

import { useState } from "react";
import { Formik } from "formik";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Scrollbar from "../../../../components/scrollbar";
import RowBrands from "../components/RowBrands";
import WrapperPage from "../../../WrapperPage";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Brand from "../../../../services/Brand";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import { Box, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import { tableHeading } from "../components/data";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import DialogBox from "../../../../components/dialog/DialogBox";

type Props = { brands: any[]; token: string };

export default function BrandsView({ brands: initialBrands, token }: Props) {
  const [brands, setBrands] = useState(initialBrands.brands || []);
  const [totalPages, setTotalPages] = useState(initialBrands.total_page || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const pageSizes = [5, 10, 20, 50];

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openDeleteDialog = (id: string) => {
    setSelectedBrandId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedBrandId(null);
  };

  const handleDelete = async () => {
    if (selectedBrandId) {
      try {
        await Brand.delete(token, true, selectedBrandId);
        notifySuccess("Thương hiệu đã được xóa thành công");
        await applyFilters(currentPage, currentLimit);
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa thương hiệu");
      } finally {
        closeDeleteDialog();
      }
    }
  };

  const applyFilters = async (
    page: number,
    limit: number,
    filters = searchValues
  ) => {
    try {
      const response = await Brand.findAll(token, true, limit, page, filters);
      const data = response?.data?.data?.brands || [];
      setBrands(data);
      setTotalPages(response?.data?.data?.total_page || 1);
    } catch (error) {
      notifyError("Có lỗi xảy ra khi tải dữ liệu");
    }
  };
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const updatedStatus = currentStatus ? true : false;
      const response = await Brand.update(
        id,
        { visible: updatedStatus },
        token,
        true
      );
      if (response.data.success) {
        setBrands((prev) =>
          prev.map((brand) =>
            brand.id === id ? { ...brand, status: updatedStatus } : brand
          )
        );
        notifySuccess("Trạng thái thương hiệu đã được cập nhật thành công");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data.message || "")
        );
      }
    } catch (error) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái thương hiệu");
    }
  };

  return (
    <WrapperPage title="Quản Lý Thương Hiệu">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          href="/dashboard/admin/brands/create"
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
          Thêm thương hiệu
        </Button>
      </Box>

      <Card>
        <Formik
          initialValues={{
            page: currentPage,
            limit: currentLimit,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setCurrentPage(values.page);
            setCurrentLimit(values.limit);
            await applyFilters(values.page, values.limit);
            setSubmitting(false);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <>
              <TableContainer
                sx={{
                  maxHeight: 900,
                }}
                component={Scrollbar}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.200", height: 56 }}>
                      {tableHeading.map((headCell) => (
                        <StyledTableCell
                          key={headCell.id}
                          align={headCell.align}
                          width={headCell.width}
                          sx={{ backgroundColor: "grey.200" }}
                        >
                          {headCell.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "grey.100", height: 56 }}>
                      {tableHeading.map((headCell) => (
                        <StyledTableCell
                          key={headCell.id}
                          align={headCell.align}
                          width={headCell.width}
                          sx={{ backgroundColor: "grey.100" }}
                        >
                          {headCell.id !== "action" &&
                          headCell.id !== "image" &&
                          headCell.id !== "sequence" ? (
                            headCell.id === "visible" ? (
                              <Select
                                fullWidth
                                size="small"
                                value={searchValues[headCell.id] || ""}
                                onChange={(e) => {
                                  const newValue = e.target.value as string;
                                  handleSearchChange(headCell.id, newValue);
                                  applyFilters(values.page, values.limit, {
                                    ...searchValues,
                                    [headCell.id]: newValue,
                                  });
                                }}
                              >
                                <MenuItem value="">
                                  Vui lòng chọn giá trị
                                </MenuItem>
                                <MenuItem value="true">Hiển thị</MenuItem>
                                <MenuItem value="false">Ẩn</MenuItem>
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
                                    applyFilters(values.page, values.limit);
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
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <RowBrands
                          brand={brand}
                          key={brand.id}
                          onDelete={() => openDeleteDialog(brand.id)}
                          onToggleVisibility={handleToggleStatus}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell
                          colSpan={tableHeading.length}
                          align="center"
                        >
                          Không có dữ liệu
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
                      setFieldValue("limit", e.target.value as number);
                      setFieldValue("page", 1);
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
                    onChange={(_, page) => {
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
