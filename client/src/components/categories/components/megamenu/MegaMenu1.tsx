import Link from "next/link";
import Box from "@mui/material/Box";
import { CategoryItem, CategoryItemOffer } from "../../utils/types";
import BaseImage from "../../../BaseImage";
import ColumnList from "./ColumnList";

interface MegaMenu1Props {
    minWidth?: string;
    data: CategoryItem[];
    banner?: CategoryItemOffer;
}

export default function MegaMenu1({ banner, data }: MegaMenu1Props) {
    return (
        <ColumnList list={data} banner={banner}>
            {banner?.position === "bottom" ? (
                <Link href={banner.href}>
                    <Box position="relative" height={150} width="100%">
                        <BaseImage
                            fill
                            alt="banner"
                            src={banner.url}
                            sx={{ objectFit: "cover", objectPosition: "center center" }}
                        />
                    </Box>
                </Link>
            ) : null}
        </ColumnList>
    );
}
