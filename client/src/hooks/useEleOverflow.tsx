import { useRef, useState, useEffect, useCallback } from "react";

export default function useEleOverflow() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState({
    left: false,
    right: false,
    overflowRightAmount: 0,
  });

  const checkOverflow = useCallback(() => {
    const element = elementRef.current;

    if (element) {
      const elementRect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      const overflowRightAmount = elementRect.right - viewportWidth;

      setIsOverflowing({
        left: elementRect.left < 0,
        right: overflowRightAmount > 0,
        overflowRightAmount: overflowRightAmount > 0 ? overflowRightAmount : 0,
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
