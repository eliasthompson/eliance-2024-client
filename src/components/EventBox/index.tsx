import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { CharityIcon } from '@components/shared/svgs/CharityIcon';
import { FlexContainer } from '@components/shared/FlexContainer';
import { FollowerIcon } from '@components/shared/svgs/FollowerIcon';
import { GoalInfo } from '@components/GoalInfo';
import { GoalInfoProps } from '@components/GoalInfo/types';
import { SubscriberIcon } from '@components/shared/svgs/SubscriberIcon';
import { TwitchIcon } from '@components/shared/svgs/TwitchIcon';
import { useGetCharityCampaignQuery } from '@store/apis/twitch/getCharityCampaign';
import { useGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';
import { useSelector } from '@store';

export const goalTypeIcons = {
  follower: FollowerIcon,
  default: TwitchIcon,
  new_subscription: SubscriberIcon,
  new_subscription_count: SubscriberIcon,
  subscription: SubscriberIcon,
  subscription_count: SubscriberIcon,
} as const;

export const goalTypeLabels = {
  follower: 'Followers',
  default: '',
  new_subscription: 'New Subscriber Points',
  new_subscription_count: 'New Subscribers',
  subscription: 'Subscriber Points',
  subscription_count: 'Subscribers',
} as const;

export const EventBox = () => {
  const { broadcasterId /* , events, isMuted, isPaused */ } = useSelector(({ info }) => info);
  const {
    data: charityCampaignData,
    // error: charityCampaignError,
    isLoading: isCharityCampaignLoading,
  } = useGetCharityCampaignQuery({ broadcasterId });
  const {
    data: creatorGoalsData,
    // error: creatorGoalsError,
    isLoading: isCreatorGoalsLoading,
  } = useGetCreatorGoalsQuery({ broadcasterId });
  // const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  // const [alert, setAlert] = useState<(typeof events)[number]>(null);
  const [goals, setGoals] = useState<GoalInfoProps['goal'][]>([]);
  const isLoading = isCharityCampaignLoading || isCreatorGoalsLoading;
  const isRenderable = !!(charityCampaignData && creatorGoalsData);

  useEffect(() => {
    if (charityCampaignData && charityCampaignData.data.length) {
      setGoals([
        {
          icon: CharityIcon,
          label: charityCampaignData.data[0].charity_name,
          logo: charityCampaignData.data[0].charity_logo,
          currentAmount:
            charityCampaignData.data[0].current_amount.value /
            10 ** charityCampaignData.data[0].current_amount.decimal_places,
          currentAmountCurrency: charityCampaignData.data[0].current_amount.currency,
          targetAmount:
            charityCampaignData.data[0].target_amount.value /
            10 ** charityCampaignData.data[0].target_amount.decimal_places,
          targetAmountCurrency: charityCampaignData.data[0].target_amount.currency,
        },
      ]);
    } else if (creatorGoalsData) {
      setGoals(
        creatorGoalsData.data.map((creatorGoalData) => ({
          icon: goalTypeIcons[creatorGoalData.type] || goalTypeIcons.default,
          label: goalTypeLabels[creatorGoalData.type] || goalTypeLabels.default,
          currentAmount: creatorGoalData.current_amount,
          targetAmount: creatorGoalData.target_amount,
        })),
      );
    }
  }, [charityCampaignData, creatorGoalsData, setGoals]);

  // useEffect(() => {
  //   if (!alert) {
  //     const foundAlert = events.findLast(({ isQueued }) => isQueued);
  //     if (foundAlert) {
  //       setAlert(foundAlert);
  //     }
  //   }
  // }, [events, !alert]);

  // useEffect(() => {
  //   if (alert) {
  //     setTimeout(() => {}, 10000);
  //   }
  // }, [alert]);

  // const opacityFlexGoalLabel = true ? '0' : '1';
  // const opacitySpanGoalLabel = true ? '0' : '1';
  const opacityFlexGoalLabel = '1';
  const opacitySpanGoalLabel = '1';

  const cssContainer = css`
    flex: 2;
    position: relative;
    display: flex;
    justify-content: center;
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.75));
    /* background-color: rgba(255, 255, 255, 0.025); */
  `;
  const cssContainerAlerts = css`
    flex: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  `;
  const cssContainerGoals = css`
    flex: 1;
    transition: flex 0.5s;
    /* background-color: rgba(255, 255, 255, 0.025); */

    span.goal-label {
      flex: ${opacityFlexGoalLabel};
      opacity: ${opacitySpanGoalLabel};
    }
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={cssContainer}>
      <FlexContainer cssContainer={cssContainerAlerts}></FlexContainer>

      {/* <div style={{ flex: 2, transition: 'flex 0.5s' }}></div> */}

      <FlexContainer cssContainer={cssContainerGoals}>
        {goals.map((goal, i) => (
          <GoalInfo key={i} goal={goal} isSmall={true} />
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
