/** Flat two-tone icons drawn on a 100×100 grid. */

type IconProps = { size?: number; color?: string; accent?: string };

export const HouseIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
  accent = "#0C0D11",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 10 L92 46 L82 46 L82 90 L18 90 L18 46 L8 46 Z"
      fill={color}
      strokeLinejoin="round"
    />
    <rect x="42" y="62" width="16" height="28" rx="2" fill={accent} />
    <rect x="26" y="52" width="12" height="12" rx="2" fill={accent} />
    <rect x="62" y="52" width="12" height="12" rx="2" fill={accent} />
  </svg>
);

export const CarIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
  accent = "#0C0D11",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M14 58 L22 36 Q25 30 32 30 L68 30 Q75 30 78 36 L86 58 L90 60 L90 74 L10 74 L10 60 Z"
      fill={color}
    />
    <path d="M28 40 L33 33 L67 33 L72 40 Z" fill={accent} opacity={0.85} />
    <circle cx="28" cy="74" r="10" fill={accent} />
    <circle cx="72" cy="74" r="10" fill={accent} />
    <circle cx="28" cy="74" r="4" fill={color} />
    <circle cx="72" cy="74" r="4" fill={color} />
  </svg>
);

export const SprayIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
  accent = "#0C0D11",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M36 14 L66 14 L66 24 L48 24 L48 30 L40 30 Z" fill={color} />
    <path d="M34 34 L56 34 L62 46 L62 90 L28 90 L28 46 Z" fill={color} />
    <rect x="33" y="56" width="24" height="18" rx="3" fill={accent} />
    <circle cx="78" cy="14" r="3" fill={color} />
    <circle cx="84" cy="22" r="2.5" fill={color} />
    <circle cx="76" cy="26" r="2" fill={color} />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
  accent = "#0C0D11",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" fill={color} />
    <circle cx="50" cy="50" r="34" fill={accent} />
    <path
      d="M50 26 L50 50 L66 60"
      stroke={color}
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const MopIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="47" y="4" width="6" height="64" rx="3" fill={color} />
    <path d="M30 66 L70 66 L74 74 L26 74 Z" fill={color} />
    {[30, 38, 46, 54, 62, 70].map((x) => (
      <rect
        key={x}
        x={x - 2}
        y={74}
        width={5}
        height={20}
        rx={2.5}
        fill={color}
      />
    ))}
  </svg>
);

export const BucketIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
  accent = "#0C0D11",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M26 30 Q50 2 74 30" stroke={color} strokeWidth="5" fill="none" />
    <path d="M18 34 L82 34 L74 92 L26 92 Z" fill={color} />
    <rect x="20" y="44" width="60" height="7" fill={accent} opacity={0.6} />
  </svg>
);

export const FridgeIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
  accent = "#0C0D11",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="24" y="6" width="52" height="88" rx="8" fill={color} />
    <rect x="24" y="38" width="52" height="4" fill={accent} />
    <rect x="64" y="16" width="5" height="14" rx="2.5" fill={accent} />
    <rect x="64" y="50" width="5" height="22" rx="2.5" fill={accent} />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({
  size = 100,
  color = "#F6F4EE",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 4 Q54 46 96 50 Q54 54 50 96 Q46 54 4 50 Q46 46 50 4 Z"
      fill={color}
    />
  </svg>
);
