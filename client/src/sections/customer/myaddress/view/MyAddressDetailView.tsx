"use client";

import { Fragment } from "react";
import Card from "@mui/material/Card";
import Place from "@mui/icons-material/Place";
import Header from "../../components/Header";
import AddressModel from "../../../../models/Address.model";
import AddressForm from "../components/AddressForm";

type Props = { address: AddressModel };

export default function AddressDetailsPageView({ address }: Props) {
  return (
    <Fragment>
      <Header
        Icon={Place}
        title="Chỉnh sửa địa chỉ"
        buttonText="Trở Về"
        href={`/my-address`}
      />
      <Card sx={{ p: 3, pt: 4 }}>
        <AddressForm address={address} />
      </Card>
    </Fragment>
  );
}
