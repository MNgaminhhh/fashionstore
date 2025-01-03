import Link from "next/link";
import Card from "@mui/material/Card";
import Rating from "@mui/material/Rating";
import Call from "@mui/icons-material/Call";
import East from "@mui/icons-material/East";
import Place from "@mui/icons-material/Place";
import { ContentWrapper, StyledAvatar, StyledIconButton } from "./styles";
import { H3, Span } from "../../../components/Typography";
import { FlexBetween, FlexBox } from "../../../components/flexbox";

export default function ShopCard(props: any) {
  const { name, rating, address, phone, coverPicture, profilePicture, slug } =
    props || {};

  return (
    <Card>
      <ContentWrapper img={coverPicture || "/assets/images/banners/cycle.png"}>
        <H3 fontWeight="600" mb={1}>
          {name}
        </H3>

        <Rating
          value={rating || 0}
          color="warn"
          size="small"
          readOnly
          className="mb-1"
        />

        <FlexBox mb={1} gap={1}>
          <Place fontSize="small" sx={{ fontSize: 17, mt: "3px" }} />
          <Span color="white">{address}</Span>
        </FlexBox>

        <FlexBox alignItems="center" gap={1}>
          <Call fontSize="small" sx={{ fontSize: 17 }} />
          <Span color="white">{phone}</Span>
        </FlexBox>
      </ContentWrapper>

      <FlexBetween pl={3} pr={1}>
        <StyledAvatar alt={name} src={profilePicture} />

        <Link href={`/shops/${slug}`}>
          <StyledIconButton>
            <East className="icon" />
          </StyledIconButton>
        </Link>
      </FlexBetween>
    </Card>
  );
}
