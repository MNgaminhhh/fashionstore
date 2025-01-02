"use client";

import { useState } from "react";
import { Formik } from "formik";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Scrollbar from "../../../../components/scrollbar";
import WrapperPage from "../../../WrapperPage";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import { Box, Button, Divider, MenuItem, Select } from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import DialogBox from "../../../../components/dialog/DialogBox";
import Categories from "../../../../services/Categories";
import RowCategories from "../components/RowCategories";
import { tableHeading } from "../components/data";

type Props = { categories: any; token: string };

export default function CategoriesView({
  categories: initialCats,
  token,
}: Props) {
  const [categories, setCategories] = useState(initialCats.categories || []);
  const [totalPages, setTotalPages] = useState(initialCats.total_pages || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
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
    setSelectedCategoryId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedCategoryId(null);
  };

  const handleDelete = async () => {
    if (selectedCategoryId) {
      try {
        const response = await Categories.delete(
          token,
          true,
          selectedCategoryId
        );

        if (response.data.success) {
          notifySuccess("Danh mục đã được xóa thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xóa danh mục thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa danh mục.");
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
      const response = await Categories.findAll(
        token,
        true,
        limit,
        page,
        filters
      );
      setCategories(response?.data?.categories || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: number) => {
    try {
      const updatedStatus = currentStatus === 1 ? 1 : 0;
      const response = await Categories.update(
        id,
        { status: updatedStatus },
        token,
        true
      );

      if (response.data.success) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === id
              ? { ...category, status: updatedStatus }
              : category
          )
        );
        notifySuccess("Trạng thái danh mục đã được cập nhật thành công.");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data.message || "")
        );
      }
    } catch (error) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái danh mục.");
    }
  };

  return (
    <WrapperPage title="Quản Lý Danh Mục">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          href="/dashboard/admin/categories/create"
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
          Thêm danh mục
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
                        >
                          {headCell.id !== "action" &&
                          headCell.id !== "icon" &&
                          headCell.id !== "name_code" &&
                          headCell.id !== "status" ? (
                            <TextField
                              size="small"
                              value={searchValues[headCell.id] || ""}
                              onChange={(e) =>
                                handleSearchChange(headCell.id, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  applyFilters(values.page, values.limit);
                                }
                              }}
                              sx={{ width: "100%" }}
                            />
                          ) : null}
                          {headCell.id === "status" ? (
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
                              <MenuItem value="-1">
                                Vui lòng chọn giá trị
                              </MenuItem>
                              <MenuItem value="1">Hiển thị</MenuItem>
                              <MenuItem value="0">Ẩn</MenuItem>
                            </Select>
                          ) : null}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <RowCategories
                        key={category.id}
                        category={category}
                        onDelete={openDeleteDialog}
                        onToggleVisibility={(id, status) =>
                          handleToggleStatus(id, status ? 1 : 0)
                        }
                      />
                    ))}
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
