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
import RowFlashSale from "../components/RowFlashSale";
import FlashSaleModel from "../../../../models/FlashSale.model";
import FlashSale from "../../../../services/FlashSale";
import dayjs from "dayjs";
import { tableHeading } from "../components/data";

type Props = {
  flashSales: any;
  token: string;
};

export default function FlashSaleView({
  flashSales: initialFlashSales,
  token,
}: Props) {
  const [flashSales, setFlashSales] = useState<FlashSaleModel[]>(
    initialFlashSales?.flashSales || []
  );
  const [totalPages, setTotalPages] = useState<number>(
    initialFlashSales?.totalPages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedFlashSaleId, setSelectedFlashSaleId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentLimit, setCurrentLimit] = useState<number>(10);
  const pageSizes: number[] = [5, 10, 20, 50];

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
    filters: { [key: string]: string } = searchValues
  ) => {
    try {
      const formattedFilters: { [key: string]: string } = { ...filters };

      if (filters.startDate) {
        formattedFilters.startDate = dayjs(filters.startDate).format(
          "DD-MM-YYYY"
        );
      }

      if (filters.endDate) {
        formattedFilters.endDate = dayjs(filters.endDate).format("DD-MM-YYYY");
      }

      const response = await FlashSale.getFlashSale(
        token,
        true,
        limit,
        page,
        formattedFilters
      );
      if (response.success) {
        setFlashSales(response?.data?.flashSales || []);
        setTotalPages(response?.data?.totalPages || 1);
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
          href={`/dashboard/admin/flash-sale/create`}
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
                          {headCell.id === "startDate" ||
                          headCell.id === "endDate" ? (
                            <TextField
                              size="small"
                              type="date"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={searchValues[headCell.id] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleSearchChange(headCell.id, value);
                                applyFilters(values.page, values.limit, {
                                  ...searchValues,
                                  [headCell.id]: value,
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
