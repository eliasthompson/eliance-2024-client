import type { IconProps } from '@components/shared/svgs/types';

import { css } from '@emotion/react';
import { Fragment, FunctionComponent, useEffect, useRef, useState } from 'react';

import { AnnouncementIcon } from '@components/shared/svgs/AnnouncementIcon';
import { BitsIcon } from '@components/shared/svgs/BitsIcon';
import { ChannelPointIcon } from '@components/shared/svgs/ChannelPointIcon';
import { CharityIcon } from '@components/shared/svgs/CharityIcon';
import { EmptyComponent } from '@components/shared/EmptyComponent';
import { FlexContainer } from '@components/shared/FlexContainer';
import { FollowerIcon } from '@components/shared/svgs/FollowerIcon';
import { GoalInfo } from '@components/GoalInfo';
import { GoalInfoProps } from '@components/GoalInfo/types';
import { Message } from '@components/shared/Message';
import { RaidIcon } from '@components/shared/svgs/RaidIcon';
import { SubscriberIcon } from '@components/shared/svgs/SubscriberIcon';
import { TwitchIcon } from '@components/shared/svgs/TwitchIcon';
import { changeAlert, setInfo } from '@store/slices/info';
import { useGetCharityCampaignQuery } from '@store/apis/twitch/getCharityCampaign';
import { useGetCreatorGoalsQuery } from '@store/apis/twitch/getCreatorGoals';
import { useDispatch, useSelector } from '@store';

export const alertTypeIcons = {
  announcement: AnnouncementIcon,
  channel_point_redemption: ChannelPointIcon,
  cheer: BitsIcon,
  community_sub_gift: SubscriberIcon,
  default: EmptyComponent,
  follow: FollowerIcon,
  raid: RaidIcon,
  resub: SubscriberIcon,
  sub: SubscriberIcon,
  sub_gift: SubscriberIcon,
} as const;

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

export const initialAlertIcon = () => alertTypeIcons.default;

export const EventBox = () => {
  const dispatch = useDispatch();
  const { activeAlert, alerts, broadcasterId /* , isAlertsPaused */ } = useSelector(({ info }) => info);
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
  const [AlertIcon, setAlertIcon] = useState<FunctionComponent<IconProps>>(initialAlertIcon);
  const [goals, setGoals] = useState<GoalInfoProps['goal'][]>([]);
  const activeAlertTimeoutIdRef = useRef<NodeJS.Timeout>(null);
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

  // Set active alert
  useEffect(() => {
    dispatch(setInfo({ activeAlert: alerts.findLast(({ isQueued }) => isQueued) || null }));
  }, [alerts, dispatch]);

  // Set active alert icon
  useEffect(() => {
    if (activeAlert) setAlertIcon(() => alertTypeIcons[activeAlert.type]);
    else setAlertIcon(initialAlertIcon);
  }, [activeAlert, setAlertIcon]);

  // Set active alert timeout to unqueue it
  useEffect(() => {
    if (activeAlert) {
      clearTimeout(activeAlertTimeoutIdRef.current);

      activeAlertTimeoutIdRef.current = setTimeout(() => {
        dispatch(changeAlert({ id: activeAlert.id, isQueued: false }));
      }, 10000);
    }

    return () => clearTimeout(activeAlertTimeoutIdRef.current);
  }, [activeAlert, activeAlertTimeoutIdRef, dispatch]);

  const containerAlertOpacity = activeAlert ? '1' : '0';
  const containerGoalsOpacity = activeAlert ? '0' : '1';
  const spanGoalLabelFlex = '1';
  const spanGoalLabelOpacity = '1';

  const containerCss = css`
    flex: 2;
    position: relative;
    display: flex;
    justify-content: center;
    filter: drop-shadow(#000000 0 0 calc(var(--padding) * 0.75));
  `;
  const containerAlertCss = css`
    align-self: center;
    flex: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${containerAlertOpacity};
    font-size: calc(var(--font-size) * 1.25);
    transition: opacity 0.5s;
  `;
  const iconAlertCss = css`
    min-width: calc(var(--line-height) * 1.25);
    min-height: calc(var(--line-height) * 1.25);
  `;
  const containerGoalsCss = css`
    flex: 1;
    opacity: ${containerGoalsOpacity};
    transition:
      flex 0.5s,
      opacity 0.5s;

    span.goal-label {
      flex: ${spanGoalLabelFlex};
      opacity: ${spanGoalLabelOpacity};
    }
  `;

  // Render nothing if data is loading or required data is incomplete
  if (isLoading || !isRenderable) return false;

  // Render component
  return (
    <FlexContainer cssContainer={containerCss}>
      <FlexContainer cssContainer={containerAlertCss}>
        {!!activeAlert && (
          <Fragment>
            <AlertIcon cssIcon={iconAlertCss} colored={true} filled={true} />
            &nbsp;
            <Message message={activeAlert?.message} />
          </Fragment>
        )}
      </FlexContainer>

      {/* <div style={{ flex: 2, transition: 'flex 0.5s' }}></div> */}

      <FlexContainer cssContainer={containerGoalsCss}>
        {goals.map((goal, i) => (
          <GoalInfo key={i} goal={goal} isSmall={true} />
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
