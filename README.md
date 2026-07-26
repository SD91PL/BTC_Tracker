# Minimalist BTC Price Tracker

A modern React + Vite dashboard for monitoring Bitcoin price movements in real time. The app combines live market data, a polished glassmorphism UI, and smooth theme/currency transitions in a compact single-screen experience.

## 🔗 Live Demo

https://sd91pl.github.io/BTC_Tracker/

## ✨ Features

- Live BTC price with automatic refresh
- 24-hour price change indicator
- Interactive 24h chart rendered with Recharts
- Currency switching between USD and PLN with fade animation
- Light/dark theme toggle with animated UI
- Responsive UI optimized for desktop and mobile
- Data fetching & caching with TanStack Query
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

- **Bitcoin price (BTC/USD) + 24h change + 24h history**  
  Data provided by CoinGecko API:  
  https://api.coingecko.com/

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
├── api/                # External API calls (CoinGecko, exchange rate)
├── app/                # App shell
│   └── components/     # UI components
├── hooks/              # Data-fetching and derived-view hooks (TanStack Query)
├── store/              # Redux Toolkit store (client-side UI state)
│   ├── slices/         # currency + theme slices
│   ├── hooks.ts        # Typed useAppDispatch / useAppSelector
│   └── index.ts        # Store configuration
├── styles/             # Global CSS + theme tokens (theme.css)
├── utils/              # Formatting helpers (currency, date/time, arrays)
├── constants.ts        # Shared app-wide constants (refetch intervals, etc.)
├── theme.ts            # CSS variable re-exports for inline styles
├── types.ts            # Shared TypeScript types
└── main.tsx            # Application entry point
```

## 🧠 State Management

The project is split into two layers:

- **Server data** (BTC price, 24h history, USD/PLN rate) is fetched and cached via **TanStack Query** in `hooks/`.
- **Client-side UI state** (selected currency + toggle animation, light/dark theme) lives in the **Redux Toolkit** store under `store/`.

## 🌗 Theming

The app supports light and dark themes, toggled via the switch beneath the card. Theme state lives in the Redux `theme` slice; `App.tsx` syncs it to a `data-theme` attribute on `<html>`, which drives all colors.

All colors are defined as CSS custom properties in `src/styles/theme.css` (dark is the default/fallback). `src/theme.ts` re-exports the solid tokens as `var(--color-…)` strings for use in inline styles, so they stay reactive to theme changes.

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
