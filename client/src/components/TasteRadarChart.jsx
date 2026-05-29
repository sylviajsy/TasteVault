import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export const TasteRadarChart = ({ wine }) => {
  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const data = [
    { metric: "Acidity", value: toNumber(wine.acidity) },
    { metric: "Fizziness", value: toNumber(wine.fizziness) },
    { metric: "Tannin", value: toNumber(wine.tannin) },
    { metric: "Sweetness", value: toNumber(wine.sweetness) },
    { metric: "Intensity", value: toNumber(wine.intensity) },
  ];

  return (
    <div className="rounded-[1.5rem] bg-panel px-4 py-5 sm:px-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-label">
        Taste Profile
      </p>

      <div className="h-[320px] w-full sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            cx="50%"
            cy="52%"
            outerRadius="72%"
          >
            <PolarGrid
              gridType="polygon"
              radialLines
              stroke="#cfae9d"
              strokeOpacity={0.85}
            />
            <PolarAngleAxis
              dataKey="metric"
              tick={{
                fill: "#5b1228",
                fontSize: 13,
                fontWeight: 600,
              }}
              tickLine={false}
              axisLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{
                fill: "#8f5a4c",
                fontSize: 11,
              }}
              tickCount={6}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              stroke="#6f102e"
              strokeWidth={3}
              fill="#6f102e"
              fillOpacity={0.28}
              dot={{
                r: 4.5,
                fill: "#6f102e",
                stroke: "#6f102e",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
