"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import { FlexBox } from "../../../components/flexbox";
import { H5, H6, Paragraph } from "../../../components/Typography";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import * as yup from "yup";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import { useAppContext } from "../../../context/AppContext";
import MTDropZone from "../../../components/MTDropZone";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { jwtDecode } from "jwt-decode";
import File from "../../../services/File";
import Review from "../../../services/Review";
import Comments from "../../../services/Comments";

interface CommentItem {
  id: string;
  content: string;
  comment: string;
  content_type: string;
  user_id: string;
  user_name: {
    String: string;
    Valid: boolean;
  };
  created_at: string;
}

interface Review {
  avt: {
    String: string;
    Valid: boolean;
  };
  comment: CommentItem[];
  created_at: string;
  id: string;
  number_of_replies: number;
  rating: number;
  replies: ReplyItem[];
  sku_id: string;
  updated_at: string;
  user_id: string;
  user_name: {
    String: string;
    Valid: boolean;
  };
}

interface ReplyItem {
  id: string;
  content: string;
  content_type: string;
  user_id: string;
  user_name: {
    String: string;
    Valid: boolean;
  };
  created_at: string;
}

interface ProductCommentProps {
  idV: string;
  review: Review;
  onDelete?: (deletedReviewId: string) => void;
  onUpdate?: (updatedReview: Review) => void;
}

interface DecodedToken {
  sub: string;
  vendorId: string;
}

export default function ProductComment({
  idV,
  review,
  onDelete,
  onUpdate,
}: ProductCommentProps) {
  const { avt, comment, created_at, rating, user_name, user_id, id, replies } =
    review;

  const name = user_name?.Valid ? user_name.String : "Người dùng";
  const imgUrl = avt?.Valid ? avt.String : "https://via.placeholder.com/48";

  const { sessionToken } = useAppContext();

  let currentUserId: string | null = null;
  let vendorId: string | null = null;

  if (sessionToken) {
    try {
      const decoded: DecodedToken = jwtDecode(sessionToken);
      currentUserId = decoded.sub;
      vendorId = decoded.vendorId;
    } catch (error) {
      console.error("Invalid session token");
    }
  }

  const isOwnerCus = currentUserId === user_id;
  const isOwner = vendorId === idV;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
  const [replyImageFiles, setReplyImageFiles] = useState<File[]>([]);

  const handleEditOpen = () => {
    handleMenuClose();
    const images = comment
      .filter((c) => c.content_type === "image")
      .map((c) => c.content);
    setExistingImages(images);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setImageFiles([]);
    setExistingImages([]);
    formik.resetForm();
  };

  const handleExistingImageDelete = (imageUrl: string) => {
    setExistingImages((prevImages) =>
      prevImages.filter((img) => img !== imageUrl)
    );
  };

  const editValidationSchema = yup.object().shape({
    rating: yup
      .number()
      .min(1, "Vui lòng chọn ít nhất 1 sao")
      .max(5, "Tối đa 5 sao")
      .required("Vui lòng chọn đánh giá"),
    comment: yup.string().required("Vui lòng nhập nội dung bình luận"),
  });

  const formik = useFormik({
    initialValues: {
      rating: rating,
      comment: comment.find((c) => c.content_type === "text")?.content || "",
    },
    validationSchema: editValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let updatedComments: CommentItem[] = [
          {
            id: comment.find((c) => c.content_type === "text")?.id || "",
            content: values.comment,
            content_type: "text",
            user_id: currentUserId || "",
            user_name: {
              String: name,
              Valid: true,
            },
            created_at: new Date().toISOString(),
          },
        ];

        existingImages.forEach((imageUrl, idx) => {
          updatedComments.push({
            id: `existing-image-${idx}`,
            content: imageUrl,
            content_type: "image",
            user_id: currentUserId || "",
            user_name: {
              String: name,
              Valid: true,
            },
            created_at: new Date().toISOString(),
          });
        });

        if (imageFiles.length > 0) {
          for (const file of imageFiles) {
            const formData = new FormData();
            formData.append("file", file);
            try {
              const uploadRes = await File.upload(formData, sessionToken || "");
              if (
                uploadRes.data.success &&
                uploadRes.data.data.files &&
                uploadRes.data.data.files.length > 0
              ) {
                const imageUrl = uploadRes.data.data.files[0];
                updatedComments.push({
                  id: `new-image-${Date.now()}`,
                  content: imageUrl,
                  content_type: "image",
                  user_id: currentUserId || "",
                  user_name: {
                    String: name,
                    Valid: true,
                  },
                  created_at: new Date().toISOString(),
                });
              } else {
                notifyError("Tải ảnh lên thất bại");
                return;
              }
            } catch (error: any) {
              notifyError(error.message || "Đã xảy ra lỗi khi tải ảnh lên.");
              return;
            }
          }
        }

        const data = {
          rating: values.rating,
          comment: updatedComments,
        };

        const response = await Review.update(id, data, sessionToken || "");
        if (response.data.success) {
          notifySuccess("Đánh giá đã được cập nhật thành công.");
          setIsEditOpen(false);
          setImageFiles([]);
          setExistingImages([]);
          if (onUpdate) {
            const updatedReview: Review = {
              ...review,
              rating: values.rating,
              comment: data.comment,
              updated_at: new Date().toISOString(),
            };
            onUpdate(updatedReview);
          }
        } else {
          notifyError(response.data.message || "Cập nhật đánh giá thất bại.");
        }
      } catch (error: any) {
        notifyError(error.message || "Đã xảy ra lỗi khi cập nhật đánh giá.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const replyValidationSchema = yup.object().shape({
    replyComment: yup.string().required("Vui lòng nhập nội dung trả lời"),
  });

  const replyFormik = useFormik({
    initialValues: {
      replyComment: "",
    },
    validationSchema: replyValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        let replyComments: CommentItem[] = [
          {
            id: `reply-${Date.now()}`,
            content: values.replyComment,
            content_type: "text",
            user_id: currentUserId || "",
            user_name: {
              String: name,
              Valid: true,
            },
            created_at: new Date().toISOString(),
          },
        ];

        if (replyImageFiles.length > 0) {
          for (const file of replyImageFiles) {
            const formData = new FormData();
            formData.append("file", file);
            try {
              const uploadRes = await File.upload(formData, sessionToken || "");
              if (
                uploadRes.data.success &&
                uploadRes.data.data.files &&
                uploadRes.data.data.files.length > 0
              ) {
                const imageUrl = uploadRes.data.data.files[0];
                replyComments.push({
                  id: `reply-image-${Date.now()}`,
                  content: imageUrl,
                  content_type: "image",
                  user_id: currentUserId || "",
                  user_name: {
                    String: name,
                    Valid: true,
                  },
                  created_at: new Date().toISOString(),
                });
              } else {
                notifyError("Tải ảnh lên thất bại");
                return;
              }
            } catch (error: any) {
              notifyError(error.message || "Đã xảy ra lỗi khi tải ảnh lên.");
              return;
            }
          }
        }

        const data = {
          comment: replyComments,
          review_id: id,
        };

        const response = await Comments.create(data, sessionToken || "");
        if (response.data.success) {
          notifySuccess("Trả lời đã được gửi thành công.");
          setIsReplyOpen(false);
          setReplyImageFiles([]);
          resetForm();
          if (onUpdate) {
            onUpdate(response.data.data.review);
          }
        } else {
          notifyError(response.data.message || "Gửi trả lời thất bại.");
        }
      } catch (error: any) {
        notifyError(error.message || "Đã xảy ra lỗi khi gửi trả lời.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDeleteClick = () => {
    handleMenuClose();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteDialogOpen(false);
    try {
      const response = await Review.delete(review.id, sessionToken || "");
      if (response.data.success) {
        notifySuccess("Đánh giá đã được xóa thành công.");
        if (onDelete) {
          onDelete(id);
        }
      } else {
        notifyError(response.data.message || "Xóa đánh giá thất bại.");
      }
    } catch (error: any) {
      notifyError(error.message || "Đã xảy ra lỗi khi xóa đánh giá.");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };
  const handleReplyOpen = () => {
    setIsReplyOpen(true);
  };
  const handleReplyClose = () => {
    setIsReplyOpen(false);
    setReplyImageFiles([]);
    replyFormik.resetForm();
  };
  const handleReplyImageChange = (files: File[]) => {
    if (files.length > 0) {
      setReplyImageFiles(files);
    }
  };
  const [isEditReplyOpen, setIsEditReplyOpen] = useState<boolean>(false);
  const [currentReply, setCurrentReply] = useState<ReplyItem | null>(null);
  const [editReplyImageFiles, setEditReplyImageFiles] = useState<File[]>([]);

  const handleEditReply = (replyId: string) => {
    const replyToEdit = replies.find((reply) => reply.id === replyId);
    if (replyToEdit) {
      setCurrentReply(replyToEdit);
      setEditReplyImageFiles([]);
      setIsEditReplyOpen(true);
    } else {
      notifyError("Không tìm thấy reply để chỉnh sửa.");
    }
  };

  const handleEditReplyClose = () => {
    setIsEditReplyOpen(false);
    setCurrentReply(null);
    setEditReplyImageFiles([]);
    editReplyFormik.resetForm();
  };

  const editReplyValidationSchema = yup.object().shape({
    replyComment: yup.string().required("Vui lòng nhập nội dung trả lời"),
  });

  const editReplyFormik = useFormik({
    initialValues: {
      replyComment: currentReply?.content || "",
    },
    enableReinitialize: true,
    validationSchema: editReplyValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let updatedReply: ReplyItem = {
          ...currentReply!,
          content: values.replyComment,
          created_at: new Date().toISOString(),
        };
        if (editReplyImageFiles.length > 0) {
          for (const file of editReplyImageFiles) {
            const formData = new FormData();
            formData.append("file", file);
            try {
              const uploadRes = await File.upload(formData, sessionToken || "");
              if (
                uploadRes.data.success &&
                uploadRes.data.data.files &&
                uploadRes.data.data.files.length > 0
              ) {
                const imageUrl = uploadRes.data.data.files[0];
                updatedReply.content += `\n![Image](${imageUrl})`;
              } else {
                notifyError("Tải ảnh lên thất bại");
                return;
              }
            } catch (error: any) {
              notifyError(error.message || "Đã xảy ra lỗi khi tải ảnh lên.");
              return;
            }
          }
        }

        const data = {
          content: updatedReply.content,
          content_type: "text",
        };

        const response = await Comments.update(
          currentReply!.id,
          data,
          sessionToken || ""
        );
        if (response.data.success) {
          notifySuccess("Reply đã được cập nhật thành công.");
          setIsEditReplyOpen(false);
          setEditReplyImageFiles([]);
          if (onUpdate) {
            onUpdate(response.data.data.review);
          }
        } else {
          notifyError(response.data.message || "Cập nhật reply thất bại.");
        }
      } catch (error: any) {
        notifyError(error.message || "Đã xảy ra lỗi khi cập nhật reply.");
      } finally {
        setSubmitting(false);
      }
    },
  });
  const handleDeleteReply = (replyId: string) => {
    setReplyToDelete(replyId);
    setIsDeleteReplyDialogOpen(true);
  };

  const [isDeleteReplyDialogOpen, setIsDeleteReplyDialogOpen] =
    useState<boolean>(false);
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null);

  const confirmDeleteReply = async () => {
    if (!replyToDelete) return;

    try {
      const response = await Comments.delete(replyToDelete, sessionToken || "");
      if (response.data.success) {
        notifySuccess("Reply đã được xóa thành công.");
        if (onUpdate) {
          onUpdate(response.data.data.review);
        }
      } else {
        notifyError(response.data.message || "Xóa reply thất bại.");
      }
    } catch (error: any) {
      notifyError(error.message || "Đã xảy ra lỗi khi xóa reply.");
    } finally {
      setIsDeleteReplyDialogOpen(false);
      setReplyToDelete(null);
    }
  };

  const cancelDeleteReply = () => {
    setIsDeleteReplyDialogOpen(false);
    setReplyToDelete(null);
  };

  const handleEditReplyImageChange = (files: File[]) => {
    if (files.length > 0) {
      setEditReplyImageFiles(files);
    }
  };
  const imageComments = comment.filter((c) => c.content_type === "image");

  return (
    <Box mb={4} maxWidth={600}>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <Avatar alt={name} src={imgUrl} sx={{ width: 48, height: 48 }} />

        <div>
          <H5 mb={1}>{name}</H5>

          <FlexBox alignItems="center" gap={1.25}>
            <Rating size="small" value={rating} color="warn" readOnly />
            <H6>{created_at}</H6>
          </FlexBox>
        </div>

        {isOwnerCus && (
          <>
            <IconButton
              aria-label="more"
              aria-controls={openMenu ? "long-menu" : undefined}
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{ marginLeft: "auto" }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                },
              }}
            >
              <MenuItem onClick={handleEditOpen}>Sửa</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Xóa</MenuItem>
            </Menu>
          </>
        )}
      </Box>
      {comment.map((c, index) => (
        <Box key={c.id || index} mb={1}>
          {c.content_type === "text" && (
            <Paragraph color="grey.700">{c.content}</Paragraph>
          )}
        </Box>
      ))}
      {imageComments.length > 0 && (
        <Box mb={1}>
          <Box display="flex" gap={2} flexWrap="wrap">
            {imageComments.map((c, index) => (
              <Box
                key={c.id || index}
                position="relative"
                sx={{ cursor: "pointer", flex: "0 0 auto" }}
                onClick={() => {
                  setPreviewImage(c.content);
                  setIsPreviewOpen(true);
                }}
              >
                <img
                  src={c.content}
                  alt={`Comment Image ${index}`}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1.05)";
                    (e.currentTarget as HTMLImageElement).style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1)";
                    (e.currentTarget as HTMLImageElement).style.boxShadow =
                      "none";
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {isOwner && (
        <Box mb={2}>
          <Button variant="outlined" onClick={handleReplyOpen}>
            Trả lời
          </Button>
        </Box>
      )}
      {replies && replies.length > 0 && (
        <Box mt={2} pl={4}>
          {replies.map((reply) => (
            <Box key={reply.id} mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  alt={reply ? reply.user_name : "Người dùng"}
                  src={reply.avt}
                  sx={{ width: 40, height: 40 }}
                />

                <div>
                  <Box
                    display="flex"
                    gap={0.75}
                    direction="row"
                    alignItems="center"
                  >
                    <H5 paddingBottom={0.5}>
                      {reply ? reply.user_name : "Người dùng"}
                    </H5>
                    <H6
                      sx={{ color: "rgba(44, 44, 44, 0.6)", fontSize: "11px" }}
                    >
                      {reply.created_at}
                    </H6>
                  </Box>
                </div>

                {isOwner && (
                  <>
                    <IconButton
                      aria-label="more"
                      aria-controls={`reply-menu-${reply.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e)}
                      sx={{ marginLeft: "auto" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id={`reply-menu-${reply.id}`}
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: {
                          maxHeight: 48 * 4.5,
                          width: "20ch",
                        },
                      }}
                    >
                      <MenuItem onClick={() => handleEditReply(reply.id)}>
                        Sửa
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteReply(reply.id)}>
                        Xóa
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
              <Box ml={6}>
                {reply.comment.map((c, index) => (
                  <Box key={c.id || index} ml={1}>
                    {c.content_type === "text" && (
                      <Paragraph color="grey.700">{c.content}</Paragraph>
                    )}
                  </Box>
                ))}
                {reply.comment.map((c, index) => (
                  <Box key={c.id || index} ml={1}>
                    {c.content_type === "image" && (
                      <Box display="flex" gap={2} flexWrap="wrap">
                        <Box
                          position="relative"
                          sx={{ cursor: "pointer", flex: "0 0 auto" }}
                          onClick={() => {
                            setPreviewImage(c.content);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <img
                            src={c.content}
                            alt={`Reply Image ${c.id}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              transition: "transform 0.3s, box-shadow 0.3s",
                            }}
                            onMouseOver={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.transform = "scale(1.05)";
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.boxShadow =
                                "0 4px 8px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseOut={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.transform = "scale(1)";
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.boxShadow = "none";
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        aria-labelledby="preview-image-modal"
        aria-describedby="preview-image-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            maxWidth: "90%",
            maxHeight: "90%",
            outline: "none",
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setIsPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {previewImage && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
        </Box>
      </Modal>
      <Modal
        open={isEditOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-review-modal-title"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 700 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            id="edit-review-modal-title"
            variant="h6"
            component="h2"
            mb={2}
          >
            Sửa Đánh Giá
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography component="legend" gutterBottom>
                  Đánh Giá của Bạn
                </Typography>
                <Rating
                  name="edit-rating"
                  value={formik.values.rating}
                  onChange={(_, value: number | null) =>
                    formik.setFieldValue("rating", value)
                  }
                />
                {formik.touched.rating && formik.errors.rating && (
                  <Typography color="error" variant="caption">
                    {formik.errors.rating}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Nội Dung Bình Luận"
                  name="comment"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.comment && !!formik.errors.comment}
                  helperText={formik.touched.comment && formik.errors.comment}
                />
              </Grid>

              {existingImages.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Hình ảnh hiện có
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {existingImages.map((image, index) => (
                      <Box key={index} position="relative">
                        <Paper
                          elevation={3}
                          sx={{
                            width: 120,
                            height: 120,
                            overflow: "hidden",
                            borderRadius: 1,
                          }}
                        >
                          <img
                            src={image}
                            alt={`Existing Image ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Paper>
                        <Tooltip title="Xóa hình ảnh">
                          <IconButton
                            size="small"
                            onClick={() => handleExistingImageDelete(image)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 1)",
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Thêm hình ảnh (tùy chọn)
                </Typography>
                <MTDropZone onChange={setImageFiles} />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={handleEditClose}>
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    startIcon={
                      formik.isSubmitting ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                  >
                    {formik.isSubmitting ? "Đang lưu..." : "Lưu"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-review-dialog-title"
        aria-describedby="delete-review-dialog-description"
      >
        <DialogTitle id="delete-review-dialog-title">Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-review-dialog-description">
            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={isReplyOpen}
        onClose={handleReplyClose}
        aria-labelledby="reply-review-modal-title"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 700 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            id="reply-review-modal-title"
            variant="h6"
            component="h2"
            mb={2}
          >
            Trả Lời Đánh Giá
          </Typography>
          <form onSubmit={replyFormik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nội Dung Trả Lời"
                  name="replyComment"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={replyFormik.values.replyComment}
                  onChange={replyFormik.handleChange}
                  onBlur={replyFormik.handleBlur}
                  error={
                    !!replyFormik.touched.replyComment &&
                    !!replyFormik.errors.replyComment
                  }
                  helperText={
                    replyFormik.touched.replyComment &&
                    replyFormik.errors.replyComment
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Thêm hình ảnh (tùy chọn)
                </Typography>
                <MTDropZone onChange={handleReplyImageChange} />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={handleReplyClose}>
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={replyFormik.isSubmitting || !replyFormik.isValid}
                    startIcon={
                      replyFormik.isSubmitting ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                  >
                    {replyFormik.isSubmitting ? "Đang gửi..." : "Gửi"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      <Modal
        open={isEditReplyOpen}
        onClose={handleEditReplyClose}
        aria-labelledby="edit-reply-modal-title"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 700 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            id="edit-reply-modal-title"
            variant="h6"
            component="h2"
            mb={2}
          >
            Sửa Trả Lời Đánh Giá
          </Typography>
          <form onSubmit={editReplyFormik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nội Dung Trả Lời"
                  name="replyComment"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={editReplyFormik.values.replyComment}
                  onChange={editReplyFormik.handleChange}
                  onBlur={editReplyFormik.handleBlur}
                  error={
                    !!editReplyFormik.touched.replyComment &&
                    !!editReplyFormik.errors.replyComment
                  }
                  helperText={
                    editReplyFormik.touched.replyComment &&
                    editReplyFormik.errors.replyComment
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Thêm hình ảnh (tùy chọn)
                </Typography>
                <MTDropZone onChange={handleEditReplyImageChange} />
                {editReplyImageFiles.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body2" color="grey.700" mb={1}>
                      Bạn đã chọn {editReplyImageFiles.length} hình ảnh.
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {editReplyImageFiles.map((file, index) => (
                        <Box key={index} position="relative">
                          <Paper
                            elevation={3}
                            sx={{
                              width: 120,
                              height: 120,
                              overflow: "hidden",
                              borderRadius: 1,
                            }}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Edit Reply Preview ${index}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Paper>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={handleEditReplyClose}>
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={
                      editReplyFormik.isSubmitting || !editReplyFormik.isValid
                    }
                    startIcon={
                      editReplyFormik.isSubmitting ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                  >
                    {editReplyFormik.isSubmitting ? "Đang lưu..." : "Lưu"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      <Dialog
        open={isDeleteReplyDialogOpen}
        onClose={cancelDeleteReply}
        aria-labelledby="delete-reply-dialog-title"
        aria-describedby="delete-reply-dialog-description"
      >
        <DialogTitle id="delete-reply-dialog-title">
          Xác Nhận Xóa Reply
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-reply-dialog-description">
            Bạn có chắc chắn muốn xóa reply này? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteReply} color="primary">
            Hủy
          </Button>
          <Button
            onClick={confirmDeleteReply}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
