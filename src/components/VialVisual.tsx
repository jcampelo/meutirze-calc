import type { DoseResult } from '../domain/dose';
import { formatPtNumber } from '../domain/dose';

interface VialVisualProps {
  strengthLabel: string;
  volumeLabel: string;
  result: DoseResult | null;
}

export function VialVisual({ strengthLabel, volumeLabel, result }: VialVisualProps) {
  const liquidTop = result ? Math.max(148, 210 - result.fillRatio * 80) : 180;

  return (
    <section className="visual-panel" aria-label="Frasco">
      <div className="visual-title">Frasco</div>
      <svg className="vial-svg" viewBox="0 0 200 280" role="img" aria-label="Frasco informado">
        <defs>
          <linearGradient id="vialGlass" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#e8f4f8" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#f0f8ff" />
            <stop offset="100%" stopColor="#cde4ee" />
          </linearGradient>
          <linearGradient id="vialLiquid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a8e6b4" />
            <stop offset="100%" stopColor="#4caf72" />
          </linearGradient>
          <linearGradient id="vialCap" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d4763a" />
            <stop offset="100%" stopColor="#9e4a1a" />
          </linearGradient>
          <linearGradient id="vialNeck" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#d0dde3" />
            <stop offset="50%" stopColor="#eef6f9" />
            <stop offset="100%" stopColor="#b8cdd6" />
          </linearGradient>
          <linearGradient id="vialShine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <clipPath id="vialBody">
            <path d="M58 100 Q58 88 70 88 L130 88 Q142 88 142 100 L142 230 Q142 250 120 250 L80 250 Q58 250 58 230 Z" />
          </clipPath>
        </defs>

        {/* Tampa (cap) */}
        <rect x="76" y="30" width="48" height="8" rx="4" fill="url(#vialCap)" />
        <rect x="72" y="36" width="56" height="22" rx="6" fill="url(#vialCap)" />
        <rect x="78" y="38" width="44" height="4" rx="2" fill="#e8895a" opacity="0.5" />

        {/* Membrana de borracha */}
        <rect x="74" y="56" width="52" height="14" rx="4" fill="#555f60" />
        <rect x="78" y="59" width="44" height="6" rx="3" fill="#6e7a7b" />

        {/* Pescoço (neck) */}
        <path d="M78 70 L74 88 L126 88 L122 70 Z" fill="url(#vialNeck)" stroke="#a0b8c2" strokeWidth="1" />

        {/* Corpo do frasco */}
        <path
          d="M58 100 Q58 88 70 88 L130 88 Q142 88 142 100 L142 230 Q142 250 120 250 L80 250 Q58 250 58 230 Z"
          fill="url(#vialGlass)"
          stroke="#3a7a5a"
          strokeWidth="3.5"
        />

        {/* Líquido dentro */}
        <rect
          x="61"
          y={liquidTop}
          width="78"
          height={250 - liquidTop}
          fill="url(#vialLiquid)"
          opacity="0.82"
          clipPath="url(#vialBody)"
        />

        {/* Reflexo de luz no corpo */}
        <path
          d="M58 100 Q58 88 70 88 L130 88 Q142 88 142 100 L142 230 Q142 250 120 250 L80 250 Q58 250 58 230 Z"
          fill="url(#vialShine)"
        />

        {/* Rótulo */}
        <rect x="66" y="130" width="68" height="72" rx="6" fill="#fff8f0" stroke="#d9a87a" strokeWidth="2" />
        <rect x="66" y="130" width="68" height="14" rx="6" fill="#e8895a" opacity="0.25" />
        <text x="100" y="152" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b05a1a" fontFamily="Inter, sans-serif">
          Tirzepatida
        </text>
        <line x1="70" y1="158" x2="130" y2="158" stroke="#d9a87a" strokeWidth="1" opacity="0.5" />
        <text x="100" y="172" textAnchor="middle" fontSize="10" fontWeight="800" fill="#184425" fontFamily="Inter, sans-serif">
          {strengthLabel || '-'} mg
        </text>
        <text x="100" y="186" textAnchor="middle" fontSize="10" fontWeight="800" fill="#184425" fontFamily="Inter, sans-serif">
          {volumeLabel || '-'} mL
        </text>
        <text x="100" y="198" textAnchor="middle" fontSize="9" fontWeight="700" fill="#888" fontFamily="Inter, sans-serif">
          Mounjaro®
        </text>

        {/* Base arredondada highlight */}
        <ellipse cx="100" cy="248" rx="28" ry="5" fill="#3a7a5a" opacity="0.12" />
      </svg>

      <div className="vial-stats">
        <div className="vial-stat">
          <span className="vial-stat-label">Dose</span>
          <strong className="vial-stat-value">{strengthLabel || '—'} <em>mg</em></strong>
        </div>
        <div className="vial-stat">
          <span className="vial-stat-label">Volume</span>
          <strong className="vial-stat-value">{volumeLabel || '—'} <em>mL</em></strong>
        </div>
        <div className={`vial-stat vial-stat--conc${result ? ' vial-stat--active' : ''}`}>
          <span className="vial-stat-label">Concentração</span>
          <strong className="vial-stat-value">
            {result ? `${formatPtNumber(result.concentrationMgPerMl, 2)} ` : '— '}
            <em>mg/mL</em>
          </strong>
        </div>
      </div>
    </section>
  );
}
