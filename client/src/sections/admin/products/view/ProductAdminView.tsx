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
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Products from "../../../../services/Products";
import { tableHeading } from "../components/data";
import RowProductAdmin from "../components/RowProductAdmin";

type Props = { products: any; token: string };
const selectOptions: { [key: string]: { value: string; label: string }[] } = {
  is_approved: [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Đã duyệt" },
    { value: "false", label: "Chưa duyệt" },
  ],
  status: [
    { value: "", label: "Tất cả" },
    { value: "active", label: "Hiển thị" },
    { value: "inactive", label: "Ẩn" },
  ],
  product_type: [
    { value: "", label: "Tất cả" },
    { value: "none", label: "Không có" },
    { value: "best_product", label: "Sản phẩm tốt nhất" },
    { value: "featured_product", label: "Sản phẩm nổi bật" },
    { value: "top_product", label: "Sản phẩm hàng đầu" },
  ],
};
export default function ProductAdminView({
  products: initialProducts,
  token,
}: Props) {
  const [products, setProducts] = useState(initialProducts?.products || []);
  const [totalPages, setTotalPages] = useState(
    initialProducts?.total_pages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
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

  const applyFilters = async (
    page: number,
    limit: number,
    filters = searchValues
  ) => {
    try {
      const response = await Products.getAllProduct(limit, page, filters);
      setProducts(response?.data?.data?.products || []);
      setTotalPages(response?.data?.data?.total_pages || 1);
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleApproval = async (id: string, currentApproval: any) => {
    try {
      const newStatus = !!currentApproval;
      const response = await Products.updateApproval(
        id,
        newStatus,
        token,
        true
      );

      if (response.data.success) {
        notifySuccess(
          "Trạng thái phê duyệt sản phẩm đã được cập nhật thành công."
        );
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.data.message || "")
        );
      }
    } catch (error) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái phê duyệt.");
    }
  };

  return (
    <WrapperPage title="Danh Sách Duyệt Sản Phẩm">
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
                          {headCell.id !== "action" &&
                          headCell.id !== "images" ? (
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
                    {products.map((product) => (
                      <RowProductAdmin
                        key={product.id}
                        product={product}
                        onToggleApproval={handleToggleApproval}
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
    </WrapperPage>
  );
}
