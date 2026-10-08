# RHS Web

React web client for [RHS Rust](https://github.com/JRamonAlves/rhs-rust). It groups home-lab service links and provides a shared text clipboard across personal devices.

## Architecture

```text
React + TanStack Query -> Axum API -> JSON service catalog
                                 -> Redis shared text
```

The client uses TypeScript, Vite, Tailwind CSS, Base UI, and shadcn UI components. Feature components live under `src/components/`; HTTP clients live under `src/api/`. Service links come from the backend catalog, not a frontend JSON file. Theme preferences stay in browser local storage.

## Security and Tailscale

RHS is intended for a private Tailscale network. Neither the frontend nor the API provides application authentication. Access control and transport protection depend on Tailnet policies and the private deployment. Publishing the source does not make the running service public.

Serve the frontend and API through an HTTPS proxy available only to authorized Tailscale devices. Keep the API and Redis unreachable from public networks. The frontend is not an authentication boundary; an allowed device can call the API directly. The included Compose file binds the frontend to loopback.

Every `VITE_*` setting is compiled into browser assets. Never put credentials in it. Service links returned by the API are visible to clients. Shared text travels in API query parameters and can appear in browser tools, proxy logs, and backend logs. Do not use the clipboard for passwords or other sensitive values.

This snapshot starts a new history, replaces private network addresses with localhost examples, and excludes the original deployment publishing workflow and internal agent configuration. The original repositories remain private.

## Run locally

Use Bun 1.3.13 or a compatible version. Start the backend and Redis using the instructions in [RHS Rust](https://github.com/JRamonAlves/rhs-rust). Its default API address is `http://localhost:8080`.

```sh
bun install --frozen-lockfile
cp .env.example .env.local
bun run dev
```

Open the local URL printed by Vite. To use another API, set `VITE_API_BASE_URL` in `.env.local`, then restart Vite. Trailing slashes are normalized. This setting is used in development and production builds; production changes require rebuilding.

## Checks

```sh
bun run lint
bun run typecheck
bun run build
bun audit
```

There is no automated frontend test suite. Release preparation checks the browser against the real Rust API, including catalog loading and clipboard read/write. This does not establish complete security or test private Tailscale ingress.

The publication updates dependencies and pins patched transitive build tools through `overrides`. The shadcn CLI is excluded from installed dependencies; the UI components already live in this repository, and its unused stylesheet is removed. Recheck the overrides and dependency audit when upgrading.

## Docker

```sh
docker compose up -d --build
```

Open `http://localhost:8090`. The default API URL is `http://localhost:8080`, resolved by the browser rather than the container. For access from other devices, provide your private HTTPS API address at build time:

```sh
VITE_API_BASE_URL=https://api.example.com docker compose build
docker compose up -d
```

The example hostname is a placeholder, not a public RHS deployment. Configure it behind private Tailnet access controls. Production assets are served by Nginx; Vite development and preview servers are local tools.

## Limitations

- The application has no per-user identity or authorization. Connected devices share the clipboard key.
- Initial clipboard read failures produce an empty editor with an error indication; check the server before saving over existing text.
- The frontend expects the API routes in the published Rust backend. `src/api/page.api.ts` contains an unused page-info helper; the current header is local and does not call it.
- Clipboard access requires browser permissions and generally a secure context; a fallback copy method is included.
