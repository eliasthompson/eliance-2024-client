import { css } from '@emotion/react';

import type { GoalInfoProps } from '@components/GoalInfo/types';

import { FlexContainer } from '@components/shared/FlexContainer';
import { useSelector } from '@store';

export const GoalInfo = ({ goal }: GoalInfoProps) => {
  const { broadcasterColor } = useSelector(({ info }) => info);

  const cssContainer = css`
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: var(--padding);
    transition: flex 0.5s;
  `;
  const cssContainerInfo = css`
    position: relative;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width: 100%;
  `;
  const cssSpanInfo = css`
    display: flex;
    align-items: baseline;
  `;
  const cssIconType = css`
    align-self: flex-end;
  `;
  const cssSpanLabel = css`
    display: inline-flex;
    overflow-x: hidden;
    transition:
      flex 0.5s,
      opacity 0.5s;
  `;
  const cssSpanGoal = css`
    filter: brightness(67%);
  `;
  const cssHrBar = css`
    position: relative;
    overflow-x: hidden;
    width: 100%;
    height: calc(var(--padding) * 0.75);
    margin-top: var(--padding);
    background-color: #404040;
  `;
  const cssHrProgress = css`
    position: absolute;
    left: 0px;
    width: ${(goal.currentAmount / goal.targetAmount) * 100}%;
    height: calc(var(--padding) * 0.75);
    background-color: ${broadcasterColor};
  `;

  // Render component
  return (
    <FlexContainer column={true} cssContainer={cssContainer}>
      <FlexContainer cssContainer={cssContainerInfo}>
        <span css={cssSpanInfo}>
          <goal.icon filled={true} colored={true} cssIcon={cssIconType} />
          <span className="goal-label" css={cssSpanLabel}>
            &nbsp;{goal.label}
          </span>
        </span>

        <span css={cssSpanGoal}>
          &nbsp;{goal.currentAmount}/{goal.targetAmount}
        </span>
      </FlexContainer>

      <div css={cssHrBar}>
        <hr css={cssHrProgress} />
      </div>
    </FlexContainer>
  );
};
