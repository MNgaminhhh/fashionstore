import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FlexBox } from "../../../components/flexbox";
import { Small, Span } from "../../../components/Typography";
import UserModel from "../../../models/User.model";
type Props = { user: UserModel };
import dayjs from "dayjs";
export default function UserInfo({ user }: Props) {
  const downMd = useMediaQuery("(max-width: 600px)");

  return (
    <Card
      sx={{
        mt: 3,
        display: "flex",
        flexWrap: "wrap",
        p: "1rem 1.5rem",
        alignItems: "center",
        justifyContent: "space-between",
        ...(downMd && {
          alignItems: "start",
          flexDirection: "column",
          justifyContent: "flex-start",
        }),
      }}
    >
      <TableRowItem title="Họ và Tên" value={user.full_name} />
      <TableRowItem title="Email" value={user.email} />
      <TableRowItem
        title="Ngày Tháng Năm Sinh"
        value={user.dob ? dayjs(user.dob).format("DD/MM/YYYY") : ""}
      />
    </Card>
  );
}

function TableRowItem({ title, value }: { title: string; value: string }) {
  return (
    <FlexBox
      flexDirection="column"
      p={1.5}
      sx={{ minWidth: 120, alignItems: "flex-start" }}
    >
      <Small
        color="grey.700"
        mb={0.5}
        fontWeight={600}
        sx={{ textAlign: "left", width: "100%" }}
      >
        {title}
      </Small>
      <Span
        sx={{
          textAlign: "left",
          width: "100%",
        }}
      >
        {value}
      </Span>
    </FlexBox>
  );
}
