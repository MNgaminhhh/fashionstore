"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FlexBox, FlexCenterRow } from "../../components/flexbox";

export default function NotFoundPageView() {
  const router = useRouter();

  return (
    <FlexCenterRow px={2} minHeight="100vh" flexDirection="column">
      <Box maxWidth={320} width="100%" mb={3}>
        <Image
          alt="Not Found!"
          src={require("../../../public/assets/illustrations/404.svg")}
          style={{ width: "100%", height: "auto" }}
        />
      </Box>

      <FlexBox flexWrap="wrap" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
        >
          Trở về trang chủ
        </Button>
      </FlexBox>
    </FlexCenterRow>
  );
}
