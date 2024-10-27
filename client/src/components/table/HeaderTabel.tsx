import { ChangeEvent } from "react";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { StyledTableCell } from "./styles";

interface HeaderTableProps {
  heading: any[];
  hideSelectBtn?: boolean;
  onSelectAllClick?: (checked: boolean, defaultSelect: string) => void;
}
export default function HeaderTable(props: HeaderTableProps) {
  const { heading, onSelectAllClick = () => {}, hideSelectBtn = false } = props;

  return (
    <TableHead sx={{ backgroundColor: "grey.200" }}>
      <TableRow>
        {!hideSelectBtn ? (
          <StyledTableCell align="left">
            <Checkbox
              color="info"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onSelectAllClick(event.target.checked, "product")
              }
            />
          </StyledTableCell>
        ) : null}

        {heading.map((headCell) => (
          <StyledTableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
