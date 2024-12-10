import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Call from "@mui/icons-material/Call";
import Place from "@mui/icons-material/Place";
import { FlexBetween, FlexBox } from "../../../components/flexbox";
import { H3, Small, Span } from "../../../components/Typography";
interface Props {
  name: string;
  phone: string;
  address: string;
  coverPicture: string;
  profilePicture: string;
}

export default function ShopIntroCard(props: Props) {
  const { name, phone, address, coverPicture, profilePicture } = props || {};
  return (
    <Card sx={{ mb: 4, pb: 2.5 }}>
      <Box
        height="202px"
        sx={{ background: `url(${coverPicture}) center/cover` }}
      />

      <Box display="flex" mt={-8} px={3.75} flexWrap="wrap">
        <Avatar
          alt={name}
          src={profilePicture}
          sx={{
            mr: "37px",
            width: "120px",
            height: "120px",
            border: "4px solid",
            borderColor: "grey.100",
          }}
        />

        <Box
          sx={{
            flex: "1 1 0",
            minWidth: "250px",
            "@media only screen and (max-width: 500px)": { marginLeft: 0 },
          }}
        >
          <FlexBetween flexWrap="wrap" mt={0.375} mb={3}>
            <Box
              my={1}
              p="4px 16px"
              borderRadius="4px"
              display="inline-block"
              bgcolor="secondary.main"
            >
              <H3 fontWeight="600" color="grey.100">
                {name}
              </H3>
            </Box>
          </FlexBetween>

          <FlexBetween flexWrap="wrap">
            <div>
              <Box
                display="flex"
                color="grey.600"
                gap={1}
                mb={1}
                maxWidth={270}
              >
                <Place fontSize="small" sx={{ fontSize: 18, mt: "3px" }} />
                <Span color="grey.600">{address}</Span>
              </Box>

              <Box display="flex" color="grey.600" gap={1} mb={1}>
                <Call fontSize="small" sx={{ fontSize: 18, mt: "2px" }} />
                <Span color="grey.600">{phone}</Span>
              </Box>
            </div>
          </FlexBetween>
        </Box>
      </Box>
    </Card>
  );
}
