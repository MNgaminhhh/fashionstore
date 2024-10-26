import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { StyledRoot } from "./styles";
import {Paragraph} from "../Typography";
import MTImage from "../MTImage";

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
        <StyledRoot>
            <Grid container spacing={3} alignItems="center">
                <Grid item className="grid-item" xl={4} md={5} sm={6} xs={12}>
                    {title && <h1 className="title">{title}</h1>}
                    {description && (
                        <Paragraph color="secondary.main" mb={2.7}>
                            {description}
                        </Paragraph>
                    )}

                    {buttonLink && (
                        <a href={buttonLink}>
                            <Button
                                size="large"
                                disableElevation
                                color={buttonColor}
                                variant="contained"
                                className="button-link"
                                sx={{ height: 44, borderRadius: "4px" }}
                            >
                                {buttonText}
                            </Button>
                        </a>
                    )}
                </Grid>

                <Grid item xl={8} md={7} sm={6} xs={12}>
                    {imgUrl && (
                        <MTImage
                            src={imgUrl}
                            alt={title || "mtshop slider immage"}
                            sx={{
                                mx: "auto",
                                maxHeight: 400,
                                display: "block",
                                maxWidth: "100%",
                            }}
                        />
                    )}
                </Grid>
            </Grid>
        </StyledRoot>
    );
}
