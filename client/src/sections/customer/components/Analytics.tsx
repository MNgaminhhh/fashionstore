import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import UserModel from "../../../models/User.model";
import { FlexBetween, FlexBox } from "../../../components/flexbox";
import { H3, H5, Paragraph, Small } from "../../../components/Typography";

type Props = { user: UserModel };

export default function Analytics({ user }: Props) {
  const LIST_ORDER = [
    { title: "00", subtitle: "Tất cả đơn hàng" },
    { title: "00", subtitle: "Chờ thanh toán" },
    { title: "00", subtitle: "Chờ vận chuyển" },
    { title: "00", subtitle: "Chờ giao hàng" },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item md={5} xs={12}>
        <Card
          sx={{
            gap: 2,
            height: "100%",
            display: "flex",
            p: "1.5rem",
            alignItems: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Avatar
            alt={user.full_name}
            src={user.avt}
            sx={{
              height: 80,
              width: 80,
              border: "2px solid",
              borderColor: "primary.main",
            }}
          />

          <FlexBetween flexWrap="wrap" flex={1} ml={2}>
            <div>
              <H5 sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {user.full_name || "N/A"}
              </H5>
              <FlexBox alignItems="center" gap={1}>
                <Paragraph color="grey.600" fontSize="0.875rem">
                  {user.email || ""}
                </Paragraph>
              </FlexBox>
            </div>
          </FlexBetween>
        </Card>
      </Grid>
      <Grid item container spacing={2} md={7} xs={12}>
        {LIST_ORDER.map((item) => (
          <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                p: "1.25rem",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <H3
                color="primary.main"
                my={0}
                fontWeight={700}
                sx={{ fontSize: "1.75rem" }}
              >
                {item.title}
              </H3>
              <Small
                color="grey.700"
                textAlign="center"
                sx={{ fontSize: "0.875rem", fontWeight: "500" }}
              >
                {item.subtitle}
              </Small>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
