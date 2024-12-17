import { InputBase, InputBaseProps } from "@mui/material";
import { Search } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styling cho InputBase
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: 44,
  fontSize: 14,
  width: "100%",
  maxWidth: 350,
  fontWeight: 500,
  padding: "0 1rem",
  borderRadius: "8px",
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { maxWidth: "100%" },
  "::placeholder": { color: theme.palette.text.disabled },
}));

// Mở rộng SearchInputProps để bao gồm tất cả các thuộc tính của InputBase
interface SearchInputProps extends InputBaseProps {
  startAdornment?: React.ReactNode;
  label?: string;
}

export default function SearchInput({
  startAdornment,
  label,
  ...props
}: SearchInputProps) {
  return (
    <StyledInputBase
      startAdornment={startAdornment || <Search sx={{ fontSize: 19, mr: 1 }} />}
      {...props} // Truyền tất cả các props còn lại vào InputBase
    />
  );
}
