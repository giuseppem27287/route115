export interface GaugeProps {
  /** Current value. */
  value: number;
  /** Value mapped to the end of the arc (default: 100). */
  max?: number;
  /** Displayed under the arc. */
  label?: string;
  /** Unit shown next to the numeric value (e.g. `km`, `rpm`). */
  unit?: string;
  /** Diameter of the gauge in pixels (default: 160). */
  size?: number;
}

const ARC_START_ANGLE = -225; // bottom-left
const ARC_SWEEP = 270; // degrees of the dial

function polarPoint(cx: number, cy: number, radius: number, angleDeg: number) {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function arcPath(cx: number, cy: number, radius: number, startAngle: number, sweep: number) {
  const start = polarPoint(cx, cy, radius, startAngle);
  const end = polarPoint(cx, cy, radius, startAngle + sweep);
  const largeArcFlag = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

/**
 * Dashboard-style circular gauge (SVG, no dependencies).
 * Placeholder shell ready for the Figma/Make UI integration.
 */
export function Gauge({ value, max = 100, label, unit, size = 160 }: GaugeProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const ratio = max === 0 ? 0 : clamped / max;
  const sweep = ARC_SWEEP * ratio;

  return (
    <div className="flex flex-col items-center gap-2" style={{ width: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={max}>
        <path
          d={arcPath(50, 50, 40, ARC_START_ANGLE, ARC_SWEEP)}
          fill="none"
          stroke="var(--color-steel-700)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={arcPath(50, 50, 40, ARC_START_ANGLE, sweep)}
          fill="none"
          stroke="var(--color-rust-500)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text
          x="50"
          y="48"
          textAnchor="middle"
          className="fill-chrome-100 font-display text-[18px]"
        >
          {Math.round(clamped)}
        </text>
        {unit ? (
          <text x="50" y="62" textAnchor="middle" className="fill-steel-300 font-condensed text-[9px] uppercase">
            {unit}
          </text>
        ) : null}
      </svg>
      {label ? (
        <span className="font-condensed text-xs uppercase tracking-widest text-steel-300">
          {label}
        </span>
      ) : null}
    </div>
  );
}
