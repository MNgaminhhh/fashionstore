"use client";

import { H3, H4 } from "../../../components/Typography";
import VendorModel from "../../../models/Vendor.model";
import { Box, Grid, Typography, Paper, Divider, Avatar } from "@mui/material";
import Image from "next/image";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as AddressIcon,
  Info as DescriptionIcon,
  Person as SellerIcon,
} from "@mui/icons-material";

type Props = { vendor: any };

export default function ProductVendorInfo({ vendor }: Props) {
  return (
    <Box>
      <Paper
        sx={{
          padding: 4,
          borderRadius: 3,
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <H3
          mb={3}
          fontWeight="bold"
          textAlign="center"
          color="primary.main"
          sx={{
            textTransform: "uppercase",
            letterSpacing: 1.2,
            fontSize: "1.8rem",
          }}
        >
          Thông tin cửa hàng
        </H3>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 360,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Image
                src={vendor.banner}
                alt="Vendor Banner"
                layout="fill"
                objectFit="cover"
                quality={85}
                priority
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Tên cửa hàng: {vendor.store_name}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SellerIcon fontSize="small" sx={{ mr: 1 }} /> Tên người bán:{" "}
                  {vendor.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AddressIcon fontSize="small" sx={{ mr: 1 }} /> Địa chỉ:{" "}
                  {vendor.address}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Email:{" "}
                  {vendor.email}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PhoneIcon fontSize="small" sx={{ mr: 1 }} /> Số điện thoại:{" "}
                  {vendor.phone_number}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DescriptionIcon fontSize="small" sx={{ mr: 1 }} /> Mô tả:{" "}
                  {vendor.description || "Chưa có mô tả"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
