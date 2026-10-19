import type { LayoutMetric, LayoutRegion } from '@eliasthompson/obs-layout-generator';

export interface RegionBoxProps {
  participantIndex: number;
  region: LayoutRegion;
  regionBorder?: number;
  type: keyof LayoutMetric;
}
