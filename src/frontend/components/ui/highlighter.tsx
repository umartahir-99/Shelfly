"use client";

import React, { useMemo } from "react";
import { annotate } from "rough-notation";

interface HighlighterProps {
  children: React.ReactNode;
  color?: string;
  action?: "highlight" | "underline" | "box" | "circle";
  className?: string;
}

export function Highlighter({
  children,
  color = "#FFB86B",
  action = "highlight",
  className = "",
}: HighlighterProps) {
  const annotationRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!annotationRef.current) return;

    const annotation = annotate(annotationRef.current, {
      type: action,
      color,
      padding: 4,
      strokeWidth: 2,
      multiline: true,
      iterations: 2,
    });

    annotation.show();

    return () => annotation.remove();
  }, [action, color]);

  return (
    <span ref={annotationRef} className={className}>
      {children}
    </span>
  );
}
