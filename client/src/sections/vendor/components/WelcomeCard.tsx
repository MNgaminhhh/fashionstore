"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { H3, H5, Paragraph } from "../../../components/Typography";

export default function WelcomeCard() {
    return (
        <Card
            sx={{
                p: 3,
                height: "100%",
                display: "flex",
                position: "relative",
                flexDirection: "column",
                justifyContent: "center"
            }}>
            <H5 color="info.main" mb={0.5}>
                Xin Chào
            </H5>
        </Card>
    );
}
