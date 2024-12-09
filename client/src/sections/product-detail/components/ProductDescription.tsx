"use client";

import React from "react";
import Box from "@mui/material/Box";
import { Paragraph } from "../../../components/Typography";
import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

interface ProductDescriptionProps {
  long_description: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[500]}`,
  padding: theme.spacing(1),
  textAlign: "left",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
}));

export default function ProductDescription({
  long_description,
}: ProductDescriptionProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        const { name, children, attribs } = domNode;
        if (name === "table") {
          return (
            <TableContainer component={Paper} sx={{ my: 2 }}>
              <Table>{domToReact(children, options)}</Table>
            </TableContainer>
          );
        }
        if (name === "thead") {
          return <TableHead>{domToReact(children, options)}</TableHead>;
        }
        if (name === "tbody") {
          return <TableBody>{domToReact(children, options)}</TableBody>;
        }
        if (name === "tr") {
          return (
            <StyledTableRow>{domToReact(children, options)}</StyledTableRow>
          );
        }
        if (name === "th" || name === "td") {
          return (
            <StyledTableCell>{domToReact(children, options)}</StyledTableCell>
          );
        }
        if (name === "p" && children.some((child) => child.name === "table")) {
          return <>{domToReact(children, options)}</>;
        }
      }
    },
  };

  const parsedContent = parse(long_description, options);

  return <Box>{parsedContent}</Box>;
}
