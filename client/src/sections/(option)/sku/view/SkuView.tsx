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
import { Add, ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import DialogBox from "../../../../components/dialog/DialogBox";
import { tableHeading } from "../components/data";
import RowSku from "../components/RowSku";
import Skus from "../../../../services/Skus";
import ProductModel from "../../../../models/Product.model";
import { useParams, useRouter } from "next/navigation";

type Props = { skus: any; pro: ProductModel; token: string };

const selectOptions: { [key: string]: { value: string; label: string }[] } = {
  in_stock: [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Còn hàng" },
    { value: "false", label: "Hết hàng" },
  ],
};

export default function SkuView({
  skus: initialSkus,
  pro: initialProduct,
  token,
}: Props) {
  console.log(initialSkus);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [skus, setSkus] = useState(initialSkus.skus || []);
  const [totalPages, setTotalPages] = useState(initialSkus.totalPage || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const pageSizes = [5, 10, 20, 50];
  const nameProduct = initialProduct?.name || "...";
  const productId = Array.isArray(id) ? id[0] : id;

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openDeleteDialog = (id: string) => {
    setSelectedSkuId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedSkuId(null);
  };

  const handleDelete = async () => {
    if (selectedSkuId) {
      try {
        const response = await Skus.delete(selectedSkuId, token, true);

        if (response.data.success) {
          notifySuccess("SKU đã được xóa thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xóa SKU thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa SKU.");
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
      const response = await Skus.getByVendor(
        token,
        true,
        limit,
        page,
        filters
      );
      setSkus(response?.data?.skus || []);
      setTotalPages(response?.data?.totalPage || 1);
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };
  const handleBack = () => {
    router.push(`/dashboard/vendor/product`);
  };
  const handleToggleStatus = async (
    id: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      const response = await Skus.updateStatus(id, newStatus, token, true);

      if (response?.data?.success || response?.success) {
        setSkus((prevVariants) =>
          prevVariants.map((optionVariant) =>
            optionVariant.id === id
              ? { ...optionVariant, status: newStatus }
              : optionVariant
          )
        );
        notifySuccess("Trạng thái SKU đã được cập nhật thành công.");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data.message || "")
        );
      }
    } catch (error: any) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái SKU");
    }
  };
  return (
    <WrapperPage title="Quản Lý SKU" title2={`Sản phẩm: ${nameProduct}`}>
      <Box display="flex" justifyContent="space-between" mb={2}>
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
          href={`/dashboard/vendor/product/${productId}/sku/create`}
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
          Thêm SKU
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
                          headCell.id !== "variants" ? (
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
                    {skus.map((sku: any, index: number) => (
                      <RowSku
                        key={index}
                        sku={sku}
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
