// Pure-SVG RAG donut — no chart library, renders identically on server & client.

const COLORS = {
  green: "#1C7A56",
  amber: "#C9A227",
  red: "#BE3E32",
};

export function HealthDonut({
  green,
  amber,
  red,
  size = 180,
}: {
  green: number;
  amber: number;
  red: number;
  size?: number;
}) {
  const total = green + amber + red || 1;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  const segments = [
    { value: green, color: COLORS.green },
    { value: amber, color: COLORS.amber },
    { value: red, color: COLORS.red },
  ].filter((s) => s.value > 0);

  let offset = 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EFECE5"
          strokeWidth={stroke}
        />
        {segments.map((seg, i) => {
          const len = (seg.value / total) * circ;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute flex flex-col items-center gap-0.5">
        <span className="text-[34px] font-bold leading-none tracking-[-0.02em] text-navy">
          {total}
        </span>
        <span className="text-[10.5px] font-semibold tracking-[0.12em] text-muted-light">
          PROJECTS
        </span>
      </div>
    </div>
  );
}
