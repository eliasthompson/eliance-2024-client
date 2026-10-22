# AGENTS.md

React overlay app for OBS browser sources on a Twitch stream. Each hash route is one 1920×1080 overlay, or 1080×1920 with the global `orientation=portrait` search param (`useOrientation` in `src/lib/`, which `GlobalStyle` and the layout route read; the other routes do not adapt to it yet). Data comes from the Twitch Helix API, Twitch EventSub and PubSub websockets, a local Firebot API, and pronouns.alejo.io. Layout regions come from the `@eliasthompson/obs-layout-generator` package.

## Commands

- `npm start`: webpack dev server at `http://localhost:8080`
- `npm run build`: production bundle in `build/`; runs `prebuild` first
- `npm run lint` / `npm run lint-fix`: ESLint (with Prettier) and `tsc`
- `npm run prebuild`: `eslint --fix && tsc`, also run by the husky pre-commit hook

Before finishing a change, run `npm run lint`. There is no test suite; `npm test` is a placeholder.

## Layout

- `config/index.ts`: app config and the Twitch scopes. `config/secrets.js` holds secrets, is git-ignored, and is typed by `config/secrets.d.ts`; `config/secrets.template.js` lists its keys. Add non-secret settings to `config/index.ts` and secrets to all three secrets files.
- `config/layoutCanvases.ts`: the `landscape` and `portrait` canvases, as raw `LayoutOptions` the app sizes itself from, sharing their spacing, plus `infoBlockHeight`, the height of one info block on either canvas. `config/scenes.ts`: the `@eliasthompson/obs-layout-firebot` config for this installation: one entry under `canvases` per OBS canvas, each taking its options from `layoutCanvases`, with `borderPadding` for the border shadows that reach past them. The vertical canvas (Aitum Vertical) is behind `VERTICAL`, off until its scenes exist in OBS; its sources carry a ` (V)` suffix, since OBS shares source names across canvases, while its scene names repeat the landscape ones. It must stay pure data (`firebot:deploy` stores it in Firebot as JSON), so it imports only `layoutCanvases` and types. The `npm run obs:*` and `firebot:*` scripts run that package's CLI against it; the Firebot presets derive from it, so the deploy writes nothing here. The package is a dev dependency, since the app only imports its types; to work against unreleased changes, link the sibling checkout with `npx link ../obs-layout-firebot` and keep the range in package.json.
- `config/webpack.js`, `config/babel.js`: build config. Emotion's `css` prop is wired through `@babel/preset-react` `importSource`.
- `src/index.tsx`: entry; `src/routes.tsx`: the hash router. Routes under `Container` require a Twitch token; routes that need no Twitch data are siblings of it.
- `src/components/<Name>/index.tsx`: one component per folder, with its props interface in `types.ts` beside it. Route-level and composite components sit at the top level; reusable pieces are in `shared/`, icons in `shared/svgs/`.
- `src/lib/`: one export group per file, imported as `@lib/<name>`.
- `src/store/apis/<service>/`: one RTK Query API per service in `index.ts`, one endpoint per file injected with `injectEndpoints`, exporting the generated hooks and typed request and response interfaces. Twitch EventSub subscriptions live under `twitch/createEventSubSubscription/`.
- `src/store/slices/<name>/index.ts`: Redux Toolkit slices. `info` holds overlay state such as persons, alerts, and chats.
- `src/assets/`: fonts, images, and videos, each with a `<name>.d.<ext>.ts` declaration beside it.
- `src/components/BorderColorSync/`: colors the OBS layout borders from the persons over obs-websocket (`src/lib/obsWebSocket.ts`, `src/lib/writeBorderColor.ts`). The filter names and settings come from `@eliasthompson/obs-layout-firebot/settings`, the package's browser-safe subpath; its main entry is Node-only and is imported for types alone.
- Path aliases are defined in `tsconfig.json` (`@components`, `@config`, `@lib`, `@store`, `@src`, `@assets`) and resolved by `tsconfig-paths-webpack-plugin`. Use them instead of relative paths.

## Conventions

- Components are named arrow function exports (`export const Name = (props: NameProps) => {}`), never default exports. Props interfaces are `<Name>Props` in the component's `types.ts`.
- Hooks and derived values come first in a component, then `const css<Element><Role> = css\`...\``blocks, then effects, then the render. Values computed for styles are plain consts named`<property><Element>`declared just above the`css` blocks they feed.
- Style overrides are passed as props named `css<Thing>` of type `SerializedStyles` and spread into the receiving block with `${provided?.styles}`. Prefer `FlexContainer` with `cssContainer` over a bare `div` for flex layout.
- Sizes derive from the CSS variables in `GlobalStyle` (`--padding`, `--bar-height`, `--line-height`, `--font-size`, `--container-width`, `--container-height`) rather than new pixel values. `window.obsstudio` distinguishes OBS from a browser preview; previews draw backgrounds and borders that OBS does not.
- Gate rendering with `isLoading` and `isRenderable` and `return false` under a `// Render nothing if data is loading or required data is incomplete` comment. Short comments precede each `useEffect` and the final `// Render component`.
- RTK Query hooks take `skipToken` until their arguments exist. Unused `error` destructures are kept as commented placeholders.
- Lookup tables are `as const` (with `satisfies` where a shape exists) and narrowed with `hasKey` from `@lib/hasKey`.
- Import order: type imports, then packages, then project imports, with a blank line between groups. Object keys and interface members keep semantic order (`x, y, width, height`) and are not sorted.
- Prettier settings are in `.prettierrc` (120 columns, single quotes, trailing commas). Let `eslint --fix` apply them.

## Toolchain constraints

- TypeScript is pinned to 6.x because typescript-eslint does not support 7.x yet.
- Do not use `baseUrl` in tsconfig; `paths` resolve relative to the tsconfig file.
- `build/`, `node_modules/`, and `config/secrets.js` are git-ignored. Never commit secrets or build output.
