import {Box, Typography} from "@mui/material";
export default function CopyYear() {

    const currentYear = new Date().getFullYear();
    return (
        <Box
            sx={{
                textAlign: "center",
                mt: 4,
                backgroundColor: "grey.800",
                py: 2,
            }}
        >
            <Typography variant="body2" sx={{ color: "grey.300" }}>
                &copy; {currentYear}. All rights reserved.
            </Typography>
        </Box>
    );
}
