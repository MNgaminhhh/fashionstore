import Grid from "@mui/material/Grid";
import WelcomeCard from "../components/WelcomeCard";

export default async function DashboardPageView() {

    return (
        <div className="pt-2 py-2">
            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                    <WelcomeCard />
                </Grid>
            </Grid>
        </div>
    );
}
