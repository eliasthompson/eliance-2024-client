import type { RegionBoxProps } from '@/components/RegionBox/types';

import { css } from '@emotion/react';

import { FlexContainer } from '@/components/shared/FlexContainer';
import { formatAspectRatio } from '@/lib/formatAspectRatio';

export const regionTypeLabels = {
  camera: 'Camera',
  contentAux: 'Aux Content',
  contentMain: 'Main Content',
  info: 'Info',
  name: 'Name',
} as const satisfies Record<RegionBoxProps['type'], string>;

/** Smallest font the metrics are drawn at; below it, fewer lines are shown instead */
export const fontSizeMinRegionBox = 11;
/** Line height, and the average glyph width as a fraction of the font size, used to fit the lines in the box */
export const lineHeightRegionBox = 1.2;
export const glyphWidthRegionBox = 0.6;
export const paddingRegionBox = 4;

/**
 * Pick the most lines that fit the box at a readable size: all four, then the label and the size with the ratio,
 * then the label with the size, then the label alone, then nothing. The box's `title` keeps every value either way.
 */
export const fitRegionBoxLines = (lines: readonly string[][], width: number, height: number) => {
  for (const candidate of lines) {
    const lineLengthMax = Math.max(...candidate.map((line) => line.length));
    const fontSize = Math.min(
      (height - paddingRegionBox * 2) / (candidate.length * lineHeightRegionBox),
      (width - paddingRegionBox * 2) / (lineLengthMax * glyphWidthRegionBox),
    );

    if (fontSize >= fontSizeMinRegionBox) return { lines: candidate, fontSize };
  }

  return { lines: [], fontSize: fontSizeMinRegionBox };
};

export const RegionBox = ({ participantIndex, region, regionBorder = 0, type }: RegionBoxProps) => {
  const { x, y, width, height, hasBorder } = region;
  const hue = Math.round((participantIndex * 137.508) % 360);
  const isName = type === 'name';
  // A camera without a border is a green screen camera, which spreads over the gaps around it
  const isGreenScreen = type === 'camera' && !hasBorder;
  const aspectRatio = formatAspectRatio(width, height);
  const label = `${participantIndex + 1} • ${isGreenScreen ? `${regionTypeLabels[type]} (green screen)` : regionTypeLabels[type]}`;
  const size = `${width} × ${height}`;
  const position = `${x}, ${y}`;
  const { lines, fontSize } = fitRegionBoxLines(
    [
      [label, size, position, aspectRatio],
      [label, `${size} · ${aspectRatio}`],
      [label, size],
      [`${label} · ${size}`],
      [label],
    ],
    width,
    height,
  );

  const backgroundColorContainer = isName
    ? 'rgba(0, 0, 0, 50%)'
    : isGreenScreen
      ? 'hsl(120 100% 35% / 35%)'
      : `hsl(${hue} 80% 60% / 25%)`;
  const colorContainer = `hsl(${hue} 80% 60%)`;
  const outlineWidthContainer = hasBorder ? regionBorder : 0;
  const zIndexContainer = isName ? 2 : 1;

  const cssContainer = css`
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    z-index: ${zIndexContainer};
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: ${width}px;
    height: ${height}px;
    padding: ${paddingRegionBox}px;
    outline: ${outlineWidthContainer}px solid ${colorContainer};
    outline-offset: 0px;
    background-color: ${backgroundColorContainer};
    font-size: min(var(--font-size), ${fontSize}px);
    line-height: ${lineHeightRegionBox};
    text-align: center;
    white-space: nowrap;
  `;
  const cssSpanLabel = css`
    color: ${colorContainer};
    font-weight: 500;
  `;
  const cssSpanMetric = css`
    filter: brightness(67%);
  `;

  // Render component
  return (
    <FlexContainer
      column={true}
      cssContainer={cssContainer}
      title={`${type} ${x},${y} ${width}x${height} ${aspectRatio}`}
    >
      {lines.map((line, i) => (
        <span key={i} css={i === 0 ? cssSpanLabel : i === 1 ? undefined : cssSpanMetric}>
          {line}
        </span>
      ))}
    </FlexContainer>
  );
};
