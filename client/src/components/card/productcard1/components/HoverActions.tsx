import IconButton from "@mui/material/IconButton";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import { HoverIconWrapper } from "../styles";
interface Props {
  toggleView: () => void;
}

export default function HoverActions({ toggleView }: Props) {
  return (
    <HoverIconWrapper className="hover-box">
      <IconButton onClick={toggleView}>
        <RemoveRedEye color="disabled" fontSize="small" />
      </IconButton>
    </HoverIconWrapper>
  );
}
