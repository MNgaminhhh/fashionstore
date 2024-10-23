import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { StyledToolBar, DashboardNavbarRoot } from "./styles";
import styled from "@mui/material/styles/styled";
import ContentLeft from "./components/ContentLeft";

const FlexGrow = styled(Box)({
    flexGrow: 1,
});

export default function NavbarDashboard() {
    return (
        <DashboardNavbarRoot position="sticky">
            <Container maxWidth="xl">
                <StyledToolBar disableGutters>
                    <ContentLeft />
                    <FlexGrow />
                </StyledToolBar>
            </Container>
        </DashboardNavbarRoot>
    );
}
