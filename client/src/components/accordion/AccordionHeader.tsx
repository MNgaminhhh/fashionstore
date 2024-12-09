import { ReactNode } from "react";
import { StyledAccordion } from "./styles";
import { BoxProps } from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import ChevronRight from "@mui/icons-material/ChevronRight";

interface AccordionProps extends BoxProps {
  open?: boolean;
  showIcon?: boolean;
  sx?: SxProps<Theme>;
  children: ReactNode;
  onClick?: () => void;
}

export default function AccordionHeader(props: AccordionProps) {
  const { open, children, showIcon = true, onClick, ...others } = props;

  return (
    <StyledAccordion open={open ? 1 : 0} onClick={onClick} {...others}>
      {children}
      {showIcon && <ChevronRight className="accor" fontSize="small" />}
    </StyledAccordion>
  );
}
