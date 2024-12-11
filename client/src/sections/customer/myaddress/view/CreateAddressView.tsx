"use client";

import { Fragment } from "react";
import Card from "@mui/material/Card";
import Place from "@mui/icons-material/Place";
import Header from "../../components/Header";
import AddressForm from "../components/AddressForm";
export default function CreateAddressView() {
  return (
    <Fragment>
      <Header
        Icon={Place}
        title="Thêm địa chỉ"
        buttonText="Trở Về"
        href={`/my-address`}
      />
      <Card sx={{ p: 3, pt: 4 }}>
        <AddressForm />
      </Card>
    </Fragment>
  );
}
