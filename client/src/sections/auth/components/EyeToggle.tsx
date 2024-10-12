import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface EyeToggleProps {
    show: boolean;
    click: () => void;
}
export default function EyeToggle({ show, click }: EyeToggleProps) {
    return (
        <IconButton size="small" onClick={click}>
            {show ? (
                <Visibility fontSize="small" sx={{ color: "grey.700" }} />
            ) : (
                <VisibilityOff fontSize="small" sx={{ color: "grey.500" }} />
            )}
        </IconButton>
    );
}
