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
import { notifyError, notifySuccess } from "../../../../utils/ToastNotification";
import DialogBox from "../../../../components/dialog/DialogBox";
import Products from "../../../../services/Products";
import { tableHeading } from "../components/data";
import RowProduct from "../components/RowProduct";
import RowProductAdmin from "../components/RowProductAdmin";

type Props = { products: any[]; token: string };

export default function ProductAdminView({ products: initialProducts, token }: Props) {
    const [products, setProducts] = useState(initialProducts.products || []);
    const [totalPages, setTotalPages] = useState(initialProducts.total_pages || 1);
    const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
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
        setSelectedProductId(id);
        setDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDialogOpen(false);
        setSelectedProductId(null);
    };

    const handleDelete = async () => {
        if (selectedProductId) {
            try {
                const response = await Products.delete(token, true, selectedProductId);

                if (response.data.success) {
                    notifySuccess("Sản phẩm đã được xóa thành công.");
                    await applyFilters(currentPage, currentLimit);
                } else {
                    notifyError(
                        "Xóa sản phẩm thất bại: " + (response.data.message || "Vui lòng thử lại.")
                    );
                }
            } catch (error) {
                notifyError("Có lỗi xảy ra khi xóa sản phẩm.");
            } finally {
                closeDeleteDialog();
            }
        }
    };

    const applyFilters = async (page: number, limit: number, filters = searchValues) => {
        try {
            const response = await Products.findAll(token, true, limit, page, filters);
            setProducts(response?.data?.products || []);
            setTotalPages(response?.data?.total_pages || 1);
        } catch {
            notifyError("Có lỗi xảy ra khi tải dữ liệu.");
        }
    };

    const handleToggleApproval = async (id: string, currentApproval: number) => {
        try {
            const updatedApproval = currentApproval === 1 ? 0 : 1;
            const response = await Products.update(
                id,
                { is_approved: updatedApproval },
                token,
                true
            );

            if (response.data.success) {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === id
                            ? { ...product, is_approved: updatedApproval }
                            : product
                    )
                );
                notifySuccess("Trạng thái phê duyệt sản phẩm đã được cập nhật thành công.");
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
        <WrapperPage title="Danh Sách Sản Phẩm">
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
                                                <StyledTableCell key={headCell.id} align={headCell.align}>
                                                    {headCell.label}
                                                </StyledTableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow>
                                            {tableHeading.map((headCell) => (
                                                <StyledTableCell key={headCell.id} align={headCell.align}>
                                                    {headCell.id !== "action" ? (
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
                                                </StyledTableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((product) => (
                                            <RowProductAdmin
                                                key={product.id}
                                                product={product}
                                                tableHeading={tableHeading}
                                                onDelete={openDeleteDialog}
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
            <DialogBox
                open={dialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDelete}
            />
        </WrapperPage>
    );
}
