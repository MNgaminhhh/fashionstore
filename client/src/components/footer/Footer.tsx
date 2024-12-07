import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AboutLinks from "./components/AboutLinks";
import { Paragraph } from "../Typography";
import SocialLinks from "./components/SociaLinks";
import CopyYear from "./components/CopyYear";
import { Email, LocationOn, Phone } from "@mui/icons-material";
import LogoSection from "./components/Logo";

export default function Footer() {
  return (
    <Box component="footer" bgcolor="grey.900">
      <Box
        component={Container}
        color="white"
        overflow="hidden"
        py={{ sm: 1, xs: 4 }}
      >
        <Grid container spacing={3} mt={3}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <LogoSection />
            <Paragraph py={0.6} color="grey.500">
              <LocationOn sx={{ mr: 1 }} /> Võ Văn Ngân, Thủ Đức, TP.HCM
            </Paragraph>

            <Paragraph py={0.6} color="grey.500">
              <Email sx={{ mr: 1 }} /> zxcvbnm@gmail.com
            </Paragraph>

            <Paragraph py={0.6} mb={2} color="grey.500">
              <Phone sx={{ mr: 1 }} /> +84 123 456 123
            </Paragraph>
          </Grid>

          <Grid item lg={2} md={6} sm={6} xs={12}>
            <AboutLinks />
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={12}>
            <AboutLinks />
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={12}>
            <SocialLinks />
          </Grid>
        </Grid>
      </Box>
      <CopyYear></CopyYear>
    </Box>
  );
}
