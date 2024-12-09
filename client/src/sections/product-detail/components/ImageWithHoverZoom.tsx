"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

type ImageWithHoverZoomProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const ZoomedImageBox = styled(Box)(({ theme }) => ({
  width: 700,
  height: 700,
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  borderRadius: 2,
  boxShadow: theme.shadows[3],
  position: "absolute",
  top: 0,
  left: "110%",
  zIndex: 10,
  backgroundRepeat: "no-repeat",
  backgroundSize: "200%",
}));

const ImageContainer = styled(Box)({
  position: "relative",
  display: "inline-block",
});

export default function ImageWithHoverZoom({
  src,
  alt,
  width,
  height,
}: ImageWithHoverZoomProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    if (imageRef.current) {
      const { width, height } = imageRef.current.getBoundingClientRect();
      setImageSize({ width, height });
    }
  }, [src]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPos({ x, y });
    }
  };

  const backgroundPosX = (cursorPos.x / imageSize.width) * 100;
  const backgroundPosY = (cursorPos.y / imageSize.height) * 100;

  return (
    <ImageContainer>
      <Box
        ref={imageRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        sx={{ width, height, position: "relative", borderRadius: 2 }}
      >
        <Box borderRadius={10} sx={{ overflow: "hidden" }}>
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="cover"
            priority={true}
            style={{ borderRadius: 10 }}
          />
        </Box>
        {isHovering && (
          <ZoomedImageBox
            sx={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${backgroundPosX}% ${backgroundPosY}%`,
            }}
          />
        )}
      </Box>
    </ImageContainer>
  );
}
