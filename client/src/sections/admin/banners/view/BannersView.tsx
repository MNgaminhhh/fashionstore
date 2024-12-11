"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Scrollbar from "../../../../components/scrollbar";
import WrapperPage from "../../../WrapperPage";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import { Box, Button, Divider, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import { tableHeading } from "../components/data";
import RowBanner from "../components/RowBanners";
import Banner from "../../../../services/Banner";
import DialogBox from "../../../../components/dialog/DialogBox";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";

interface Props {
  banners: any[];
  token: string;
}

export default function BannersView({ banners: initialBanners, token }: Props) {
  const [banners, setBanners] = useState(initialBanners.banners || []);
  const [totalPages, setTotalPages] = useState(initialBanners.total_pages || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
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
    filters: { [key: string]: string },
    page: number,
    limit: number
  ) => {
    const response = await Banner.getTableFilter(
      token,
      true,
      limit,
      page,
      filters
    );
    const data = response?.data?.data?.banners || [];
    const totalPage = response?.data?.data?.total_pages || 1;
    setBanners(data);
    setTotalPages(totalPage);
  };

  const openDeleteDialog = (id: string) => {
    setSelectedBannerId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedBannerId(null);
  };

  const handleDelete = async () => {
    if (selectedBannerId) {
      try {
        await Banner.delete(token, true, selectedBannerId);
        notifySuccess("Banner đã được xóa thành công");
        await applyFilters(searchValues, currentPage, currentLimit);
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xóa banner");
      } finally {
        closeDeleteDialog();
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const updatedStatus = currentStatus ? 1 : 0;
      await Banner.update(id, { status: updatedStatus }, token, true);

      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === id ? { ...banner, status: updatedStatus } : banner
        )
      );
      notifySuccess("Trạng thái banner đã được cập nhật thành công");
    } catch (error) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái banner");
    }
  };

  return (
    <WrapperPage title="Danh Sách Banner">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          href="/dashboard/admin/banners/create"
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
          Thêm Banner
        </Button>
      </Box>

      <Card>
        <Formik
          initialValues={{
            page: currentPage,
            limit: currentLimit,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setCurrentPage(values.page);
            setCurrentLimit(values.limit);
            await applyFilters(searchValues, values.page, values.limit);
            setSubmitting(false);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <TableContainer
                sx={{
                  maxHeight: 900,
                }}
                component={Scrollbar}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow
                      sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 3,
                        backgroundColor: "grey.200",
                        height: 56,
                      }}
                    >
                      {tableHeading.map((headCell) => (
                        <StyledTableCell
                          key={headCell.id}
                          align={headCell.align}
                          width={headCell.width}
                          sx={{ backgroundColor: "grey.200" }}
                        >
                          {headCell.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                    <TableRow
                      sx={{
                        position: "sticky",
                        top: 56,
                        zIndex: 2,
                        backgroundColor: "grey.100",
                        height: 56,
                      }}
                    >
                      {tableHeading.map((headCell) => (
                        <StyledTableCell
                          key={headCell.id}
                          align={headCell.align}
                          width={headCell.width}
                          sx={{ backgroundColor: "grey.100" }}
                        >
                          {headCell.id !== "action" &&
                          headCell.id !== "banner_image" ? (
                            headCell.id === "status" ? (
                              <Select
                                fullWidth
                                size="small"
                                value={searchValues[headCell.id] || ""}
                                onChange={(e) => {
                                  const newValue = e.target.value as string;
                                  handleSearchChange(headCell.id, newValue);
                                  applyFilters(
                                    {
                                      ...searchValues,
                                      [headCell.id]: newValue,
                                    },
                                    values.page,
                                    values.limit
                                  );
                                }}
                              >
                                <MenuItem value="">
                                  Vui lòng chọn giá trị
                                </MenuItem>
                                <MenuItem value="1">Hiển thị</MenuItem>
                                <MenuItem value="0">Ẩn</MenuItem>
                              </Select>
                            ) : (
                              <TextField
                                size="small"
                                value={searchValues[headCell.id] || ""}
                                onChange={(e) => {
                                  handleSearchChange(
                                    headCell.id,
                                    e.target.value
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    applyFilters(
                                      searchValues,
                                      values.page,
                                      values.limit
                                    );
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
                    {banners.map((banner) => (
                      <RowBanner
                        banner={banner}
                        key={banner.id}
                        tableHeading={tableHeading}
                        onDelete={() => {
                          openDeleteDialog(banner.id);
                        }}
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
            </Form>
          )}
        </Formik>
      </Card>
      <DialogBox
        open={dialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={() => handleDelete(currentPage, currentLimit)}
      />
    </WrapperPage>
  );
}
