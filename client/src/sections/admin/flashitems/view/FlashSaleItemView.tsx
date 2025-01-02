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
import RowFlashSaleItem from "../components/RowFlashSaleItem";
import FlashSaleItem from "../../../../services/FlashSaleItem";
import { useParams, useRouter } from "next/navigation";
import { tableHeading } from "../components/data";

type Props = {
  flashSaleItemsData: any;
  token: string;
};

export default function FlashSaleItemView({
  flashSaleItemsData,
  token,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [flashSaleItems, setFlashSaleItems] = useState<any[]>(
    flashSaleItemsData?.flashSaleItems || []
  );
  const [totalPages, setTotalPages] = useState<number>(
    flashSaleItemsData?.totalPages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentLimit, setCurrentLimit] = useState<number>(10);
  const pageSizes: number[] = [5, 10, 20, 50];

  const selectOptions: { [key: string]: { value: string; label: string }[] } = {
    show: [
      { value: "", label: "Tất cả" },
      { value: "true", label: "Hiển Thị" },
      { value: "false", label: "Không Hiển Thị" },
    ],
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    applyFilters(1, currentLimit, {
      ...searchValues,
      [field]: value,
    });
  };

  const openDeleteDialog = (id: string) => {
    setSelectedItemId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleDelete = async () => {
    if (selectedItemId) {
      try {
        const response = await FlashSaleItem.delete(selectedItemId, token);

        if (response.data.success) {
          notifySuccess("Flash Sale Item đã được xoá thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xoá Flash Sale Item thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xoá Flash Sale Item.");
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
      const formattedFilters: { [key: string]: string } = { ...filters };
      if (filters.product_name) {
        formattedFilters.productName = filters.product_name;
      }
      if (filters.show) {
        formattedFilters.show = filters.show;
      }

      const response = await FlashSaleItem.getFlashSaleItems(
        id,
        token,
        true,
        limit,
        page,
        formattedFilters
      );

      if (response.success) {
        setFlashSaleItems(response?.data?.flashSaleItems || []);
        setTotalPages(response?.data?.totalPages || 1);
      } else {
        notifyError("Có lỗi xảy ra khi tải dữ liệu.");
      }
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleShow = async (id: string, newStatus: boolean) => {
    try {
      const response = await FlashSaleItem.updateStatus(id, newStatus, token);

      if (response.data.success) {
        setFlashSaleItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, show: newStatus } : item
          )
        );
        notifySuccess("Trạng thái hiển thị đã được cập nhật thành công.");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data.message || "")
        );
      }
    } catch (error: any) {
      console.error("Error:", error);
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái Flash Sale Item.");
    }
  };
  const handleBack = () => {
    router.push("/dashboard/admin/flash-sale");
  };
  return (
    <WrapperPage title="Quản Lý Các Sản Phẩm Của Flash Sale">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          onClick={handleBack}
          color="secondary"
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{
            minHeight: 44,
            textTransform: "none",
            borderRadius: 1,
            px: 3,
          }}
        >
          Quay lại
        </Button>
        <Button
          href={`/dashboard/admin/flash-sale/${id}/flash-items/create`}
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
          Thêm Sản Phẩm Vào Flash Sale
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
                          {headCell.id === "product_name" ||
                          headCell.id === "show" ? (
                            headCell.id === "show" ? (
                              <Select
                                size="small"
                                value={searchValues[headCell.id] || ""}
                                onChange={(e) => {
                                  const value = e.target.value as string;
                                  handleSearchChange(headCell.id, value);
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
                                placeholder={`Tìm kiếm ${headCell.label}`}
                                sx={{ width: "100%" }}
                              />
                            )
                          ) : null}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flashSaleItems.length > 0 ? (
                      flashSaleItems.map((item) => (
                        <RowFlashSaleItem
                          key={item.id}
                          flashSaleItem={item}
                          onDelete={openDeleteDialog}
                          handleToggleShow={handleToggleShow}
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
                      const newLimit = e.target.value as number;
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
