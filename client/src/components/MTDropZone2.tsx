import { useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useDropzone } from "react-dropzone";
import { H5, Small, H4 } from "./Typography";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  title?: string;
  imageSize?: string;
  files: File[]; // Quản lý các tệp hình ảnh mới được chọn
  onChange: (files: File[]) => void;
}

export default function MTDropZone2({
  onChange,
  imageSize = "Tải lên ảnh kích thước 1024*1024",
  title = "Kéo & thả hình ảnh sản phẩm vào đây",
  files = [],
}: Props) {
  // Xử lý các tệp được kéo và thả
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange([...files, ...acceptedFiles]);
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 10 - files.length, // Đảm bảo tổng số tệp không vượt quá 10
    multiple: true,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
  });

  // Xử lý xóa tệp hình ảnh
  const handleRemoveFile = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn sự kiện lan truyền
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

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
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện lan truyền khi nhấn nút
          const fileInput = document.querySelector('input[type="file"]');
          (fileInput as HTMLElement)?.click();
        }}
      >
        Chọn tệp
      </Button>

      <Small color="grey.600">{imageSize}</Small>

      {files.length > 0 && (
        <>
          <Divider />
          <H4 mt={3} color="grey.700">
            Hình ảnh
          </H4>
          <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
            {files.map((file, index) => (
              <Box key={index} width={100} height={100} position="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleRemoveFile(index, e)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
