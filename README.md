# Eliance 2024 Client

Browser source overlays for a Twitch stream, built to run inside OBS at 1920×1080, with the info bar and layout preview also at 1080×1920 for Twitch's Dual Format vertical canvas. Each hash route is one overlay: the bottom info bar with guests, events, goals and chat, a featured clip embed, and a layout preview that paints the regions computed by [@eliasthompson/obs-layout-generator](https://github.com/eliasthompson/obs-layout-generator).

Data comes from the Twitch Helix API, Twitch EventSub and PubSub websockets, a local [Firebot](https://firebot.app) instance for guest metadata, and [pronouns.alejo.io](https://pronouns.alejo.io).

## Setup

Node 22.15 or later is required; `.nvmrc` pins 24.

```sh
npm install
cp config/secrets.template.js config/secrets.js
```

Fill in `config/secrets.js`:

- `clientId`: the Twitch application client id used for the device code flow.
- `firebotGuestRoleId`: the Firebot custom role whose viewers are shown as guests. Leave it empty to show only Guest Star guests without syncing them to Firebot. Firebot itself is optional: without it, persons fall back to their Twitch data.
- `namespace`: a UUID used to derive stable ids; a random one is generated when left empty.
- `obsWebSocketPassword`: the obs-websocket password, which the info bar uses to color the layout borders. Leave it
  empty when OBS has authentication off.

`config/secrets.js` is git-ignored. `config/index.ts` reads it, alongside the obs-websocket URL. Other settings are
constants in `src/constants/`, one per file: the canvases, the info block heights, the content shapes, the standby
screens, and the Twitch scopes. The OBS layout installation is `config/scenes.ts`.

## Running

```sh
npm start        # webpack dev server at http://localhost:8080
npm run build    # production bundle in build/
npm run lint     # eslint && tsc
npm run lint-fix # eslint --fix
```

The pre-commit hook runs `npm run prebuild`, which is `eslint --fix && tsc`.

Add a route as an OBS browser source at 1920×1080, or at 1080×1920 with `?orientation=portrait` (see [Vertical canvas](#vertical-canvas)), or open it in a browser for a preview. Outside OBS the overlays draw a background and borders so they are visible; inside OBS (`window.obsstudio`) they are transparent. The VS Code launch config opens `#/global-info` in Chrome with the dev server.

### Fonts for OBS text sources

The overlays bundle Roboto, but OBS text sources only see fonts installed on the machine and silently fall back to Arial when a face is missing. On each streaming machine, run the install script from an elevated PowerShell prompt and restart OBS:

```powershell
.\scripts\install-fonts.ps1
```

It installs the Light, Regular and Medium weights from `src/assets/fonts` for all users.

### Authentication

Routes under the root need a Twitch user token. On first load the authentication bar shows a device code flow: open the verification link, grant the scopes listed in `config/index.ts`, then press Authenticate. Tokens are stored in `localStorage` and refreshed automatically.

## Routes

| Route              | Renders                                                                                     | Auth |
| ------------------ | ------------------------------------------------------------------------------------------- | ---- |
| `#/global-info`    | The info bar: guests and their info, alerts and goals, and recent chat                      | yes  |
| `#/featured-clips` | A random featured clip, embedded                                                            | yes  |
| `#/schedule`       | Placeholder; currently the same clip embed as `#/featured-clips`                            | yes  |
| `#/layout`         | Layout preview: one box per region from `@eliasthompson/obs-layout-generator`, with metrics | no   |

### Layout route

`#/layout` runs `generateLayout` and paints every region as a box showing the participant number, region type, size, position, and aspect ratio. Regions that were ratio-driven show an exact ratio such as `16:9`; regions that just filled leftover space show the closest small ratio with `≈`. The `regionBorder` is drawn as an outline around each box that has one, matching how the package measures it; a green screen camera has no outline and a green tint.

Query params inside the hash drive the layout. Defaults for the canvas come from `CANVASES` in `src/constants/canvases.ts`, the landscape canvas or with `orientation=portrait` the portrait one, and every URL option overrides them.

- A region key sets the base config for every participant: `main`, `aux`, `info`, `camera`, or the `LayoutConfig` name. A ratio shows the region at that ratio, `null`/`none`/`off` hides it, and no value shows it with its defaults: `#/layout?name&aux=4:3&info`. `info` also takes `auto`, and `camera` takes a boolean or its main column ratio.
- A region field as `region.field`: `ratio`, `mainAttached`, `aboveAttached`, and `greenScreen`, or the `LayoutConfig` field names such as `isMainAttached`: `#/layout?camera.greenScreen&aux=4:3&aux.mainAttached`. Fields a region does not have are ignored.
- `name` shows the name tag.
- `participants=3` sets the participant count; missing participants use the base config.
- `participant=main=null,camera.ratio=4x3` adds one participant per occurrence, merged region by region over the base config, in order. Values are comma separated `key` or `key=value` pairs.
- Any `LayoutOptions` key, or `width`, `height`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`, `padding`, `gap`, `border`, as a number.

Booleans take `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`, or no value for `true`. Ratios take `16:9` or `16x9`. Unknown keys and unsupported content ratios are ignored.

```text
#/layout?participants=3&name&gap=30&border=4
#/layout?name&camera.mainAttached&info&info.mainAttached&camera.aboveAttached
#/layout?name&camera.greenScreen&participant=main=null&participant=aux=4:3,aux.mainAttached
#/layout?participants=2&hasName=1&contentMain.aspectRatio=4:3&width=2560&height=1440
```

## OBS layout tooling

This repository is also the installation for [obs-layout-firebot](https://github.com/eliasthompson/obs-layout-firebot):
`config/scenes.ts` is its config, a module of plain data describing each canvas's container scene, the participant
layout scenes with their sources and borders, the compositions, the standby screens, and the `borderColor` filter. It
takes each canvas's `options` from `CANVASES`, so the OBS layouts match `#/layout`, and imports the constants through
the `@/` aliases, which the CLI resolves through `tsconfig.json`. The tools run from here:

```sh
npm run deploy           # obs:deploy, then firebot:deploy, without prompting
npm run obs:deploy       # creates the filters in OBS, then restarts OBS if the item transitions need setting (asks first)
npm run firebot:deploy   # checks the config against OBS, stores it in Firebot, installs the script and presets
npm run obs:restart      # restarts OBS, never forcibly
npm run obs:verify -- "<scene key>"   # applies a scene from here and compares every item with the plan
npm run obs:capture -- "<scene key>"  # screenshots during a transition
npm run obs:prune        # deletes old scene collection backups for good, keeping the newest 3 (asks first)
npm run firebot:restart  # installs the presets into the profile and restarts Firebot
npm run firebot:prune    # deletes old Firebot profile file backups for good, keeping the newest 3 (asks first)
```

The deploy and restart commands take `--dry-run` to report what they would do. The Firebot presets, one per scene key,
derive from the config, ids included, so they stay the same across deploys and machines with nothing else to version.
Where Firebot or OBS live on a machine comes from `.env` (see `.env.example`); unset, the tools use Firebot's own OBS
integration settings and the default profile.

obs-layout-firebot is a dev dependency: the overlays only import its types, and the scripts above run its CLI. To try
unreleased changes from a sibling checkout, link it with `npx link ../obs-layout-firebot` and keep the version range in
`package.json`; the next `npm install` puts the published package back.

### OBS scene collection

`config/scenes.ts` names every scene and source the tools drive, so the `Eliance 2026` collection has to match it:

- **One layout scene per person**, `[Layout] Person N`, nested in the container `[Scene] Canvas`, for each of the
  `participantTotal` people. Raise `participantTotal` as you build them; `obs:verify` reports the ones missing. People
  are numbered in the order the info bar lists them: the broadcaster first, then Guest Star guests, then the Firebot
  guest role.
- **Each layout scene holds** `[Group] Main Content N`, `[Group] Aux Content N`, `[Group] Camera N`, `[List] Info N`,
  and `[Text] Name N`, and a `[Border] … N` color source for each region but the name. The shadow filters on the
  border sources reach `borderPadding` past the border, which is always half the layout gap.
- **The vertical canvas** (Aitum Vertical) has its own container, layout scenes, borders, and name texts, named with a
  ` (V)` suffix: `[Scene] Canvas (V)`, `[Layout] Person 1 (V)`, `[Border] Camera 1 (V)`, `[Text] Name 1 (V)`. OBS
  sizes every scene to its canvas, and the tools size borders and name texts on the source itself, so each canvas
  needs its own.
- **The content, camera, info, and background scenes are shared.** They live on the main canvas, and the vertical
  layouts nest them too. The tools fade a source on the source itself, so both canvases fade a shared scene together,
  and `firebot:deploy` refuses a config where any preset would fade one differently on the two canvases.
- **Each standby screen** has a text source in `[Widget] Standby Text`, such as `[Text] Starting Soon`, and a vertical
  copy with its lines centered, such as `[Text] Starting Soon (V)` in `[Widget] Standby Text (V)`.
- **`isVerticalEnabled`** in `config/scenes.ts` has every preset lay out the vertical canvas too. Turned off, the
  shared scenes still fade with landscape inside whatever vertical layout was last shown, and the vertical borders and
  name texts stop updating.

### Border colors and names

Inside OBS, `#/global-info` connects to obs-websocket (`obsWebSocketUrl` in `config/index.ts`, the password from
`config/secrets.js`) and keeps the layouts in step with the persons it shows, on every canvas: person 1's border
sources take the first person's color and their name texts the first person's name, and so on, in the same order the
bar lists them. Only the landscape bar writes, so the two bars never write twice. Colors and names are written when a
person, color, or name changes and when OBS connects, never on the rotation. Colors fade through the `Move: Color`
filter that `obs:deploy` creates on each border; a border without that filter gets the color written into its Stroke
filter directly. Without OBS, as in a browser preview, the bar logs a debug line and retries every fifteen seconds.

### Vertical canvas

The vertical canvas is the 1080×1920 one Twitch's Dual Format streams beside the landscape one, made with the Aitum
Vertical plugin. Its overlay is `#/global-info?orientation=portrait`, and `#/layout?orientation=portrait` previews its
layouts. Its margins keep the layout clear of Twitch's vertical player:

| Value                 | Why                                                                                                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Top margin 148        | Twitch's top bar, about 120 tall on large phones to 160 on small ones.                                                                                                                                                                                                |
| Bottom margin 343     | Where the info bar sits. Twitch's chat covers 11% to 33% of the bottom: about 290 shows two lines of it, each line is about 39 more, and 430 clears it on a small phone with chat open. At 343, one person's 16:9 content leaves their camera exactly 4:3 beneath it. |
| Info blocks 125 tall  | 99 in landscape. About 1.26 times as large, so the text is readable on a phone.                                                                                                                                                                                       |
| Standby line 810 wide | Three quarters of the canvas, longer than the widest standby text. The landscape line runs up its layout area with the same 135 inset from the top margin and the info bar's border.                                                                                  |

With chat open at full height, Twitch still covers the bottom of the layout, names included. Names stay at the bottom
of their cameras anyway, since along the top they would cover faces.

The info bar fills each canvas's bottom margin less its border. In landscape it is one block of three sections side by
side: the person, the events and goals, and chat. In portrait it is the person block, as wide for its height as in
landscape with the chat settings in its corner, over chat, with the goals at chat's foot and chat taking the rest of
the margin. Portrait chat breaks lines after the same words as landscape chat.

## Todo

- [ ] BUG: Config import
- [ ] layout
  - [x] layout route paints `obs-layout-generator` regions with their metrics
  - [x] url params for layout configs and options
  - [x] obs-layout-firebot config and tools run from this repo
  - [x] layout border colors follow the persons in the info bar
  - [ ] generate configs from guest star participants
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

## License

[ISC](LICENSE) © Elias Thompson
