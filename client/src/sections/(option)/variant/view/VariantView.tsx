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
  Typography,
} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { Add, ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { tableHeading } from "../components/data";
import RowVariant from "../components/RowVariant";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Scrollbar from "../../../../components/scrollbar";
import WrapperPage from "../../../WrapperPage";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import DialogBox from "../../../../components/dialog/DialogBox";
import Variant from "../../../../services/Variant";
import { useParams } from "next/navigation";
import ProductModel from "../../../../models/Product.model";
import { useRouter } from "next/navigation";

type Props = { variants: any; pro: ProductModel; token: string };

const selectOptions: { [key: string]: { value: string; label: string }[] } = {
  status: [
    { value: "", label: "Tất cả" },
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Không hoạt động" },
  ],
};

export default function VariantView({
  variants: initialVariants,
  pro: initialProduct,
  token,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [variants, setVariants] = useState(
    initialVariants.productVariants || []
  );
  const [totalPages, setTotalPages] = useState(
    initialVariants.total_pages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const pageSizes = [5, 10, 20, 50];
  const nameProduct = initialProduct?.name || "...";

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openDeleteDialog = (id: string) => {
    setSelectedVariantId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedVariantId(null);
  };

  const handleDelete = async () => {
    if (selectedVariantId) {
      try {
        const response = await Variant.delete(selectedVariantId, token, true);

        if (response.data.success) {
          notifySuccess("Biến thể đã được xóa thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xóa biến thể thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa biến thể.");
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
      const response = await Variant.getVariantByProduct(
        token,
        true,
        limit,
        page,
        filters
      );
      setVariants(response?.data?.productVariants || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleStatus = async (
    id: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      const response = await Variant.updateStatus(id, newStatus, token);

      if (response.data.success) {
        setVariants((prevVariants) =>
          prevVariants.map((variant: any) =>
            variant.id === id ? { ...variant, status: newStatus } : variant
          )
        );
        notifySuccess("Trạng thái biến thể đã được cập nhật thành công.");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data.message || "")
        );
      }
    } catch (error: any) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái biến thể.");
    }
  };
  const handleBack = () => {
    router.push(`/dashboard/vendor/product`);
  };
  return (
    <WrapperPage title="Quản Lý Biến Thể" title2={`Sản Phẩm: ${nameProduct}`}>
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
          href={`/dashboard/vendor/product/${id}/variant/create`}
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
          Thêm biến thể
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
                    {variants.map((variant: any) => (
                      <RowVariant
                        key={variant.id}
                        variant={variant}
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
