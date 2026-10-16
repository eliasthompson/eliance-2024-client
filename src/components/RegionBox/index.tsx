import type { RegionBoxProps } from '@components/RegionBox/types';

import { css } from '@emotion/react';

import { FlexContainer } from '@components/shared/FlexContainer';
import { formatAspectRatio } from '@lib/formatAspectRatio';

export const regionTypeLabels = {
  camera: 'Camera',
  contentAux: 'Aux Content',
  contentMain: 'Main Content',
  info: 'Info',
  name: 'Name',
} as const satisfies Record<RegionBoxProps['type'], string>;

export const RegionBox = ({ participantIndex, region, regionBorder = 0, type }: RegionBoxProps) => {
  const { x, y, width, height } = region;
  const hue = Math.round((participantIndex * 137.508) % 360);
  const isName = type === 'name';
  const aspectRatio = formatAspectRatio(width, height);

  const backgroundColorContainer = isName ? 'rgba(0, 0, 0, 50%)' : `hsl(${hue} 80% 60% / 25%)`;
  const colorContainer = `hsl(${hue} 80% 60%)`;
  const outlineWidthContainer = isName ? 0 : regionBorder;
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
    border: 1px dashed ${colorContainer};
    outline: ${outlineWidthContainer}px solid ${colorContainer};
    outline-offset: 0px;
    background-color: ${backgroundColorContainer};
    font-size: min(var(--font-size), ${height / 4}px);
    line-height: 1.2;
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
    <FlexContainer column={true} cssContainer={cssContainer} title={`${type} ${x},${y} ${width}x${height}`}>
      <span css={cssSpanLabel}>
        {participantIndex + 1} &#8226; {regionTypeLabels[type]}
      </span>
      <span>
        {width} &times; {height}
      </span>
      <span css={cssSpanMetric}>
        {x}, {y}
      </span>
      <span css={cssSpanMetric}>{aspectRatio}</span>
    </FlexContainer>
  );
};
