"use client";

import { useState } from "react";
import { Formik } from "formik";
import {
  Card,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TextField,
  TableRow,
  TableHead,
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import {
  notifyError,
  notifySuccess,
} from "../../../../../../utils/ToastNotification";
import DialogBox from "../../../../../../components/dialog/DialogBox";
import WrapperPage from "../../../../../WrapperPage";
import {
  StyledPagination,
  StyledTableCell,
} from "../../../../../../components/table/styles";
import Scrollbar from "../../../../../../components/scrollbar";
import ChildCategoryModel from "../../../../../../models/ChildCategory.model";
import ChildCategory from "../../../../../../services/ChildCategory";
import RowChildCategory from "../../../components/subcategory/childcategory/RowChildCategory";
import { childCategoryTableHeading } from "../../../components/subcategory/childcategory/data";

type Props = { childCategories: any; token: string };

export default function ChildCategoryView({
  childCategories: initialChildCategories,
  token,
}: Props) {
  const [childCategories, setChildCategories] = useState<any>(
    initialChildCategories?.child_categories || []
  );
  const [totalPages, setTotalPages] = useState<number>(
    initialChildCategories?.total_pages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedChildCategoryId, setSelectedChildCategoryId] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentLimit, setCurrentLimit] = useState<number>(10);
  const pageSizes = [5, 10, 20, 50];

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openDeleteDialog = (id: string) => {
    setSelectedChildCategoryId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedChildCategoryId(null);
  };

  const handleDelete = async () => {
    if (selectedChildCategoryId) {
      try {
        const response = await ChildCategory.delete(
          token,
          true,
          selectedChildCategoryId
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
      const response = await ChildCategory.findAll(
        token,
        true,
        limit,
        page,
        filters
      );
      setChildCategories(response?.data?.child_categories || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch (error) {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const updatedStatus = currentStatus === "1" ? 1 : 0;
      const response = await ChildCategory.update(
        id,
        { status: updatedStatus },
        token
      );

      if (response.success) {
        setChildCategories((prev) =>
          prev.map((childCategory) =>
            childCategory.id === id
              ? { ...childCategory, status: updatedStatus }
              : childCategory
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
    <WrapperPage title="Quản Lý Danh Mục Con Cấp 2">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          href="/dashboard/admin/categories/sub-category/child/create"
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
          Thêm danh mục con C2
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
                <Table stickyHeader aria-label="child category table">
                  <TableHead>
                    <TableRow>
                      {childCategoryTableHeading.map((headCell) => (
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
                      {childCategoryTableHeading.map((headCell) => (
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
                    {childCategories.map((childCategory) => (
                      <RowChildCategory
                        key={childCategory.id}
                        childCategory={childCategory}
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
