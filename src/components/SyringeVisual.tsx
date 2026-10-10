import type { DoseResult, SyringeId } from '../domain/dose';
import { getSyringe, formatPtNumber } from '../domain/dose';

interface SyringeVisualProps {
  result: DoseResult | null;
  selectedSyringeId: SyringeId;
}

export function SyringeVisual({ result, selectedSyringeId }: SyringeVisualProps) {
  const syringe = result?.syringe ?? getSyringe(selectedSyringeId);
  const maxUi = syringe.capacityUi;
  const fillRatio = result?.fillRatio ?? 0;
  const barrelStart = 90;
  const barrelWidth = 310;
  const barrelEnd = barrelStart + barrelWidth;
  const fillWidth = barrelWidth * fillRatio;
  // O êmbolo fica do lado esquerdo (haste) — líquido começa no êmbolo e vai até a agulha (direita)
  // A escala é: 0 = lado da agulha (direita), max = lado do êmbolo (esquerda)
  const plungerX = barrelEnd - fillWidth;
  const majorTicks = Array.from({ length: maxUi / 10 + 1 }, (_, i) => i * 10);
  const minorTicks = Array.from({ length: maxUi / 2 + 1 }, (_, i) => i * 2);

  return (
    <section className="visual-panel syringe-panel" aria-label="Seringa U-100">
      <div className="visual-title">Seringa U-100 de {syringe.shortLabel}</div>
      <svg className="syringe-svg" viewBox="0 0 480 230" role="img" aria-label={`Seringa ${syringe.label}`}>
        <defs>
          <linearGradient id="barrelGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#dceef5" />
            <stop offset="30%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f2f8fb" />
            <stop offset="100%" stopColor="#c8dfe9" />
          </linearGradient>
          <linearGradient id="doseGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#6ec6ff" />
            <stop offset="100%" stopColor="#1565c0" />
          </linearGradient>
          <linearGradient id="plungerGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4a5e6a" />
            <stop offset="100%" stopColor="#263540" />
          </linearGradient>
          <linearGradient id="needleHubGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1565c0" />
            <stop offset="100%" stopColor="#0d3a7a" />
          </linearGradient>
          <linearGradient id="needleGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d0e4ec" />
            <stop offset="50%" stopColor="#f0f8fc" />
            <stop offset="100%" stopColor="#a0c0cc" />
          </linearGradient>
          <linearGradient id="flangeGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d0dee4" />
            <stop offset="100%" stopColor="#a8bec6" />
          </linearGradient>
          <filter id="dropShadow" x="-5%" y="-10%" width="110%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0d3a7a" floodOpacity="0.15" />
          </filter>
          <filter id="bubbleShadow" x="-10%" y="-20%" width="120%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0d3a7a" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Haste do êmbolo — da flange até o êmbolo */}
        <rect x="42" y="103" width={Math.max(0, plungerX - 42)} height="6" rx="3" fill="url(#plungerGrad)" opacity="0.5" />
        <rect x="42" y="106" width={Math.max(0, plungerX - 42)} height="2" rx="1" fill="#ffffff" opacity="0.2" />

        {/* Aba de pressão (flange) */}
        <rect x="20" y="88" width="22" height="36" rx="4" fill="url(#flangeGrad)" stroke="#8aa4b0" strokeWidth="1.5" />
        <rect x="23" y="91" width="16" height="6" rx="2" fill="#b8ccd4" />
        <rect x="23" y="101" width="16" height="6" rx="2" fill="#b8ccd4" />

        {/* Corpo (barrel) */}
        <rect
          x={barrelStart}
          y="76"
          width={barrelWidth}
          height="60"
          rx="16"
          fill="url(#barrelGrad)"
          stroke="#2a6a8a"
          strokeWidth="3"
          filter="url(#dropShadow)"
        />

        {/* Líquido (dose) — do êmbolo até a agulha (direita) */}
        {fillWidth > 0 && (
          <rect
            x={plungerX + 2}
            y="82"
            width={Math.max(0, fillWidth - 4)}
            height="48"
            rx="12"
            fill="url(#doseGrad)"
            opacity="0.88"
          />
        )}

        {/* Reflexo superior no barrel */}
        <rect x={barrelStart + 8} y="80" width={barrelWidth - 20} height="10" rx="5" fill="#ffffff" opacity="0.45" />

        {/* Êmbolo (borracha) */}
        <rect
          x={Math.min(barrelEnd - 2, plungerX - 4)}
          y="74"
          width="18"
          height="64"
          rx="7"
          fill="url(#plungerGrad)"
          stroke="#1a2a34"
          strokeWidth="1.5"
        />
        <rect
          x={Math.min(barrelEnd, plungerX)}
          y="80"
          width="6"
          height="52"
          rx="3"
          fill="#ffffff"
          opacity="0.15"
        />

        {/* Hub da agulha (azul) */}
        <path
          d={`M${barrelStart + barrelWidth} 86 L${barrelStart + barrelWidth + 18} 94 L${barrelStart + barrelWidth + 18} 118 L${barrelStart + barrelWidth} 126 Z`}
          fill="url(#needleHubGrad)"
          stroke="#0a3060"
          strokeWidth="1.5"
        />

        {/* Cânula da agulha */}
        <path
          d={`M${barrelStart + barrelWidth + 18} 103 L${barrelStart + barrelWidth + 76} 106 L${barrelStart + barrelWidth + 76} 107 L${barrelStart + barrelWidth + 18} 109 Z`}
          fill="url(#needleGrad)"
          stroke="#8ab0be"
          strokeWidth="0.5"
        />
        {/* Ponta biselada */}
        <path
          d={`M${barrelStart + barrelWidth + 76} 106 L${barrelStart + barrelWidth + 84} 107 L${barrelStart + barrelWidth + 76} 107 Z`}
          fill="#b0ccd4"
        />

        {/* Fundo suave da régua */}
        <rect x={barrelStart} y="132" width={barrelWidth} height="28" rx="6" fill="#e8f4f8" opacity="0.6" />

        {/* Marcações — escala invertida: 0 à direita (agulha), max à esquerda (êmbolo) */}
        {minorTicks.map((tick) => {
          const x = barrelEnd - (tick / maxUi) * barrelWidth;
          const isMajor = tick % 10 === 0;
          const isMid = tick % 5 === 0;
          return (
            <line
              key={tick}
              x1={x}
              y1={isMajor ? 132 : isMid ? 136 : 140}
              x2={x}
              y2="160"
              stroke="#1a5a7a"
              strokeWidth={isMajor ? 2.5 : isMid ? 1.8 : 1.2}
              opacity={isMajor ? 1 : isMid ? 0.65 : 0.35}
            />
          );
        })}

        {/* Labels das marcações */}
        {majorTicks.map((tick) => {
          const x = barrelEnd - (tick / maxUi) * barrelWidth;
          return (
            <text key={tick} x={x} y="178" textAnchor="middle" className="tick-label" fontSize="13">
              {tick}
            </text>
          );
        })}

        {/* Unidade */}
        <text x={barrelStart + barrelWidth / 2} y="197" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5c7a8a" fontFamily="Inter, sans-serif">
          UI (Unidades de Insulina)
        </text>

        {/* Bubble de resultado */}
        {result && (() => {
          const tickX = barrelEnd - (result.unitsUi / maxUi) * barrelWidth;
          const bx = Math.min(Math.max(tickX, barrelStart + 46), barrelEnd - 46);
          return (
            <g filter="url(#bubbleShadow)">
              <rect x={bx - 46} y="34" width="92" height="34" rx="17" fill="#1565c0" />
              <polygon points={`${tickX},75 ${tickX - 8},66 ${tickX + 8},66`} fill="#1565c0" />
              <text x={bx} y="57" textAnchor="middle" className="bubble-label" fontSize="16" fontWeight="900">
                {formatPtNumber(result.unitsUi, 1)} UI
              </text>
            </g>
          );
        })()}
      </svg>

      <div className="visual-meta">{syringe.label}</div>
    </section>
  );
}
