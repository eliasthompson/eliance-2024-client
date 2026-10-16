import type { LayoutMetric, LayoutRegion } from 'obs-layout-generator';

export interface RegionBoxProps {
  participantIndex: number;
  region: LayoutRegion;
  regionBorder?: number;
  type: keyof LayoutMetric;
}
