"use client";

import { useState } from "react";
import { Formik } from "formik";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Scrollbar from "../../../../components/scrollbar";
import RowVendors from "../components/RowVendors";
import WrapperPage from "../../../WrapperPage";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import Vendor from "../../../../services/Vendor";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import { tableHeading } from "../components/data";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";

type Props = { vendors: any[]; token: string };

export default function VendorsView({ vendors: initialVendors, token }: Props) {
  const [vendors, setVendors] = useState(initialVendors.vendors || []);
  const [totalPages, setTotalPages] = useState(initialVendors.total_pages || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
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
    filters: Filters = searchValues
  ) => {
    const response = await Vendor.findAll(token, true, limit, page, filters);
    const data = response?.data?.data?.vendors || [];
    setVendors(data);
    setTotalPages(response?.data?.data?.total_pages);
  };

  return (
    <WrapperPage title="Quản Lý Các Nhà Bán Hàng">
      <Button
        href="/admin/vendor/add"
        color="info"
        variant="contained"
        startIcon={<Add />}
        LinkComponent={Link}
        sx={{ minHeight: 44 }}
      >
        Thêm Nhà Bán Hàng
      </Button>
      <Card>
        <Formik
          initialValues={{
            page: 1,
            limit: 10,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await applyFilters(values.page, values.limit, searchValues);
            setSubmitting(false);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <>
              <Scrollbar sx={{ maxHeight: 800, width: "100%" }}>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
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
                          zIndex: 1,
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
                            {headCell.id !== "action" ? (
                              headCell.id === "status" ? (
                                <Select
                                  fullWidth
                                  size="small"
                                  value={searchValues[headCell.id] || ""}
                                  onChange={(e) => {
                                    handleSearchChange(
                                      headCell.id,
                                      e.target.value as string
                                    );
                                    applyFilters(values.page, values.limit, {
                                      ...searchValues,
                                      [headCell.id]: e.target.value as string,
                                    });
                                  }}
                                >
                                  <MenuItem value="accepted">
                                    Hoạt động
                                  </MenuItem>
                                  <MenuItem value="pending">
                                    Đang chờ duyệt
                                  </MenuItem>
                                  <MenuItem value="rejected">
                                    Bị từ chối
                                  </MenuItem>
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
                                      applyFilters(
                                        values.page,
                                        values.limit,
                                        searchValues
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
                      {vendors.map((vendor) => (
                        <RowVendors
                          vendor={vendor}
                          key={vendor.id}
                          tableHeading={tableHeading}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

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
