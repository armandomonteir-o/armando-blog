"use client";

import { useRef, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const activityData = [
  { month: "Jul", posts: 4 },
  { month: "Ago", posts: 7 },
  { month: "Set", posts: 5 },
  { month: "Out", posts: 9 },
  { month: "Nov", posts: 6 },
  { month: "Dez", posts: 11 },
  { month: "Jan", posts: 8 },
  { month: "Fev", posts: 13 },
  { month: "Mar", posts: 10 },
];

const radarData = [
  { subject: "Música", A: 90 },
  { subject: "Cinema", A: 78 },
  { subject: "Livros", A: 85 },
  { subject: "Filosofia", A: 70 },
  { subject: "Código", A: 95 },
  { subject: "Design", A: 82 },
];

const CHART_HEIGHT = 180;

// setState lives inside the ResizeObserver callback, not the effect body —
// satisfies the react-compiler rule about synchronous setState-in-effect.
function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(2,42,110,0.9)",
        backdropFilter: "blur(12px)",
        border: "2px solid #0560e0",
        padding: "8px 12px",
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        color: "#c8e0ff",
      }}
    >
      <span style={{ color: "#fff" }}>{label}:</span> {payload[0].value} posts
    </div>
  );
}

export function ActivityChart() {
  const { ref, width } = useWidth();
  return (
    <div ref={ref} style={{ width: "100%", height: CHART_HEIGHT }}>
      {width > 0 && (
        <AreaChart width={width} height={CHART_HEIGHT} data={activityData}>
          <XAxis
            dataKey="month"
            tick={{ fill: "#5a8ad0", fontFamily: "'Space Mono', monospace", fontSize: 9 }}
            axisLine={{ stroke: "#0560e0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#5a8ad0", fontFamily: "'Space Mono', monospace", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={25}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="posts"
            stroke="#80b0ff"
            strokeWidth={2}
            fill="#80b0ff"
            fillOpacity={0.15}
            dot={{ fill: "#80b0ff", strokeWidth: 0, r: 3 }}
            activeDot={{ fill: "#fff", stroke: "#80b0ff", strokeWidth: 2, r: 5 }}
          />
        </AreaChart>
      )}
    </div>
  );
}

export function SkillRadar() {
  const { ref, width } = useWidth();
  return (
    <div ref={ref} style={{ width: "100%", height: CHART_HEIGHT }}>
      {width > 0 && (
        <RadarChart width={width} height={CHART_HEIGHT} data={radarData} outerRadius={65}>
          <PolarGrid stroke="#0560e0" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#80b0ff", fontFamily: "'Space Mono', monospace", fontSize: 9 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="expertise"
            dataKey="A"
            stroke="#c084fc"
            fill="#c084fc"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: "#c084fc", r: 3 }}
          />
        </RadarChart>
      )}
    </div>
  );
}
