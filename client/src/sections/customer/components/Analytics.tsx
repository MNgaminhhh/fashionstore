import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import UserModel from "../../../models/User.model";
import { FlexBetween, FlexBox } from "../../../components/flexbox";
import { H3, H5, Paragraph, Small } from "../../../components/Typography";
import UserInfo from "./InforUser";

type Props = { user: UserModel };

export default function Analytics({ user }: Props) {
  return (
    <Grid container spacing={2}>
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
      <Grid item md={7} xs={12}>
        <UserInfo user={user} />
      </Grid>
    </Grid>
  );
}
