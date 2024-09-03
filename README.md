# Eliance 2024 Client

## Todo

- [ ] person box
  - [ ] rotate between persons
  - [ ] refocus to broadcaster and hide guests on big event
  - [ ] data for each person:
    - [ ] profile pic (twitch profile pic)
    - [ ] name (firebot name > twitch display name)
    - [ ] pronouns (pronouns pronouns > firebot pronouns > null)
    - [ ] twitch username (twitch login)
    - [ ] local time(?) (firebot timezone > null)
    - [ ] upcoming schedule(?) (twitch schedule > null)
    - [ ] endpoints:
      - [ ]
    - [ ] event subs:
      - [ ]
- [ ] event box
  - [ ] small events, social actions, and goals stay in box, big event expand the box to near full width
  - [ ] big events (event queue):
    - [ ] hype train created
    - [ ] hype train success
    - [ ] poll created
    - [ ] prediction created
    - [ ] prediction results
    - [ ] shoutout
    - [ ] announcement
    - [ ] raid
    - [ ] sub
    - [ ] resub
    - [ ] gift sub
    - [ ] community gift subs
    - [ ] prime sub
    - [ ] cheer
    - [ ] pyonchi cam
    - [ ] pyonchi treat
    - [ ] ring fit break
    - [ ] add quote
    - [ ] add one ice cube to water
    - [ ] [any cameo redemption]
    - [ ] backlog wheel selection
    - [ ] become vip
    - [ ] add custom layout element
    - [ ] channel goal created
    - [ ] channel goal met
    - [ ] charity donation
    - [ ] donation goal met
  - [ ] small events (event queue - always shown after big events):
    - [ ] poll results
    - [ ] hype train failure
    - [ ] new follower
    - [ ] hydrate
    - [ ] give mary a cookie
  - [ ] social actions (on until over):
    - [ ] poll AND hype train (rotate)
    - [ ] predicitons AND pinned chat (rotate)
  - [ ] goals:
    - [ ] channel goals loop
    - [ ] donation goals
  - [ ] endpoints:
    - [ ]
  - [ ] event subs:
    - [ ]
- [ ] chat box
  - [ ] hide on big event
  - [ ] handle:
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
  - [ ] data for each chat:
    - [ ] `channel.chat.message`
      - [ ] message types:
        - [x] `text`
        - [x] `channel_points_highlighted` - channel point
        - [?] `channel_points_sub_only` - channel point
        - [?] `user_intro` - sparkle(?)
        - [ ] `power_ups_message_effect` - bits
        - [ ] `power_ups_gigantified_emote` - bits
    - [ ] `channel.chat.notification`
      - [ ] notice types:
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
    - [ ] endpoints:
      - [x] [`GET chat/badges`](https://dev.twitch.tv/docs/api/reference/#get-channel-chat-badges)
      - [x] [`GET chat/badges/global`](https://dev.twitch.tv/docs/api/reference/#get-global-chat-badges)
      - [x] [`GET chat/emotes/global`](https://dev.twitch.tv/docs/api/reference/#get-global-emotes)
      - [x] [`GET pronouns`](https://pronouns.alejo.io/api/pronouns)
      - [x] [`GET users/:login`](https://pronouns.alejo.io/api/users/eliasthompson)
  - [ ] show/parse:
    - [x] text
    - [x] emotes
    - [x] badges
    - [x] pronouns
    - [x] mentions
    - [x] replies
    - [x] username
    - [x] color
    - [ ] bits - bits
    - [x] notice/message type
    - [x] `/me`
- [ ] error display and handling
- [ ] design
- [ ] animations

### Guest/User Data Flow

- on load:
  - [x] Twitch: `GET /validate` Validate Token - get broadcaster id and do an auth check
  - [x] Chat Pronouns: `GET /pronouns` Get Pronouns - get pronoun data for reference
  - [x] Firebot: `GET /customRoles/:customRoleId` Get Custom Role - get all existing guest ids
  - when initial data is loaded, then:
    - [x] Twitch: `GET /guest_star/session` Get Guest Star Session - get all guest ids who are in guest star
    - if there are guests to add, then:
      - [x] Firebot: `POST /customRoles/:customRoleId/viewers/:userId` Add Viewer To Custom Role - add guests to custom role
    - get all person data:
      - [x] Twitch: `GET /chat/color` Get User Chat Color - get color data on all persons (color = firebotColor)
      - [x] Chat Pronouns: `GET /users/:login` Get User - get user pronoun data on all persons (pronouns)
      - [x] Firebot: `GET /viewers/:userId` Get Viewer - get viewer data on all persons (color = defaultColor, name = displayName, pronouns = apiPronouns)
      - [x] Twitch: `GET /users` Get Users - get user data on all persons (display_name, profile_image_url, login)
      - [x] Twitch: `GET /streams` Get Streams - get stream data on all persons (isLive)
      - if viewer has no metadata, then:
        - [ ] Firebot: `POST /viewers/:userId` Add Metadata To View - add metadata to viewer (only iscontent, )
    - combine & show data
- [ ] on event:
  - [ ] on guest star guest update:
    - [ ] fix guest list and refetch stuff if needed
  - [ ] on firebot custom role update
    - [ ] fix guest list and refetch stuff if needed
