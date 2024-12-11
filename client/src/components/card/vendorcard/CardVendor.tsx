"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import {
  ContentWrapper,
  ImageWrapper,
  StyledCard,
} from "../productcard1/styles";
import BaseImage from "../../BaseImage";
import { Span } from "../../Typography";
import { Typography } from "@mui/material";

type Props = {
  id: string;
  storeName: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  banner: string;
  description: string;
};

export default function CardVendor({
  id,
  storeName,
  address,
  banner,
  description,
}: Props) {
  const shortDescription =
    description.length > 90 ? description.slice(0, 90) + "..." : description;

  return (
    <StyledCard
      sx={{
        transition: "transform 0.3s, box-shadow 0.3s",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <ImageWrapper>
        <Link href={`/public/vendor/${storeName}`}>
          <BaseImage
            priority
            src={banner}
            width={500}
            height={300}
            alt={storeName}
          />
        </Link>
      </ImageWrapper>

      <ContentWrapper sx={{ padding: 2 }}>
        <Box flex="1 1 0" minWidth="0px" mr={1}>
          <Link href={`/public/vendor/${storeName}`}>
            <Span
              fontSize="20px"
              fontWeight={600}
              color="primary.main"
              display="block"
            >
              {storeName}
            </Span>
          </Link>

          <Span color="grey.600" display="block" mt={1}>
            Địa chỉ: {address}
          </Span>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={1}
            sx={{ lineHeight: "1.5", minHeight: "60px" }}
          >
            {shortDescription}
          </Typography>
        </Box>
      </ContentWrapper>
    </StyledCard>
  );
}
