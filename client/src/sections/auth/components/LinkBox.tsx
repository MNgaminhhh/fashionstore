import Link from "next/link";
import Box from "@mui/material/Box";

interface Props {
    title: string;
    href: string;
}

export default function LinkBox({ href, title }: Props) {
    return (
        <Box
            href={href}
            component={Link}
            fontWeight={500}
            borderColor="grey.800"
            borderBottom="1px solid">
            {title}
        </Box>
    );
}
