import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import East from "@mui/icons-material/East";
import { parse, format } from "date-fns";
import { TableRow } from "../../customer/styles";
import { Paragraph, H5 } from "../../../components/Typography";
import { formatCurrency } from "../../../utils/lib";

const mappingType: { [key: string]: string } = {
  pending: "Đang Chuẩn Bị Hàng",
  paying: "Đang Thanh Toán",
  packaging: "Đang Đóng Gói",
  shipping: "Đang Vận Chuyển",
  delivering: "Đang Giao Hàng",
  delivered: "Đã Giao Hàng",
  canceled: "Hủy",
};

type Props = { order: any };

export default function OrderRow({ order }: Props) {
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

  return (
    <Link href={`/orders/${order.id}`} passHref>
      <TableRow
        sx={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", cursor: "pointer" }}
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
  );
}
