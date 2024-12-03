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
import FlashSale from "../../../../services/FlashSale";
import { tableHeading } from "../components/data";
import RowFlashSale from "../components/RowFlashSale";
import FlashSaleModel from "../../../../models/FlashSale.model";

type Props = {
  flashSales: any;
  token: string;
};

export default function FlashSaleView({
  flashSales: initialFlashSales,
  token,
}: Props) {
  console.log(initialFlashSales);
  const [flashSales, setFlashSales] = useState(initialFlashSales || []);
  const [totalPages, setTotalPages] = useState(
    initialFlashSales.total_pages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFlashSaleId, setSelectedFlashSaleId] = useState<string | null>(
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
    setSelectedFlashSaleId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedFlashSaleId(null);
  };

  const handleDelete = async () => {
    if (selectedFlashSaleId) {
      try {
        const response = await FlashSale.delete(selectedFlashSaleId, token);

        if (response.data.success) {
          notifySuccess("Flash sale đã được xóa thành công.");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xóa flash sale thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa flash sale.");
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
      const response = await FlashSale.getFlashSale(
        token,
        limit,
        page,
        filters
      );
      if (response.data.success) {
        setFlashSales(response.data.data || []);
        setTotalPages(response.data.total_pages || 1);
      } else {
        notifyError("Có lỗi xảy ra khi tải dữ liệu.");
      }
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  return (
    <WrapperPage title="Quản Lý Flash Sale">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          href={`/dashboard/vendor/flash-sale/create`}
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
          Thêm Flash Sale
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
                            <TextField
                              size="small"
                              type={
                                headCell.id.includes("date") ? "date" : "text"
                              }
                              InputLabelProps={
                                headCell.id.includes("date")
                                  ? { shrink: true }
                                  : undefined
                              }
                              value={searchValues[headCell.id] || ""}
                              onChange={(e) => {
                                handleSearchChange(headCell.id, e.target.value);
                                applyFilters(values.page, values.limit, {
                                  ...searchValues,
                                  [headCell.id]: e.target.value,
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSubmit();
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
                    {flashSales.map((flashSale: FlashSaleModel) => (
                      <RowFlashSale
                        key={flashSale.ID}
                        flashSale={flashSale}
                        onDelete={openDeleteDialog}
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
