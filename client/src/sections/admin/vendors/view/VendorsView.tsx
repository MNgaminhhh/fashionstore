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
import RowVendors from "../components/RowVendors";
import WrapperPage from "../../../WrapperPage";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import Vendor from "../../../../services/Vendor";
import { StyledTableCell } from "../../../styles";
import { StyledPagination } from "../../../../components/table/styles";
import { tableHeading } from "../components/data";

type Props = { vendors: any[]; token: string };
export default function VendorsView({ vendors: initialVendors, token }: Props) {
  const [vendors, setVendors] = useState(initialVendors.vendors || []);
  const [totalPages, setTotalPages] = useState(initialVendors.total_pages || 1);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  );

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = async (page: number, limit: number) => {
    try {
      const response = await Vendor.findAll(token, true, limit, page);
      const data = response?.data?.data?.vendors || [];
      setVendors(data);
      setTotalPages(response?.data?.data?.total_pages);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  };

  return (
    <WrapperPage title="Quản Lý Các Nhà Bán Hàng">
      <Card>
        <Formik
          initialValues={{
            page: 1,
            limit: 2,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await applyFilters(values.page, values.limit);
            setSubmitting(false);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 900 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "grey.200" }}>
                      <TableRow>
                        {tableHeading.map((headCell) => (
                          <StyledTableCell
                            key={headCell.id}
                            align={headCell.align}
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
                          >
                            {headCell.id !== "action" && (
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
                            )}
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
              <Stack alignItems="center" my={4}>
                <StyledPagination
                  count={totalPages}
                  page={values.page}
                  onChange={(_, page) => {
                    setFieldValue("page", page);
                    handleSubmit();
                  }}
                />
              </Stack>
            </>
          )}
        </Formik>
      </Card>
    </WrapperPage>
  );
}
