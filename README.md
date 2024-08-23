# Eliance 2024 Client

## Todo

- [ ] pull latest sub, follower, and cheer
- [ ] eventsub to update follower, cheer, and goal (update cache)
- [ ] alerts (tied to eventsub)
- [ ] firebot api for guests (other stuff?)
- [x] pronouns api for guest info and chat
- [ ] rotate guest info (and main channel info)
- [ ] design

### Guest/User Data Flow

Firebot: `http://localhost:7472/api/v1`
`:customRoleId = 805d6510-9e0a-11ee-a7ad-09ce7f9a4a71`

1. [ ] on load:
   1. [x] Chat Pronouns: `GET /pronouns` Get Pronouns - get pronoun datafor reference
   2. [ ] Twitch: `GET /guest_star/session` Get Guest Star Session - get all guests who aren't me
   3. [ ] Firebot: `POST /viewers/:userId/customRoles/:customRoleId` Add Viewer To Custom Role - add guests to custom role if not already there
   4. [ ] Firebot: `GET /customRoles/:customRoleId` Get Custom Roles - get all guests, even ones who aren't in guest star
   5. [ ] at once:
      1. [x] Twitch: `GET /users` Get Users - get user data on all guests (data)
      2. [ ] Twitch: `GET /chat/color` Get Users - get color data on all guests (color)
      3. [ ] Firebot: `GET /viewers/:userId` Get Viewers - get viewer data on all guests (color, name)
      4. [ ] Chat Pronouns: `GET /users/:login` Get User - get user pronoun data on all guests (pronouns)
   6. [ ] combine & show data
2. [ ] on event:
   1. [ ] on channel chat message:
      1. [ ] get pronouns
   2. [ ] on guest star guest update:
      1.[ ]  fix guest list and refetch stuff if needed
   3. [ ] on firebot custom role update (?)
      1. [ ] fix guest list and refetch stuff if needed
