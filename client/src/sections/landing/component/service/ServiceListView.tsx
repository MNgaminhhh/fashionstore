import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ServiceCard from "./ServiceCard";
import { serviceList } from "./data";

export default async function ServiceListView() {
  return (
    <Container className="mb-5">
      <Grid container spacing={1}>
        {serviceList.map((item) => (
          <ServiceCard key={item.id} service={item} />
        ))}
      </Grid>
    </Container>
  );
}
