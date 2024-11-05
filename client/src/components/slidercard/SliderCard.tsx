import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { StyledRoot } from "./styles";
import { Paragraph } from "../Typography";
import MTImage from "../MTImage";
import Box from "@mui/material/Box";

interface Props {
  title?: string;
  imgUrl?: string;
  buttonLink?: string;
  buttonText?: string;
  description?: string;
  buttonColor?: "dark" | "primary";
}

export default function SliderCard({
  title,
  imgUrl,
  buttonLink,
  buttonText,
  description,
  buttonColor = "primary",
}: Props) {
  return (
    <StyledRoot
      sx={{
        height: 700,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Ảnh nền */}
      {imgUrl && (
        <MTImage
          src={imgUrl}
          alt={title || "slider image"}
          fill
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1, // Z-index thấp để nội dung hiển thị lên trên
          }}
        />
      )}

      {/* Nội dung bao phủ ảnh */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2, // Đảm bảo nội dung hiển thị lên trên ảnh
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Nền đen bán trong suốt
          color: "white", // Chữ màu trắng
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 4,
        }}
      >
        {title && (
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: 0 }}>
            {title}
          </h1>
        )}
        {description && (
          <Paragraph
            sx={{
              fontSize: "1.25rem",
              maxWidth: "80%",
              margin: "16px auto",
              color: "white", // Đảm bảo màu chữ trắng
            }}
          >
            {description}
          </Paragraph>
        )}
        {buttonLink && (
          <a href={buttonLink} style={{ textDecoration: "none" }}>
            <Button
              size="large"
              disableElevation
              color={buttonColor}
              variant="contained"
              sx={{
                height: 48,
                px: 5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                mt: 2,
                color: "white",
              }}
            >
              {buttonText}
            </Button>
          </a>
        )}
      </Box>
    </StyledRoot>
  );
}
