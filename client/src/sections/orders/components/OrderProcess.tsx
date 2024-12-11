"use client";

import { Fragment } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import styled from "@mui/material/styles/styled";
import Done from "@mui/icons-material/Done";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PaymentIcon from "@mui/icons-material/Payment";
import { Paragraph } from "../../../components/Typography";
import { FlexBetween, FlexBox } from "../../../components/flexbox";

interface OrderProgressProps {
  orderStatus: string;
  estimatedDeliveryDate: string;
}

const StyledFlexbox = styled(FlexBetween)(({ theme }) => ({
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: { flexDirection: "column" },
  "& .line": {
    height: 4,
    minWidth: 50,
    flex: "1 1 0",
    [theme.breakpoints.down("sm")]: { flex: "unset", height: 50, minWidth: 4 },
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  top: -5,
  right: -5,
  width: 22,
  height: 22,
  position: "absolute",
  bgcolor: theme.palette.grey[200],
  color: theme.palette.success.main,
}));

const OrderProgress: React.FC<OrderProgressProps> = ({
  orderStatus,
  estimatedDeliveryDate,
}) => {
  const mappingType: { [key: string]: string } = {
    pending: "Đang Chuẩn Bị Hàng",
    paying: "Đang Thanh Toán",
    shipping: "Đang Vận Chuyển",
    delivered: "Đã Giao Hàng",
    canceled: "Hủy",
  };

  const ORDER_STATUS_LIST = ["pending", "paying", "shipping", "delivered"];
  if (orderStatus.toLowerCase() === "canceled") {
    ORDER_STATUS_LIST.push("canceled");
  }
  const STEP_ICONS: { [key: string]: React.ElementType } = {
    pending: Inventory2Icon,
    paying: PaymentIcon,
    shipping: LocalShippingIcon,
    delivered: EventAvailableIcon,
    canceled: Done,
  };
  const statusIndex = ORDER_STATUS_LIST.indexOf(orderStatus.toLowerCase());

  return (
    <Card sx={{ p: "2rem 1.5rem", mb: 4 }}>
      <StyledFlexbox>
        {ORDER_STATUS_LIST.map((status, index) => {
          const IconComponent = STEP_ICONS[status];
          const isCompleted = index < statusIndex;
          const isActive = index === statusIndex;
          const isCanceled = status === "canceled";

          return (
            <Fragment key={index}>
              <Box position="relative">
                <Avatar
                  alt={mappingType[status]}
                  sx={{
                    width: 64,
                    height: 64,
                    color: isCompleted || isActive ? "white" : "primary.main",
                    bgcolor:
                      isCompleted || isActive ? "primary.main" : "grey.300",
                  }}
                >
                  <IconComponent color="inherit" fontSize="large" />
                </Avatar>
                {isCompleted && status !== "canceled" ? (
                  <StyledAvatar alt="done">
                    <Done color="inherit" sx={{ fontSize: 16 }} />
                  </StyledAvatar>
                ) : null}
              </Box>
              {index < ORDER_STATUS_LIST.length - 1 && (
                <Box
                  className="line"
                  bgcolor={isCompleted ? "primary.main" : "grey.300"}
                />
              )}
            </Fragment>
          );
        })}
      </StyledFlexbox>

      <FlexBox justifyContent={{ xs: "center", sm: "flex-end" }}>
        <Paragraph
          p="0.5rem 1rem"
          textAlign="center"
          borderRadius="300px"
          color="primary.main"
          bgcolor="primary.light"
        >
          Ngày Dự Kiến Giao Hàng <b>{estimatedDeliveryDate}</b>
        </Paragraph>
      </FlexBox>
    </Card>
  );
};

export default OrderProgress;
