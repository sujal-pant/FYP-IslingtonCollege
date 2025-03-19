import { convertStrokeToSvgPath } from '@/utils/pentool_utils';
import getStroke from 'perfect-freehand';
import { useMemo } from 'react';

interface PenToolProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
}

export const PenTool = ({ x, y, points, fill, onPointerDown, stroke }: PenToolProps) => {
  const pathData = useMemo(() => {
    if (!points.length) return '';
    const strokePoints = getStroke(points, {
      size: 20,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });
    return convertStrokeToSvgPath(strokePoints);
  }, [points]);

  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={pathData}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
