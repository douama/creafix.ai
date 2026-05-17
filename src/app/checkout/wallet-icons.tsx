/**
 * Icônes wallets mobile money — représentations stylisées des marques.
 * Inline SVG, CSP-safe, pas de dépendance externe.
 */

type IconProps = { className?: string };

export function WaveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Wave">
      <rect width="40" height="40" rx="10" fill="#1DC8F2" />
      <path
        d="M7 22.5c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 5-2.5 7.5 0 5 2.5 6.5 0"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M7 28c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 5-2.5 7.5 0 5 2.5 6.5 0"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <text
        x="20"
        y="15"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="800"
        fontSize="8"
        fill="#fff"
        letterSpacing="0.5"
      >
        WAVE
      </text>
    </svg>
  );
}

export function OrangeMoneyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Orange Money">
      <rect width="40" height="40" rx="10" fill="#000" />
      <rect x="6" y="6" width="28" height="20" rx="2" fill="#FF7900" />
      <text
        x="20"
        y="20"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="9"
        fill="#fff"
        letterSpacing="-0.3"
      >
        orange
      </text>
      <text
        x="20"
        y="34"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="6.5"
        fill="#FF7900"
        letterSpacing="1"
      >
        MONEY
      </text>
    </svg>
  );
}

export function FreeMoneyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Free Money">
      <rect width="40" height="40" rx="10" fill="#CD212A" />
      <text
        x="20"
        y="22"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#fff"
        fontStyle="italic"
        letterSpacing="-0.5"
      >
        free
      </text>
      <text
        x="20"
        y="32"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="5.5"
        fill="#fff"
        letterSpacing="1.5"
        opacity="0.9"
      >
        MONEY
      </text>
    </svg>
  );
}

export function ExpressoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Expresso">
      <rect width="40" height="40" rx="10" fill="#E6007E" />
      <text
        x="20"
        y="20"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="20"
        fill="#fff"
        letterSpacing="-1"
      >
        e
      </text>
      <text
        x="20"
        y="32"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="5.5"
        fill="#fff"
        letterSpacing="1.2"
        opacity="0.95"
      >
        EXPRESSO
      </text>
    </svg>
  );
}

export function MtnIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="MTN MoMo">
      <rect width="40" height="40" rx="10" fill="#FFCC00" />
      <text
        x="20"
        y="22"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="12"
        fill="#003F87"
        letterSpacing="-0.5"
      >
        MTN
      </text>
      <text
        x="20"
        y="31"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="5.5"
        fill="#003F87"
        letterSpacing="1"
      >
        MoMo
      </text>
    </svg>
  );
}

export function MoovIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Moov Money">
      <rect width="40" height="40" rx="10" fill="#0066CC" />
      <text
        x="20"
        y="22"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="900"
        fontSize="11"
        fill="#fff"
        letterSpacing="-0.5"
      >
        MOOV
      </text>
      <text
        x="20"
        y="31"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="5.5"
        fill="#fff"
        letterSpacing="1.5"
        opacity="0.9"
      >
        MONEY
      </text>
    </svg>
  );
}
