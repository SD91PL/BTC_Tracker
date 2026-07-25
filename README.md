# Minimalist BTC Price Tracker

A simple React application for tracking the current Bitcoin price with interactive charts and a responsive interface.

## 🚀 Live Demo

https://sd91pl.github.io/BTC_Tracker/

## ✨ Features

- Real-time Bitcoin price
- Interactive charts
- Responsive UI
- Fast data fetching with TanStack Query
- BTC price displayed in USD and PLN
- Animated light/dark theme toggle, with state managed by Redux Toolkit

## 🎨 Design

The application was created based on a design concept developed in **Figma Make**.

Original Figma design:
https://www.figma.com/design/WWARD6rz7UywY2sgwmrd7U/Minimalist-BTC-Price-Tracker

The design was then implemented as a functional React application with live market data integration.

## 🔌 Data Sources

The application uses external APIs to provide up-to-date market information:

- **Bitcoin price (BTC/USD)**  
  Data provided by CoinGecko API:
  https://api.coingecko.com/

- **USD to PLN exchange rate**  
  Currency conversion data provided by ExchangeRate API:
  https://open.er-api.com/

## 🛠️ Tech Stack

- React
- Vite
- Tailwind CSS
- TanStack Query
- Redux Toolkit
- Recharts

## 🗂️ Project Structure

```
src/
├── api/          # External API calls (CoinGecko, exchange rate)
├── app/          # App shell and UI components
├── hooks/        # Data-fetching and derived-view hooks (TanStack Query)
├── store/        # Redux Toolkit store (client-side UI state)
│   ├── slices/   # Feature slices (currency selection + toggle animation, theme mode)
│   ├── hooks.ts  # Typed useAppDispatch / useAppSelector
│   └── index.ts  # Store configuration
├── utils/        # Formatting helpers (currency, date/time, arrays)
├── constants.ts  # Shared app-wide constants
└── types.ts      # Shared TypeScript types
```

State is split by kind rather than kept in one place: server data (BTC price, price history, exchange rate) is fetched and cached via **TanStack Query** in `hooks/`, while client-side UI state (currently selected currency, toggle animation, light/dark theme) lives in the **Redux Toolkit** store under `store/`.

## 🎨 Theming

The app supports a light and a dark theme, toggled via the pill switch beneath the card. Theme state lives in the Redux `theme` slice; `App.tsx` syncs it to a `data-theme` attribute on `<html>`, which drives every color in the app.

All colors are defined as CSS custom properties in `src/styles/theme.css`, once per theme (`:root`/`[data-theme='dark']` and `[data-theme='light']`) — no component ever hardcodes a hex or rgba value. `src/theme.ts` re-exports the solid tokens as `var(--color-x)` strings for use in inline styles, so it's the single JS-side entry point for colors and stays reactive to theme changes automatically.

The light theme's accent is Bitcoin orange rather than the dark theme's mint green. Since that accent token is used both as a fill (badges, pills, chart line) and as direct text (headline price, tooltip values), it's tuned to a darker shade of the same hue (`#c2410c`, ~5:1 contrast against the white card) rather than the literal Bitcoin orange `#f79621` (which only reaches ~2.25:1 as text on a light background and would be hard to read). The literal `#f79621` still shows up in a translucent decorative gradient accent, where contrast isn't a concern. The light theme's status colors (price up/down) were likewise darkened a notch from the usual green/red shades to keep a comfortable ≥4.5:1 contrast margin.

## 📦 Installation

```bash
git clone https://github.com/SD91PL/BTC_Tracker.git
cd BTC_Tracker
npm install
npm run dev

```
