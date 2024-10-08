# Eliance 2024 Client

## Todo

- [ ] BUG: Config import
- [ ] person box
  - [ ] BUG: interval desync of schedule slideshow
  - [ ] BUG: proper timeout for clocks needed
  - [ ] refocus to broadcaster and hide guests on big event
  - [x] automatic retry of firebot connection
  - [x] guest star works for non-hosted sessions
  - [x] rotate between persons
  - [x] rotate between info and schedule
  - [x] sync guest star guests to firebot
  - [x] data for each person:
    - [x] profile pic (twitch profile pic)
    - [x] name (firebot name > twitch display name)
    - [x] pronouns (pronouns pronouns > firebot pronouns > null)
    - [x] social (firebot social > twitch login)
    - [x] local time(?) (firebot timezone > null)
    - [x] isLive dot (twitch stream islive)
    - [x] upcoming schedule(?) (twitch schedule > null)
    - [x] endpoints:
      - [x] [`GET chat/color`](https://dev.twitch.tv/docs/api/reference/#get-user-chat-color)
      - [x] [`GET customRoles/:customRoleId`](https://github.com/crowbartools/Firebot/blob/v5.63.0-beta3/src/server/api/v1/v1Router.js)
      - [x] [`GET guest_star/session`](https://dev.twitch.tv/docs/api/reference/#get-guest-star-session)
      - [x] [`GET schedule`](https://dev.twitch.tv/docs/api/reference/#get-channel-stream-schedule)
      - [x] [`GET streams`](https://dev.twitch.tv/docs/api/reference/#get-streams)
      - [x] [`GET users`](https://dev.twitch.tv/docs/api/reference/#get-users)
      - [x] [`GET viewers/export`](https://github.com/crowbartools/Firebot/blob/v5.63.0-beta3/src/server/api/v1/v1Router.js)
      - [x] [`GET pronouns`](https://pronouns.alejo.io/api/pronouns)
      - [x] [`GET users/:login`](https://pronouns.alejo.io/api/users/eliasthompson)
      - [x] [`POST customRoles/:customRoleId/viewers/:userId`](https://github.com/crowbartools/Firebot/blob/v5.63.0-beta3/src/server/api/v1/v1Router.js)
    - [x] event subs:
      - [x] `custom-role:updated`
      - [x] `viewer-metadata:created`
      - [x] `viewer-metadata:updated`
      - [x] `viewer-metadata:deleted`
      - [x] `channel.guest_star_guest.update`
      - [x] `channel.guest_star_session.begin`
      - [x] `channel.guest_star_session.end`
      - [x] `channel.guest_star_session.end`
      - [?] `stream.online`
      - [?] `stream.offline`
- [ ] event box
  - [ ] small events, social actions, and goals stay in box, big event expand the box to near full width
  - [ ] big events (event queue):
    - [ ] hype train created
      - [ ] [`channel.hype_train.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelhype_trainbegin)
    - [ ] hype train level up
      - [ ] [`channel.hype_train.progress`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelhype_trainprogress)
    - [ ] hype train success
      - [ ] [`channel.hype_train.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelhype_trainend)
    - [ ] poll created
      - [ ] [`channel.poll.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollbegin)
    - [ ] prediction created
      - [ ] [`channel.prediction.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionbegin)
    - [ ] prediction results
      - [ ] [`channel.prediction.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionend)
    - [ ] channel goal created
      - [ ] [`channel.goal.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelgoalbegin)
    - [ ] channel goal met
      - [ ] [`channel.goal.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelgoalend)
    - [ ] donation goal met
      - [ ] [`channel.charity_campaign.progress`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelcharity_campaignprogress)
    - [ ] shoutout
      - [ ] [`channel.shoutout.create`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelshoutoutcreate)
    - [ ] cheer
      - [ ] [`channel.cheer`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelcheer)
    - [x] announcement
      - [x] [`channel.chat.notification` `notice_type.announcement`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
    - [ ] charity donation
      - [ ] [`channel.chat.notification` `notice_type.charity_donation`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
    - [x] raid
      - [x] [`channel.chat.notification` `notice_type.raid`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
    - [x] sub
      - [x] [`channel.chat.notification` `notice_type.sub`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
    - [x] resub
      - [x] [`channel.chat.notification` `notice_type.resub`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
    - [x] gift sub
      - [x] [`channel.chat.notification` `notice_type.sub_gift`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
    - [x] community gift sub
      - [x] [`channel.chat.notification` `notice_type.community_sub_gift`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
    - [x] pyonchi cam
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] pyonchi treat
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] ring fit break
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] add quote
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] add one ice cube to water
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] [any cameo redemption]
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] backlog wheel selection
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] become vip
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] add custom layout element
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
  - [ ] small events (event queue - always shown after big events):
    - [ ] poll results
      - [ ] [`channel.poll.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollend)
    - [ ] new follower
      - [ ] [`channel.follow`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelfollow)
    - [x] hydrate
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
    - [x] give mary a cookie
      - [x] [`channel.channel_points_custom_reward_redemption.add`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd)
  - [ ] social actions (on until over):
    - [ ] poll AND hype train (rotate)
      - [ ] [`GET hypetrain/events`](https://dev.twitch.tv/docs/api/reference/#get-hype-train-events)
      - [ ] [`channel.hype_train.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelhype_trainbegin)
      - [ ] [`channel.hype_train.progress`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelhype_trainprogress)
      - [ ] [`channel.hype_train.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelhype_trainend)
      - [ ] [`GET polls`](https://dev.twitch.tv/docs/api/reference/#get-polls)
      - [ ] [`channel.poll.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollbegin)
      - [ ] [`channel.poll.progress`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollprogress)
      - [ ] [`channel.poll.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpollend)
    - [ ] predictions AND pinned chat (rotate)
      - [ ] [`GET predictions`](https://dev.twitch.tv/docs/api/reference/#get-predictions)
      - [ ] [`channel.prediction.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionbegin)
      - [ ] [`channel.prediction.progress`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionprogress)
      - [ ] [`channel.prediction.lock`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionlock)
      - [ ] [`channel.prediction.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelpredictionend)
      - [ ] `pinned-chat-updates-v1.${broadcasterId}` `pin-message`
      - [ ] `pinned-chat-updates-v1.${broadcasterId}` `update-message`
      - [ ] `pinned-chat-updates-v1.${broadcasterId}` `unpin-message`
  - [ ] goals:
    - [ ] donation goals
      - [ ] [`GET charity/campaigns`](https://dev.twitch.tv/docs/api/reference/#get-charity-campaign)
      - [ ] [`channel.charity_campaign.start`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelcharity_campaignstart)
      - [ ] [`channel.charity_campaign.progress`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelcharity_campaignprogress)
      - [ ] [`channel.charity_campaign.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelcharity_campaignstop)
    - [ ] channel goals loop
      - [x] [`GET goals`](https://dev.twitch.tv/docs/api/reference/#get-creator-goals)
      - [ ] [`channel.goal.begin`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelgoalbegin)
      - [ ] [`channel.goal.progress`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelgoalprogress)
      - [ ] [`channel.goal.end`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelgoalend)
- [ ] chat box
  - [ ] hide on big event
  - [-] shared chat support
  - [x] handle:
    - [x] messages
    - [x] notifications
    - [x] settings
    - [x] deletes
    - [x] timeouts
    - [x] clears
  - [x] store three latest chats, clear on clear
  - [x] chat mode column w/ icons (?)
    - [x] follower mode
    - [x] subscriber mode (?)
    - [ ] slow mode (?)
    - [x] emote mode
    - [x] endpoints:
      - [x] [`GET chat/settings`](https://dev.twitch.tv/docs/api/reference/#get-chat-settings)
      - [x] [`POST eventsub/subscriptions`](https://dev.twitch.tv/docs/api/reference/#create-eventsub-subscription)
    - [x] event subs:
      - [x] [`channel.chat.clear`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatclear)
      - [x] [`channel.chat.message`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatmessage)
      - [x] [`channel.chat.notification`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatnotification)
      - [x] [`channel.chat_settings.update`](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchat_settingsupdate)
  - [x] data for each chat:
    - [x] `channel.chat.message`
      - [x] message types:
        - [x] `text`
        - [x] `channel_points_highlighted` - channel point
        - [?] `channel_points_sub_only` - channel point
        - [?] `user_intro` - sparkle(?)
        - [x] `power_ups_message_effect` - bits
        - [x] `power_ups_gigantified_emote` - bits
    - [x] `channel.chat.notification`
      - [x] notice types:
        - [x] `sub` - unhandled
        - [?] `resub` - handled - star
        - [x] `sub_gift` - unhandled
        - [x] `community_sub_gift` - unhandled
        - [x] `gift_paid_upgrade` - unhandled
        - [x] `prime_paid_upgrade` - unhandled
        - [x] `raid` - unhandled
        - [x] `unraid` - unhandled
        - [x] `pay_it_forward` - unhandled
        - [x] `announcement` - handled - megaphone
        - [?] `bits_badge_tier` - handled only if includes messages - bits
        - [x] `charity_donation` - unhandled
    - [x] endpoints:
      - [x] [`GET chat/badges`](https://dev.twitch.tv/docs/api/reference/#get-channel-chat-badges)
      - [x] [`GET chat/badges/global`](https://dev.twitch.tv/docs/api/reference/#get-global-chat-badges)
      - [x] [`GET chat/emotes/global`](https://dev.twitch.tv/docs/api/reference/#get-global-emotes)
      - [x] [`GET pronouns`](https://pronouns.alejo.io/api/pronouns)
      - [x] [`GET users/:login`](https://pronouns.alejo.io/api/users/eliasthompson)
  - [x] show/parse:
    - [x] text
    - [x] emotes
    - [x] badges
    - [x] pronouns
    - [x] mentions
    - [x] replies
    - [x] username
    - [x] color
    - [x] bits - bits
    - [x] notice/message type
    - [x] `/me`
- [ ] error display and handling
- [ ] design
- [ ] animations
