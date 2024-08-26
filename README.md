# Eliance 2024 Client

## Todo

- [ ] pull latest sub, follower, and cheer for broadcaster
- [ ] eventsub to update follower, cheer, and goal (update cache)
- [ ] alerts (tied to eventsub)
- [ ] person box
  - [ ] rotate guest info (and main channel info)
- [ ] errors
- [ ] design
- [ ] right side??
- [ ] BUG: chat messages with multiple channel emotes
- [ ] figure out bits in messages

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
      <!-- - if viewer has no metadata, then:
        - [ ] Firebot: `POST /viewers/:userId` Add Metadata To View - add metadata to viewer -->
    - combine & show data
- [ ] on event:
  - [ ] on guest star guest update:
    - [ ]  fix guest list and refetch stuff if needed
  - [ ] on firebot custom role update
    - [ ] fix guest list and refetch stuff if needed
