"use client";
import Container from "@mui/material/Container";
import VendorList from "../component/vendorpage/VendorList";
import { useState } from "react";
import { Form, Formik } from "formik";
import Vendor from "../../../services/Vendor";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Pagination } from "../../../components/table";
import SearchArea from "../component/vendorpage/SearchArea";

type Props = { vendors: any; token: string };

export default function VendorView({ vendors: initialVendors, token }: Props) {
  const [vendors, setVendors] = useState(initialVendors.vendors || []);
  const [totalPages, setTotalPages] = useState(initialVendors.total_pages || 1);
  const [search, setSearch] = useState("");
  const pageSizes = [8, 16, 24, 48];
  const applyFilters = async (
    page: number,
    limit: number,
    filters = { status: "accepted", store_name: search }
  ) => {
    const response = await Vendor.findAll(token, true, limit, page, filters);
    const data = response?.data?.data?.vendors || [];
    setVendors(data);
    setTotalPages(response?.data?.data?.total_pages || 1);
  };

  return (
    <Formik
      initialValues={{ page: 1, limit: pageSizes[0] }}
      onSubmit={({ page, limit }) => {
        applyFilters(page, limit);
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form>
          <Container className="mt-2" sx={{ pb: 4 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              my={4}
              alignItems="center"
            >
              <SearchArea
                searchPlaceholder="Tìm kiếm tên cửa hàng"
                handleSearch={(searchValue) => {
                  setSearch(searchValue);
                  applyFilters(values.page, values.limit, {
                    status: "accepted",
                    store_name: searchValue,
                  });
                }}
              />

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

                <Pagination
                  count={totalPages}
                  page={values.page}
                  onChange={(_, page) => {
                    setFieldValue("page", page);
                    handleSubmit();
                  }}
                  color="primary"
                />
              </Stack>
            </Box>

            <VendorList vendors={vendors} />
          </Container>
        </Form>
      )}
    </Formik>
  );
}
