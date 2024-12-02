import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import { useDropzone } from "react-dropzone";
import { H5, Small, H4 } from "./Typography";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Image from "next/image";

interface ImageType {
  id: string;
  src: string;
  file?: File;
}

interface Props {
  title?: string;
  imageSize?: string;
  images: ImageType[];
  onChange: (images: ImageType[]) => void;
  initialImage?: string;
}

export default function MTDropZone2({
  onChange,
  imageSize = "Tải lên ảnh kích thước 1024*1024",
  title = "Kéo & thả hình ảnh sản phẩm vào đây",
  images = [],
  initialImage,
}: Props) {
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const newPreviews = images.map((image) =>
      image.file ? URL.createObjectURL(image.file) : image.src
    );
    setFilePreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [images]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        src: URL.createObjectURL(file),
        file,
      }));
      onChange([...images, ...newImages]);
    },
    [images, onChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 10 - images.length,
    multiple: true,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
    noClick: true,
    noKeyboard: true,
  });

  const handleRemoveImage = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const updatedImages = images.filter((image) => image.id !== id);
    onChange(updatedImages);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    onChange(reorderedImages);
  };

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
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
      border="2px dashed"
      borderColor={isDragActive ? "primary.main" : "grey.300"}
      bgcolor={isDragActive ? "grey.200" : "grey.100"}
      sx={{
        transition: "all 250ms ease-in-out",
        outline: "none",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <CloudUploadIcon
        sx={{
          fontSize: 48,
          color: isDragActive ? "primary.main" : "grey.600",
          mb: 2,
        }}
      />

      <H5 mb={1} color="grey.600">
        {isDragActive ? "Thả vào vị trí này" : title}
      </H5>

      {!isDragActive && (
        <>
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
              e.stopPropagation();
              open();
            }}
          >
            Chọn tệp
          </Button>

          <Small color="grey.600">{imageSize}</Small>
        </>
      )}
      {images.length > 0 && (
        <>
          <Divider sx={{ mt: 4, width: "100%" }} />
          <H4 mt={3} color="grey.700">
            Hình ảnh
          </H4>

          <Small color="grey.500" sx={{ mb: 1 }}>
            (1) Bạn có thể kéo thả các hình ảnh để thay đổi vị trí
          </Small>
          <Small color="grey.500" sx={{ mb: 1 }}>
            (2) Bạn có nhấn vào ảnh để xem ảnh chi tiết
          </Small>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="files-droppable" direction="horizontal">
              {(provided) => (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={2}
                  mt={2}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {images.map((image, index) => (
                    <Draggable
                      key={image.id}
                      draggableId={image.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{
                            width: 200,
                            display: "flex",
                            alignItems: "center",
                            padding: 1,
                            cursor: snapshot.isDragging ? "grabbing" : "grab",
                            boxShadow: snapshot.isDragging ? 6 : 1,
                            transition: "box-shadow 0.2s ease",
                            position: "relative",
                          }}
                        >
                          <Box
                            {...provided.dragHandleProps}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "grab",
                              mr: 1,
                            }}
                          >
                            <DragIndicatorIcon />
                          </Box>

                          <Box
                            onClick={() => handleImageClick(image.src)}
                            sx={{
                              flexGrow: 1,
                              cursor: "pointer",
                            }}
                          >
                            <Image
                              src={image.src}
                              alt={`Preview ${index}`}
                              width={200}
                              height={200}
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>

                          <IconButton
                            size="small"
                            onClick={(e) => handleRemoveImage(image.id, e)}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            sx={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              backgroundColor: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <Dialog
            open={Boolean(selectedImage)}
            onClose={handleClosePreview}
            maxWidth="lg"
            fullWidth
          >
            <DialogContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 0,
                backgroundColor: "#000",
              }}
            >
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Preview"
                  width={800}
                  height={800}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreview} color="primary">
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
