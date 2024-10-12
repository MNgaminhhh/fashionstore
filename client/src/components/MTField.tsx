import Box, { BoxProps } from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { H6 } from "./Typography";

type MTFieldProps = TextFieldProps & BoxProps;
export default function MTField({ label, InputProps, ...props }: MTFieldProps) {
    const boxProps: Partial<BoxProps> = {};
    const textFieldProps: Partial<TextFieldProps> = {};

    for (const key in props) {
        if (SPACE_PROPS_LIST.includes(key)) {
            (boxProps as any)[key] = props[key];
        } else {
            (textFieldProps as any)[key] = props[key];
        }
    }

    return (
        <Box {...boxProps}>
            {label && (
                <H6 mb={1} fontSize={13} color="grey.700">
                    {label}
                </H6>
            )}
            <TextField
                InputProps={{ ...InputProps, style: { ...InputProps?.style, height: 44 } }}
                {...textFieldProps}
            />
        </Box>
    );
}
const SPACE_PROPS_LIST: readonly string[] = [
    "m",
    "mt",
    "mr",
    "mb",
    "ml",
    "mx",
    "my",
    "p",
    "pt",
    "pr",
    "pb",
    "pl",
    "px",
    "py",
    "margin",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "marginX",
    "marginY",
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "paddingX",
    "paddingY"
];
