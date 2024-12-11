import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useDropzone } from "react-dropzone";
import { H5, Small, H4 } from "./Typography";

interface Props {
  title?: string;
  imageSize?: string;
  onChange: (files: File[]) => void;
  initialImage?: string;
}

export default function MTDropZone({
  onChange,
  imageSize = "Tải lên ảnh kích thước 1024*1024",
  title = "Kéo & thả hình ảnh sản phẩm vào đây",
  initialImage,
}: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialImage || null
  );

  useEffect(() => {
    if (initialImage) setPreviewImage(initialImage);
  }, [initialImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
      if (acceptedFiles.length > 0) {
        const previewUrl = URL.createObjectURL(acceptedFiles[0]);
        setPreviewImage(previewUrl);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 10,
    multiple: true,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
  });

  return (
    <Box
      py={4}
      px={{ md: 10, xs: 4 }}
      display="flex"
      flexDirection="column"
      minHeight="250px"
      textAlign="center"
      alignItems="center"
      borderRadius="10px"
      border="1.5px dashed"
      borderColor="grey.300"
      justifyContent="space-between"
      bgcolor={isDragActive ? "grey.200" : "grey.100"}
      sx={{ transition: "all 250ms ease-in-out", outline: "none" }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <H5 mb={1} color="grey.600">
        {title}
      </H5>

      <Divider
        sx={{ "::before, ::after": { borderColor: "grey.300", width: 70 } }}
      >
        <Small color="text.disabled" px={1}>
          HOẶC
        </Small>
      </Divider>

      <Button
        type="button"
        variant="outlined"
        color="info"
        sx={{ px: 4, my: 4 }}
      >
        Chọn tệp
      </Button>

      <Small color="grey.600">{imageSize}</Small>

      {previewImage && (
        <>
          <Divider />
          <H4 mt={3} color="grey.700">
            Hình ảnh
          </H4>
          <Box
            component="img"
            alt="Hình ảnh xem trước"
            src={previewImage}
            sx={{
              width: 300,
              height: 300,
              objectFit: "cover",
              borderRadius: "10px",
              mt: 2,
              boxShadow: 1,
            }}
          />
        </>
      )}
    </Box>
  );
}
