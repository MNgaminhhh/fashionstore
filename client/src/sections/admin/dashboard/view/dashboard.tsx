import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import WelcomeCard from "../components/WelcomeCard";

export default function AdminDashboardPageView() {
  return (
    <Container maxWidth="xl" className="pt-2 py-2">
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <WelcomeCard />
        </Grid>
      </Grid>
    </Container>
  );
}
