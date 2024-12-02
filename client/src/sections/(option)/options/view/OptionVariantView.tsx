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
import OptionVariantModel from "../../../../models/OptionVariant.model";
import OptionVariant from "../../../../services/OptionVariant";
import { useParams } from "next/navigation";
import { tableHeading } from "../components/data";
import RowOptionVariant from "../components/RowOptionVariant";

type Props = { opvariant: any; token: string };

const selectOptions: { [key: string]: { value: string; label: string }[] } = {
  status: [
    { value: "", label: "Tất cả" },
    { value: "active", label: "Hiển thị" },
    { value: "inactive", label: "Ẩn" },
  ],
};

export default function OptionVariantView({
  opvariant: initialVariants,
  token,
}: Props) {
  const params = useParams();
  const { id, vid } = params;
  const [optionVariants, setOptionVariants] = useState<OptionVariantModel[]>(
    initialVariants.results || []
  );
  const [totalPages, setTotalPages] = useState<number>(
    initialVariants.totalPage || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOptionVariantId, setSelectedOptionVariantId] = useState<
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
    setSelectedOptionVariantId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedOptionVariantId(null);
  };

  const handleDelete = async () => {
    if (selectedOptionVariantId) {
      try {
        const response = await OptionVariant.delete(
          selectedOptionVariantId,
          token,
          true
        );

        if (response.data.success) {
          notifySuccess("Tùy chọn biến thể đã được xóa thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xóa tùy chọn biến thể thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa tùy chọn biến thể.");
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
      const response = await OptionVariant.getOpVariant(
        vid,
        token,
        true,
        limit,
        page,
        filters
      );
      console.log(response?.data);
      setOptionVariants(response?.data?.results || []);
      setTotalPages(response?.data?.totalPage || 1);
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleStatus = async (
    id: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      const response = await OptionVariant.updateStatus(
        id,
        newStatus,
        token,
        true
      );

      if (response.data.success) {
        setOptionVariants((prevVariants) =>
          prevVariants.map((optionVariant) =>
            optionVariant.id === id
              ? { ...optionVariant, status: newStatus }
              : optionVariant
          )
        );
        notifySuccess(
          "Trạng thái tùy chọn biến thể đã được cập nhật thành công."
        );
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data.message || "")
        );
      }
    } catch (error: any) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái tùy chọn biến thể.");
    }
  };

  return (
    <WrapperPage title="Quản Lý Tùy Chọn Biến Thể">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          href={`/dashboard/vendor/product/${id}/variant/${vid}/option-variant/create`}
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
          Thêm tùy chọn biến thể
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
                          {headCell.id !== "action" ? (
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
                    {optionVariants.map((optionVariant) => (
                      <RowOptionVariant
                        key={optionVariant.id}
                        optionVariant={optionVariant}
                        onDelete={openDeleteDialog}
                        onToggleStatus={handleToggleStatus}
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
