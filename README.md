# BTC_Tracker

A modern React + Vite dashboard for monitoring Bitcoin price movements in real time. The app combines live market data, a polished glassmorphism UI, and smooth theme/currency transitions in a compact single-screen experience.

## 🔗 Live Demo

https://sd91pl.github.io/BTC_Tracker/

## ✨ Features

- Live BTC price with automatic refresh
- Animated intro splash — the logo draws itself before the app appears; skipped for users with reduced motion enabled
- Selectable chart time range — 24h, 1w, 1m, 1y, 5y, or max — with price-change indicator matching the selected period
- Interactive chart rendered with Recharts, with a hover tooltip showing the exact price and date
- Dual data source with automatic fallback: CoinGecko is primary; blockchain.info covers 5y/max (outside CoinGecko's free-plan range) and steps in if CoinGecko fails. The active source is shown under the chart
- Currency switching between USD and PLN with fade animation
- Light/dark theme toggle with animated UI
- Resizable card layout — unlock via the width toggle, then drag either edge (works with mouse or touch) or pinch with two fingers to widen or narrow the card; the chart's axis density adapts live to the new width
- One-click reset button that snaps theme, currency, time range, and card width/lock state back to their defaults
- Responsive UI optimized for desktop and mobile
- Data fetching & caching with TanStack Query — each time range is cached independently, so switching back is instant
- Fallback to N/A when external data is unavailable
- Manual retry on API errors

## 🎨 Design

The application was created based on a design concept developed in **Figma Make**.

Original Figma design:  
https://www.figma.com/design/WWARD6rz7UywY2sgwmrd7U/Minimalist-BTC-Price-Tracker

> The design was then implemented as a functional React application with live market data integration.
> The interface was designed as a minimalist, glass-inspired card experience with custom theme tokens and animated transitions.
> The visual system is driven by CSS variables so the app can switch between dark and light modes without changing component logic.

## 🔌 Data Sources

The application uses external APIs to provide up-to-date market information:

- **Bitcoin price (BTC/USD) + price history**  
  Primary source is the CoinGecko API:  
  https://api.coingecko.com/  
  CoinGecko's free plan only serves history up to 365 days, so the 5y/max ranges use blockchain.info instead. blockchain.info also acts as a general fallback — for the current price and for any range's history — whenever CoinGecko is unreachable:  
  https://www.blockchain.com/api/charts_api

- **USD to PLN exchange rate**  
  Currency conversion data provided by ExchangeRate API:  
  https://open.er-api.com/

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Redux Toolkit
- Recharts

> See `package.json` for exact dependency versions.

## 🗂️ Project Structure

```
src/
├── api/                # External API calls (CoinGecko, blockchain.info, exchange rate)
├── app/                # App shell
│   └── components/     # UI components (header/range picker, chart, price, toggles,
│                       # resizable card wrapper, reset button, footer, intro splash)
├── hooks/              # Data-fetching and derived-view hooks (TanStack Query, card resize)
├── store/              # Redux Toolkit store (client-side UI state)
│   ├── slices/         # currency + theme + timeRange + resize slices
│   ├── actions.ts       # Shared `appReset` action, handled by every slice
│   ├── hooks.ts        # Typed useAppDispatch / useAppSelector
│   └── index.ts        # Store configuration
├── styles/             # Global CSS + theme tokens (theme.css) + intro splash (intro.css)
├── utils/              # Formatting helpers (currency, date/time per range, downsampling)
├── constants.ts        # Shared app-wide constants (per-range fetch config, refetch intervals, etc.)
├── theme.ts            # CSS variable re-exports for inline styles
├── types.ts            # Shared TypeScript types
└── main.tsx            # Application entry point
```

## 🧠 State Management

The project is split into two layers:

- **Server data** (BTC price, range-scoped history, USD/PLN rate) is fetched and cached via **TanStack Query** in `hooks/`. Each time range is a separate query, so switching ranges never refetches data that's already cached.
- **Client-side UI state** (selected currency + toggle animation, light/dark theme, selected chart time range, card resize lock + custom width) lives in the **Redux Toolkit** store under `store/`, split into `currency`, `theme`, `timeRange`, and `resize` slices.
- A shared `appReset` action (`store/actions.ts`) is dispatched by the reset button; every slice handles it via `extraReducers` to snap back to its own `initialState` in a single dispatch.

## 🌗 Theming

The app supports light and dark themes, toggled via the switch beneath the card. Theme state lives in the Redux `theme` slice; `App.tsx` syncs it to a `data-theme` attribute on `<html>`, which drives all colors.

All colors are defined as CSS custom properties in `src/styles/theme.css` (dark is the default/fallback). `src/theme.ts` re-exports the solid tokens as `var(--color-…)` strings for use in inline styles, so they stay reactive to theme changes.

## 🎬 Intro Splash

Before the app UI appears, `IntroSplash.tsx` inlines the logo SVG (`assets/img/logotype.svg`) and animates each letterform's `stroke`/`fill` — outline draws in, then fills solid — followed by a fade-out revealing the app underneath, which has already been mounted and fetching data in the background. The whole sequence is driven by CSS keyframes (`styles/intro.css`); the component itself holds no timers or state, it just unmounts on `animationend`. Skipped entirely when `prefers-reduced-motion: reduce` is set.

## ↔️ Resizable Layout & Reset

Beneath the card, the width toggle unlocks free horizontal resizing: drag either edge of the card — with a mouse on desktop or a finger on touch devices — or pinch with two fingers, to stretch or shrink it. Edge dragging is handled via the Pointer Events API, so the same handler drives both mouse and touch; on touch devices the invisible hit-region around each edge widens (via a `pointer: coarse` media query in `resizable.css`) since a fingertip needs a much bigger target than a mouse cursor to land on it reliably. The chart reacts live — its X-axis tick density scales with the current width, and its own draw-in animation is suppressed while a resize is in progress so the line tracks the drag smoothly. The committed width is clamped between `CARD_MIN_WIDTH_PX` and `CARD_MAX_WIDTH_RATIO` of the available space (both defined once in `constants.ts` and shared by the hook and the wrapper), and is persisted in the `resize` Redux slice alongside the lock state.

The reset button next to it restores the app to its defaults in one click — theme, currency, selected time range, and the card's lock/width — by dispatching the shared `appReset` action.

## 📦 Installation

```bash
git clone https://github.com/SD91PL/BTC_Tracker.git
cd BTC_Tracker
npm install
npm run dev
```

> **Note:** React and ReactDOM are listed as peer dependencies. Most setups resolve them automatically; if needed, install them explicitly:
>
> ```bash
> npm install react@18.3.1 react-dom@18.3.1
> ```
