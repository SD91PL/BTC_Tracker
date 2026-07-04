import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const USD_PLN_RATE = 3.97;

function generatePriceHistory(currentPrice: number) {
  const points = 48;
  const data = [];
  let price = currentPrice * 0.93;
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.46) * currentPrice * 0.01;
    price = Math.max(price, currentPrice * 0.85);
    const hour = i % 24;
    const day = i < 24 ? "Yesterday" : "Today";
    data.push({
      time: `${day} ${String(hour).padStart(2, "0")}:00`,
      price: Math.round(price),
    });
  }
  data[data.length - 1].price = currentPrice;
  return data;
}

const BTC_PRICE_USD = 107340;

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const CustomTooltip = ({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: { value: number }[];
  currency: "USD" | "PLN";
}) => {
  if (active && payload && payload.length) {
    const val =
      currency === "PLN"
        ? formatPLN(payload[0].value * USD_PLN_RATE)
        : formatUSD(payload[0].value);
    return (
      <div
        style={{
          background: "rgba(8, 11, 20, 0.85)",
          border: "1px solid rgba(247, 147, 26, 0.3)",
          backdropFilter: "blur(12px)",
        }}
        className="px-3 py-2 rounded-lg"
      >
        <p
          style={{ fontFamily: "'DM Mono', monospace" }}
          className="text-xs text-[#4fffb0]"
        >
          {val}
        </p>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [currency, setCurrency] = useState<"USD" | "PLN">("USD");
  const [priceData] = useState(() => generatePriceHistory(BTC_PRICE_USD));
  const [animating, setAnimating] = useState(false);

  const priceUSD = BTC_PRICE_USD;
  const pricePLN = Math.round(priceUSD * USD_PLN_RATE);

  const displayPrice =
    currency === "USD" ? formatUSD(priceUSD) : formatPLN(pricePLN);

  const chartData =
    currency === "PLN"
      ? priceData.map((d) => ({ ...d, price: Math.round(d.price * USD_PLN_RATE) }))
      : priceData;

  const change24h = (
    ((priceData[priceData.length - 1].price - priceData[0].price) /
      priceData[0].price) *
    100
  ).toFixed(2);
  const isPositive = parseFloat(change24h) >= 0;

  function handleToggle() {
    setAnimating(true);
    setTimeout(() => {
      setCurrency((c) => (c === "USD" ? "PLN" : "USD"));
      setAnimating(false);
    }, 150);
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,255,176,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99,102,241,0.08) 0%, transparent 55%), #080b14",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Outer gradient border wrapper */}
      <div
        className="relative w-full max-w-sm"
        style={{
          borderRadius: "20px",
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(79,255,176,0.5) 0%, rgba(99,102,241,0.2) 40%, rgba(79,255,176,0.1) 100%)",
        }}
      >
        {/* Glass card */}
        <div
          className="relative w-full flex flex-col overflow-hidden"
          style={{
            borderRadius: "19px",
            background: "rgba(10, 13, 24, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  background: "linear-gradient(135deg, #4fffb0, #00e896)",
                  color: "#080b14",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                ₿
              </div>
              <div>
                <p
                  className="text-sm font-semibold tracking-wide"
                  style={{ color: "#e8eaf2" }}
                >
                  Bitcoin
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: "#6b7280",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  BTC
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className="text-xs mb-0.5"
                style={{ color: "#6b7280", fontFamily: "'DM Mono', monospace" }}
              >
                24h
              </p>
              <p
                className="text-sm font-medium"
                style={{
                  color: isPositive ? "#22c55e" : "#ef4444",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {isPositive ? "+" : ""}
                {change24h}%
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full h-40 px-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4fffb0" stopOpacity={0.35} />
                    <stop
                      offset="100%"
                      stopColor="#4fffb0"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis
                  domain={["auto", "auto"]}
                  hide
                />
                <Tooltip
                  content={<CustomTooltip currency={currency} />}
                  cursor={{
                    stroke: "rgba(79,255,176,0.3)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#4fffb0"
                  strokeWidth={1.5}
                  fill="url(#btcGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#4fffb0", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Price display */}
          <div className="px-6 py-5 text-center">
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: "#6b7280", fontFamily: "'DM Mono', monospace" }}
            >
              Aktualna cena
            </p>

            {/* Gradient border on price block */}
            <div
              className="relative inline-block"
              style={{
                borderRadius: "12px",
                padding: "1px",
                background:
                  "linear-gradient(135deg, rgba(79,255,176,0.4), rgba(99,102,241,0.15), rgba(79,255,176,0.1))",
              }}
            >
              <div
                className="px-6 py-3"
                style={{
                  borderRadius: "11px",
                  background: "rgba(79,255,176,0.06)",
                }}
              >
                <p
                  className="text-3xl font-semibold tracking-tight transition-opacity duration-150"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: "#4fffb0",
                    opacity: animating ? 0 : 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {displayPrice}
                </p>
              </div>
            </div>

            <p
              className="text-xs mt-2"
              style={{ color: "#6b7280", fontFamily: "'DM Mono', monospace" }}
            >
              {currency === "USD"
                ? `≈ ${formatPLN(pricePLN)}`
                : `≈ ${formatUSD(priceUSD)}`}
            </p>
          </div>

          {/* Divider */}
          <div
            className="mx-6 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(79,255,176,0.2), transparent)",
            }}
          />

          {/* Toggle button */}
          <div className="px-6 py-5">
            <button
              onClick={handleToggle}
              className="w-full relative group cursor-pointer"
              style={{
                borderRadius: "12px",
                padding: "1px",
                background:
                  currency === "USD"
                    ? "linear-gradient(135deg, rgba(79,255,176,0.6), rgba(251,191,36,0.2))"
                    : "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.2))",
                transition: "background 0.4s ease",
              }}
            >
              <div
                className="w-full flex items-center justify-between px-5 py-3.5 transition-colors duration-300"
                style={{
                  borderRadius: "11px",
                  background: "rgba(8, 11, 20, 0.6)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* USD pill */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background:
                        currency === "USD"
                          ? "linear-gradient(135deg, #4fffb0, #00e896)"
                          : "rgba(255,255,255,0.08)",
                      color: currency === "USD" ? "#080b14" : "#6b7280",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    $
                  </div>
                  <span
                    className="text-sm font-medium transition-colors duration-300"
                    style={{
                      color: currency === "USD" ? "#4fffb0" : "#6b7280",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    USD
                  </span>
                </div>

                {/* Swap icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ color: "#6b7280" }}
                >
                  <path
                    d="M3 5l3-3 3 3M6 2v8M13 11l-3 3-3-3M10 14V6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* PLN pill */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium transition-colors duration-300"
                    style={{
                      color: currency === "PLN" ? "#818cf8" : "#6b7280",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    PLN
                  </span>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background:
                        currency === "PLN"
                          ? "linear-gradient(135deg, #6366f1, #818cf8)"
                          : "rgba(255,255,255,0.08)",
                      color: currency === "PLN" ? "#ffffff" : "#6b7280",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    zł
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 text-center">
            <p
              className="text-xs"
              style={{ color: "#374151", fontFamily: "'DM Mono', monospace" }}
            >
              1 USD = {USD_PLN_RATE} PLN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
