"use client";
import React, { useEffect } from "react";
import { Typography, Button, Container, Grid, Paper, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import styled from "@emotion/styled";
import Link from "next/link";
import Error from "../../../../app/error";

const HeroSection = styled(Box)(({ theme }) => ({
  background: `
      linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
      url('https://i.postimg.cc/W3RVtDSg/DALL-E-2024-09-12-22-45-40-A-panoramic-image-capturing-the-essence-of-fashion-The-scene-should-fe.webp') 
      no-repeat center center/cover
    `,
  minHeight: "400px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#fff",
  padding: (theme as any).spacing(4),
}));

interface BenefitItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const BenefitItem = ({ icon: Icon, title, description }: BenefitItemProps) => (
  <Grid item xs={12} md={4}>
    <Paper elevation={3} sx={{ p: 3, textAlign: "center", height: "100%" }}>
      <Icon sx={{ color: "primary.main", fontSize: 40, mb: 2 }} />
      <Typography variant="h6" mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  </Grid>
);

export default function BecomeInforPage() {
  return (
    <Box>
      <HeroSection>
        <Box maxWidth="md">
          <Typography variant="h2" fontWeight={600} mb={2}>
            Trở thành nhà bán hàng
          </Typography>
          <Typography variant="h6" color="#eee" mb={4}>
            Cùng chúng tôi mang thời trang đến hàng xxx khách hàng mỗi ngày.
          </Typography>
          <Link href="/become-vendor" passHref legacyBehavior>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component="a"
            >
              Đăng ký ngay
            </Button>
          </Link>
        </Box>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight={600} mb={4}>
          Lợi ích khi trở thành nhà bán hàng
        </Typography>
        <Grid container spacing={4}>
          <BenefitItem
            icon={MonetizationOnIcon}
            title="Tăng Doanh Thu"
            description="Tiếp cận hàng triệu khách hàng tiềm năng, giúp tăng trưởng doanh số nhanh chóng."
          />
          <BenefitItem
            icon={TrendingUpIcon}
            title="Thương Hiệu Phát Triển"
            description="Xây dựng thương hiệu của bạn với sự hỗ trợ từ hệ thống marketing của chúng tôi."
          />
          <BenefitItem
            icon={LocalShippingIcon}
            title="Giao Hàng Nhanh"
            description="Mạng lưới giao hàng toàn quốc, đảm bảo sản phẩm đến tay khách hàng nhanh chóng."
          />
          <BenefitItem
            icon={SupportAgentIcon}
            title="Hỗ Trợ Tận Tình"
            description="Đội ngũ CSKH hỗ trợ 24/7, giải đáp mọi thắc mắc, giúp bạn yên tâm kinh doanh."
          />
          <BenefitItem
            icon={CheckCircleIcon}
            title="Quy Trình Đơn Giản"
            description="Đăng ký nhanh chóng, quản lý dễ dàng qua hệ thống quản trị dành cho nhà bán."
          />
          <BenefitItem
            icon={PeopleIcon}
            title="Mạng Lưới Khách Hàng Lớn"
            description="Hàng triệu người dùng truy cập mỗi tháng, giúp sản phẩm của bạn tiếp cận rộng rãi."
          />
        </Grid>
      </Container>

      <Box sx={{ py: 6, bgcolor: "grey.100" }}>
        <Container>
          <Typography variant="h4" textAlign="center" fontWeight={600} mb={4}>
            Con số ấn tượng
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  x+
                </Typography>
                <Typography variant="subtitle1">
                  Khách hàng truy cập hàng tháng
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  x00%
                </Typography>
                <Typography variant="subtitle1">
                  Tăng trưởng doanh thu mỗi năm
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  24/7
                </Typography>
                <Typography variant="subtitle1">
                  Hỗ trợ CSKH toàn thời gian
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Sẵn sàng bắt đầu sự nghiệp kinh doanh thời trang?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Hãy tham gia cùng chúng tôi để phát triển thương hiệu và mở rộng doanh
          thu ngay hôm nay.
        </Typography>
        <Link href="/become-vendor" passHref legacyBehavior>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component="a"
          >
            Đăng ký ngay
          </Button>
        </Link>
      </Container>
    </Box>
  );
}
