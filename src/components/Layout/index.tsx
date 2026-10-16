import type { LayoutMetric } from 'obs-layout-generator';

import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateLayout, LAYOUT_OPTIONS_DEFAULT } from 'obs-layout-generator';

import { FlexContainer } from '@components/shared/FlexContainer';
import { RegionBox } from '@components/RegionBox';
import { layoutOptions as layoutOptionsConfig } from '@config';
import { parseLayoutSearchParams } from '@lib/parseLayoutSearchParams';

export const regionTypes = [
  'contentMain',
  'contentAux',
  'info',
  'camera',
  'name',
] as const satisfies readonly (keyof LayoutMetric)[];

export const Layout = () => {
  const [searchParams] = useSearchParams();
  const { layoutMetrics, layoutOptions } = useMemo(() => {
    const parsedLayoutSearchParams = parseLayoutSearchParams(searchParams);
    const layoutOptions = { ...layoutOptionsConfig, ...parsedLayoutSearchParams.layoutOptions };

    return { layoutMetrics: generateLayout(parsedLayoutSearchParams.layoutConfigs, layoutOptions), layoutOptions };
  }, [searchParams]);
  const {
    canvasWidth = LAYOUT_OPTIONS_DEFAULT.canvasWidth,
    canvasHeight = LAYOUT_OPTIONS_DEFAULT.canvasHeight,
    regionBorder = LAYOUT_OPTIONS_DEFAULT.regionBorder,
  } = layoutOptions;
  const isRenderable = !!layoutMetrics.length;

  const cssContainer = css`
    flex: none;
    position: relative;
    overflow: hidden;
    width: ${canvasWidth}px;
    height: ${canvasHeight}px;
  `;

  // Render nothing if required data is incomplete
  if (!isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      {layoutMetrics.map((layoutMetric, i) =>
        regionTypes.map((type) => {
          const region = layoutMetric[type];

          if (!region) return null;

          return (
            <RegionBox
              key={`${i}-${type}`}
              participantIndex={i}
              region={region}
              regionBorder={regionBorder}
              type={type}
            />
          );
        }),
      )}
    </FlexContainer>
  );
};
