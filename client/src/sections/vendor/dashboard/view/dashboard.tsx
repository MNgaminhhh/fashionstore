"use client";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import WelcomeCard from "../components/WelcomeCard";
import SalesChart from "../components/SalesChart";

export default function DashboardPageView() {
  return (
    <Container maxWidth="xl" className="pt-2 py-2">
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <WelcomeCard />
        </Grid>
      </Grid>
      <SalesChart />
    </Container>
  );
}
