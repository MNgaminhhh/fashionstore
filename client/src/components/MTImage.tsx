import Box, { BoxProps } from "@mui/material/Box";
import Image from 'next/image';

interface Props extends BoxProps {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
}

export default function MTImage(props: Props) {
    const {
        src,
        alt,
        fill,
        width,
        height,
        style,
        ...rest
    } = props;

    return (
        <Box {...rest}>
            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={width}
                height={height}
                style={{ objectFit: 'cover', ...style }}
            />
        </Box>
    );
}
