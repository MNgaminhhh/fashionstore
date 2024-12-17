"use client";

import { useState } from "react";
import { Formik } from "formik";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { Box, Button, Divider, MenuItem, Select } from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import {
  notifyError,
  notifySuccess,
} from "../../../../../utils/ToastNotification";
import DialogBox from "../../../../../components/dialog/DialogBox";
import WrapperPage from "../../../../WrapperPage";
import { subCategoryTableHeading } from "../../components/subcategory/data";
import {
  StyledPagination,
  StyledTableCell,
} from "../../../../../components/table/styles";
import RowSubCategories from "../../components/subcategory/RowSubCategory";
import Scrollbar from "../../../../../components/scrollbar";
import SubCategory from "../../../../../services/SubCategory";

type Props = { subcategories: any; token: string };

export default function SubCategoryView({
  subcategories: initialSubs,
  token,
}: Props) {
  const [subcategories, setSubcategories] = useState(
    initialSubs?.sub_categories || []
  );
  const [totalPages, setTotalPages] = useState(initialSubs?.total_pages || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
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
    setSelectedSubCategoryId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedSubCategoryId(null);
  };

  const handleDelete = async () => {
    if (selectedSubCategoryId) {
      try {
        const response = await SubCategory.delete(
          token,
          true,
          selectedSubCategoryId
        );
        if (response.success) {
          notifySuccess("Danh mục con đã được xóa thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xóa danh mục con thất bại: " +
              (response.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa danh mục con.");
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
      const response = await SubCategory.findAll(
        token,
        true,
        limit,
        page,
        filters
      );
      setSubcategories(response?.data?.sub_categories || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: number) => {
    try {
      const updatedStatus = currentStatus === 1 ? 1 : 0;
      const response = await SubCategory.update(
        id,
        { status: updatedStatus },
        token
      );

      if (response.success) {
        setSubcategories((prev) =>
          prev.map((subcategory) =>
            subcategory.id === id
              ? { ...subcategory, status: updatedStatus }
              : subcategory
          )
        );
        notifySuccess("Trạng thái danh mục con đã được cập nhật thành công.");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.message || "")
        );
      }
    } catch (error) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái danh mục con.");
    }
  };

  return (
    <WrapperPage title="Quản Lý Danh Mục Con">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          href="/dashboard/admin/categories/sub-category/create"
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
          Thêm danh mục con C1
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
                      {subCategoryTableHeading.map((headCell) => (
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
                      {subCategoryTableHeading.map((headCell) => (
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
                    {subcategories.map((subcategory) => (
                      <RowSubCategories
                        key={subcategory.id}
                        subcategory={subcategory}
                        onDelete={openDeleteDialog}
                        onToggleVisibility={handleToggleStatus}
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
