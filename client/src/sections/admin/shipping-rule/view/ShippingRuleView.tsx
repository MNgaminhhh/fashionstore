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
  Grid,
  FormControl,
  InputLabel,
} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { Add } from "@mui/icons-material";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Scrollbar from "../../../../components/scrollbar";
import WrapperPage from "../../../WrapperPage";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import DialogBox from "../../../../components/dialog/DialogBox";
import { useRouter } from "next/navigation";
import { tableHeading } from "../components/data";
import RowShippingRule from "../components/RowShippingRule";
import ShippingRuleService from "../../../../services/ShippingRule";

type ShippingRuleType = {
  id: string;
  name: string;
  min_order_cost: number;
  price: number;
  status: boolean;
  created_at: string;
  updated_at: string;
};

type Props = {
  shippingRulesData: {
    limit: number;
    page: number;
    shippingRules: ShippingRuleType[];
    totalPages: number;
    totalResults: number;
  };
  token: string;
};

export default function ShippingRuleView({ shippingRulesData, token }: Props) {
  const router = useRouter();
  const [shippingRules, setShippingRules] = useState<ShippingRuleType[]>(
    shippingRulesData?.shippingRules || []
  );
  const [totalPages, setTotalPages] = useState<number>(
    shippingRulesData?.totalPages || 1
  );
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    shippingRulesData.page || 1
  );
  const [currentLimit, setCurrentLimit] = useState<number>(
    shippingRulesData.limit || 10
  );
  const pageSizes: number[] = [5, 10, 20, 50];

  const selectOptions: { [key: string]: { value: string; label: string }[] } = {
    status: [
      { value: "", label: "Tất cả" },
      { value: "true", label: "Hiển thị" },
      { value: "false", label: "Ẩn" },
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
    setSelectedRuleId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedRuleId(null);
  };

  const handleDelete = async () => {
    if (selectedRuleId) {
      try {
        const response = await ShippingRuleService.delete(
          selectedRuleId,
          token
        );
        if (response?.data?.success) {
          notifySuccess("Shipping Rule đã được xoá thành công!");
          await applyFilters(currentPage, currentLimit);
        } else {
          notifyError(
            "Xoá Shipping Rule thất bại: " +
              (response.data.message || "Vui lòng thử lại!")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi xoá Shipping Rule!");
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
      if (filters.name) {
        formattedFilters.name = filters.name;
      }
      if (filters.minOrderCost) {
        formattedFilters.minOrderCost = filters.minOrderCost;
      }
      if (filters.status) {
        formattedFilters.status = filters.status;
      }

      const response = await ShippingRuleService.getAllShippingRule(
        token,
        true,
        limit,
        page,
        formattedFilters
      );
      if (response?.success) {
        setShippingRules(response?.data?.shippingRules || []);
        setTotalPages(response?.data?.totalPages || 1);
      } else {
        notifyError("Có lỗi xảy ra khi tải dữ liệu.");
      }
    } catch {
      notifyError("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      const response = await ShippingRuleService.updateStatus(
        id,
        newStatus,
        token
      );

      if (response?.data.success) {
        setShippingRules((prevRules) =>
          prevRules.map((rule) =>
            rule.id === id ? { ...rule, status: newStatus } : rule
          )
        );
        notifySuccess("Trạng thái đã được cập nhật thành công.");
      } else {
        notifyError(
          "Cập nhật trạng thái thất bại: " + (response.message || "")
        );
      }
    } catch (error: any) {
      notifyError("Có lỗi xảy ra khi cập nhật trạng thái Shipping Rule.");
    }
  };

  const handleAddShippingRule = () => {
    router.push("/dashboard/admin/shipping-rule/create");
  };

  return (
    <WrapperPage title="Danh Sách Quy Tắc Vận Chuyển">
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          onClick={handleAddShippingRule}
          color="primary"
          variant="contained"
          startIcon={<Add />}
          sx={{
            minHeight: 44,
            textTransform: "none",
            borderRadius: 1,
            px: 3,
          }}
        >
          Thêm Quy Tắc Vận Chuyển
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
                          {["name", "minOrderCost", "price", "status"].includes(
                            headCell.id
                          ) ? (
                            headCell.id === "status" ? (
                              <FormControl size="small" sx={{ width: "100%" }}>
                                <Select
                                  value={searchValues[headCell.id] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value as string;
                                    handleSearchChange(headCell.id, value);
                                  }}
                                  displayEmpty
                                >
                                  {selectOptions[headCell.id]?.map((option) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
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
                    {shippingRules.length > 0 ? (
                      shippingRules.map((rule) => (
                        <RowShippingRule
                          key={rule.id}
                          shippingRule={rule}
                          onDelete={openDeleteDialog}
                          onToggleStatus={handleToggleStatus}
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
                      const newLimit = Number(e.target.value);
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
