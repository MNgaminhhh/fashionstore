"use client";

import { useState, useEffect } from "react";
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
import Vendor from "../../../../services/Vendor";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import { tableHeading } from "../components/data";
import { Box, Divider } from "@mui/material";
import { notifyError } from "../../../../utils/ToastNotification";

type Props = { vendors: any; token: string };

export default function VendorsView({ vendors: initialVendors, token }: Props) {
  const [vendors, setVendors] = useState(initialVendors.vendors || []);
  const [totalPages, setTotalPages] = useState(initialVendors.total_pages || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const pageSizes = [5, 10, 20, 50];

  const applyFilters = async (
    currentPage: number,
    currentLimit: number,
    filters: { [key: string]: string }
  ) => {
    try {
      const response = await Vendor.findAll(
        token,
        true,
        currentLimit,
        currentPage,
        filters
      );
      const data = response?.data?.data?.vendors || [];
      setVendors(data);
      setTotalPages(response?.data?.data?.total_pages || 1);
    } catch (error: any) {
      notifyError(
        `Lỗi khi lấy dữ liệu: ${
          error?.message || "Không thể kết nối với server"
        }`
      );
    }
  };
  useEffect(() => {
    applyFilters(page, limit, searchValues);
  }, [page, limit, searchValues]);

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(1);
  };

  return (
    <WrapperPage title="Quản Lý Các Nhà Bán Hàng">
      <Card>
        <Box sx={{ maxHeight: 900, overflow: "hidden" }}>
          <TableContainer component={Scrollbar}>
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
                      align={
                        headCell.align as
                          | "left"
                          | "center"
                          | "right"
                          | "justify"
                          | "inherit"
                      }
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
                      align={
                        headCell.align as
                          | "left"
                          | "center"
                          | "right"
                          | "justify"
                          | "inherit"
                      }
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
                            }}
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>Vui lòng chọn giá trị</em>
                            </MenuItem>
                            <MenuItem value="accepted">Hoạt động</MenuItem>
                            <MenuItem value="pending">Đang chờ duyệt</MenuItem>
                            <MenuItem value="rejected">Từ chối</MenuItem>
                          </Select>
                        ) : (
                          <TextField
                            size="small"
                            value={searchValues[headCell.id] || ""}
                            onChange={(e) =>
                              handleSearchChange(headCell.id, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                applyFilters(page, limit, searchValues);
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
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <RowVendors vendor={vendor} key={vendor.id} />
                  ))
                ) : (
                  <TableRow>
                    <StyledTableCell
                      colSpan={tableHeading.length}
                      align="center"
                    >
                      Không có dữ liệu
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider />
        <Box display="flex" justifyContent="flex-end" my={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value as number);
                setPage(1);
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
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage);
              }}
            />
          </Stack>
        </Box>
      </Card>
    </WrapperPage>
  );
}
