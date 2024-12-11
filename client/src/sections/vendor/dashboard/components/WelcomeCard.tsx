"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { H5 } from "../../../../components/Typography";

export default function WelcomeCard() {
  return (
    <Card
      sx={{
        p: 2,
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <H5 color="info.main" mb={0.5}>
        Xin chào, nhà bán hàng đã đến với trang quản trị
      </H5>
    </Card>
  );
}
