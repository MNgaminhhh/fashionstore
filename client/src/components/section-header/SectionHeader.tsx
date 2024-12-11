"use client";

import Link from "next/link";
import { ReactNode } from "react";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import { H2 } from "../Typography";
import { FlexBetween, FlexBox } from "../flexbox";
interface Props {
  title: string;
  icon?: ReactNode;
  seeMoreLink?: string;
}

export default function SectionHeader({ title, seeMoreLink, icon }: Props) {
  return (
    <FlexBetween mb={3}>
      <FlexBox alignItems="center" gap={1}>
        {icon ?? null}
        <H2 lineHeight={1}>{title}</H2>
      </FlexBox>

      {seeMoreLink ? (
        <Link href={seeMoreLink}>
          <FlexBox alignItems="center" color="grey.600">
            Xem nhiều hơn
            <ArrowLeft fontSize="small" color="inherit" />
          </FlexBox>
        </Link>
      ) : null}
    </FlexBetween>
  );
}
