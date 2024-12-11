// components/OrderRow.tsx

"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import East from "@mui/icons-material/East";
import Star from "@mui/icons-material/Star";
import { parse, format } from "date-fns";
import { TableRow } from "../../customer/styles";
import { Paragraph, H5 } from "../../../components/Typography";
import { formatCurrency } from "../../../utils/lib";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import { Tooltip } from "@mui/material";

const mappingType: { [key: string]: string } = {
  pending: "Đang Chuẩn Bị Hàng",
  paying: "Đang Thanh Toán",
  packaging: "Đang Đóng Gói",
  shipping: "Đang Vận Chuyển",
  delivering: "Đang Giao Hàng",
  delivered: "Đã Giao Hàng",
  canceled: "Hủy",
};

type SKU = {
  sku_id: string;
  product_name: string;
};

type Props = { order: any };

export default function OrderRow({ order }: Props) {
  console.log(order);
  const router = useRouter();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const getColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";

      case "paying":
        return "warning";

      case "packaging":
        return "info";

      case "shipping":
        return "info";

      case "delivering":
        return "primary";

      case "delivered":
        return "success";

      case "canceled":
        return "error";

      default:
        return "default";
    }
  };

  const parsedDate = parse(order.updated_at, "dd-MM-yyyy HH:mm", new Date());
  const formattedDate = format(parsedDate, " HH:mm dd/MM/yyyy");

  const isDelivered = order.order_status.toLowerCase() === "delivered";

  const handleReviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReviewOpen(true);
  };

  return (
    <>
      <Link href={`/orders/${order.id}`} passHref>
        <TableRow
          sx={{
            gridTemplateColumns: isDelivered
              ? "2fr 1fr 1fr 1fr 1fr 1fr"
              : "2fr 1fr 1fr 1fr 1fr",
            cursor: "pointer",
          }}
        >
          <H5 ellipsis>#{order.id.substring(0, 18)}</H5>

          <Box textAlign="center">
            <Chip
              size="small"
              label={
                mappingType[order.order_status.toLowerCase()] ||
                order.order_status
              }
              color={getColor(order.order_status)}
            />
          </Box>

          <Paragraph textAlign={{ sm: "center", xs: "left" }}>
            {formattedDate}
          </Paragraph>

          <Paragraph textAlign="center">
            {formatCurrency(order.total_bill)}
          </Paragraph>

          {isDelivered && (
            <Box textAlign="center">
              <Tooltip title="Đánh giá đơn này" arrow>
                <IconButton
                  onClick={handleReviewClick}
                  aria-label="Đánh giá đơn hàng"
                  color="primary"
                >
                  <Star />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Box display={{ sm: "inline-flex", xs: "none" }} justifyContent="end">
            <IconButton>
              <East
                fontSize="small"
                sx={{
                  color: "grey.500",
                  transform: ({ direction }) =>
                    `rotate(${direction === "rtl" ? "180deg" : "0deg"})`,
                }}
              />
            </IconButton>
          </Box>
        </TableRow>
      </Link>
      {isDelivered && (
        <ReviewModal
          open={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          orderId={order.id}
          skus={order.skus}
          orderIdForReview={order.order_id}
        />
      )}
    </>
  );
}
