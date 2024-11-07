import { ReactNode } from "react";
import { BoxProps } from "@mui/material/Box";
import { Dot, DotList } from "../styles";

interface DotsProps extends BoxProps {
  dotColor?: string;
}

export default function Dots({ dotColor, ...props }: DotsProps) {
  return {
    customPaging: () => <Dot dotColor={dotColor} />,
    appendDots: (dots: ReactNode) => (
      <DotList component="ul" {...props}>
        {dots}
      </DotList>
    ),
  };
}
