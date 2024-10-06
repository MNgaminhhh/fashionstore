import { useRef, useState, useEffect, useCallback } from "react";

export default function useEleOverflow() {
  const elementRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState({
    left: false,
    right: false,
  });

  const checkOverflow = useCallback(() => {
    const element = elementRef.current;

    if (element) {
      const elementRect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      setIsOverflowing({
        left: elementRect.left < 0,
        right: elementRect.right > viewportWidth,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", checkOverflow);
    window.addEventListener("scroll", checkOverflow);
    checkOverflow();

    return () => {
      window.removeEventListener("resize", checkOverflow);
      window.removeEventListener("scroll", checkOverflow);
    };
  }, [checkOverflow]);

  return { elementRef, isOverflowing, checkOverflow };
}
