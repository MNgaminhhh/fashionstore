import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { StyledRoot } from "./styles";
import { Paragraph } from "../Typography";
import MTImage from "../MTImage";
import Box from "@mui/material/Box";

interface Props {
  title?: string;
  banner_image?: string;
  button_link?: string;
  button_text?: string;
  description?: string;
  buttonColor?: "dark" | "primary";
}

export default function SliderCard({
  title,
  banner_image,
  button_link,
  button_text,
  description,
  buttonColor = "primary",
}: Props) {
  return (
    <StyledRoot
      sx={{
        height: 450,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.034)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {banner_image && (
        <MTImage
          // src={banner_image}
          src="https://anonyviet.com/wp-content/uploads/2024/11/ghi-am-cuoc-goi-tren-iphone-1.jpg"
          alt={title || "slider image"}
          fill
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "white",
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
              color: "white",
            }}
          >
            {description.length > 200
              ? `${description.substring(0, 200)}...`
              : description}
          </Paragraph>
        )}

        {button_link && (
          <a href={button_link} style={{ textDecoration: "none" }}>
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
              {button_text}
            </Button>
          </a>
        )}
      </Box>
    </StyledRoot>
  );
}
