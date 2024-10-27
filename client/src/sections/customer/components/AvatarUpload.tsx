import { useState } from "react"; // Nhập useState
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CameraEnhance from "@mui/icons-material/CameraEnhance";
import { FlexBox } from "../../../components/flexbox";

export default function AvatarUpload() {
  const [avatarSrc, setAvatarSrc] = useState("/assets/images/faces/ralph.png");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarSrc(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <FlexBox alignItems="center" mb={3}>
      <Avatar
        alt="User Profile Picture"
        src={avatarSrc}
        sx={{
          height: 64,
          width: 64,
          border: "2px solid #1976d2",
          boxShadow: 2,
        }}
      />

      <IconButton
        size="small"
        component="label"
        color="secondary"
        htmlFor="profile-image"
        sx={{ bgcolor: "grey.300", ml: -2.1, mb: -3 }}
      >
        <CameraEnhance fontSize="small" />
      </IconButton>

      <Box
        type="file"
        display="none"
        accept="image/*"
        component="input"
        id="profile-image"
        onChange={handleFileChange}
      />
    </FlexBox>
  );
}
