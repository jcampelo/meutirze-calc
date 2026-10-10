import { useState } from 'react';
import { MapPin } from 'lucide-react';

type Site = {
  id: string;
  label: string;
  description: string;
  color: string;
  colorLight: string;
};

const SITES: Site[] = [
  {
    id: 'abdomen',
    label: 'Abdômen',
    description: 'Regiões laterais direita e esquerda, 3–4 dedos afastados do umbigo.',
    color: '#2d7dd2',
    colorLight: '#e7f1fd',
  },
  {
    id: 'coxa',
    label: 'Coxas',
    description: 'Face anterior e lateral externa superior, 4 dedos abaixo da virilha e acima do joelho.',
    color: '#24633a',
    colorLight: '#e6f6e9',
  },
  {
    id: 'braco',
    label: 'Braços',
    description: 'Face posterior, 3–4 dedos abaixo da axila e acima do cotovelo.',
    color: '#b8622b',
    colorLight: '#fff4e8',
  },
];

export function InjectionSites() {
  const [active, setActive] = useState<string | null>(null);

  function toggle(id: string) {
    setActive((prev) => (prev === id ? null : id));
  }

  const activeSite = SITES.find((s) => s.id === active) ?? null;

  return (
    <section className="injection-sites control-group" aria-label="Locais de aplicação">
      <div className="group-header">
        <span className="step-badge" style={{ background: '#5c7465' }}>
          <MapPin size={14} aria-hidden="true" />
        </span>
        <div>
          <h2>Locais de Aplicação</h2>
          <p>Toque numa região para ver as instruções</p>
        </div>
      </div>

      <div className="sites-layout">
        <div className="body-svg-wrap">
          <svg viewBox="0 0 160 400" className="body-svg" aria-hidden="true">
            {/* ── silhueta completa (referência) ── */}
            <path
              d="
                M 80 15
                C 92 15, 98 22, 95 35
                C 93 42, 88 45, 90 50
                C 95 55, 115 58, 128 70
                C 135 80, 138 105, 138 135
                C 138 165, 139 195, 142 225
                C 142 235, 134 235, 132 225
                C 130 200, 126 170, 125 145
                C 124 125, 120 100, 115 90
                C 118 115, 122 145, 122 180
                C 122 200, 120 220, 118 230
                C 116 260, 114 290, 112 320
                C 110 350, 112 365, 114 375
                C 115 385, 108 388, 100 385
                C 95 382, 92 360, 90 320
                C 86 280, 84 235, 80 220
                C 76 235, 74 280, 70 320
                C 68 360, 65 382, 60 385
                C 52 388, 45 385, 46 375
                C 48 365, 50 350, 48 320
                C 46 290, 44 260, 42 230
                C 40 220, 38 200, 38 180
                C 38 145, 42 115, 45 90
                C 40 100, 36 125, 35 145
                C 34 170, 30 200, 28 225
                C 26 235, 18 235, 18 225
                C 21 195, 22 165, 22 135
                C 22 105, 25 80, 32 70
                C 45 58, 65 55, 70 50
                C 72 45, 67 42, 65 35
                C 62 22, 68 15, 80 15
                Z
              "
              fill="none"
              stroke="#6b8cae"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* ── zona abdômen (clicável) ── */}
            <path
              d="M 50 160 C 50 190, 55 205, 80 205 C 105 205, 110 190, 110 160 C 100 160, 90 160, 85 160 C 85 180, 75 180, 75 160 Z"
              fill={active === 'abdomen' ? '#2d7dd2' : '#90c8f0'}
              fillOpacity={active === 'abdomen' ? 0.75 : 0.35}
              stroke={active === 'abdomen' ? '#2d7dd2' : 'none'}
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => toggle('abdomen')}
            />
            {/* umbigo */}
            <circle cx="80" cy="170" r="2.5" fill="#6b8cae" style={{ pointerEvents: 'none' }} />

            {/* ── zona coxa esquerda (clicável) ── */}
            <rect
              x="47" y="240" width="18" height="40" rx="5"
              fill={active === 'coxa' ? '#24633a' : '#7abf98'}
              fillOpacity={active === 'coxa' ? 0.75 : 0.4}
              stroke={active === 'coxa' ? '#24633a' : 'none'}
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => toggle('coxa')}
            />
            {/* ── zona coxa direita (clicável) ── */}
            <rect
              x="95" y="240" width="18" height="40" rx="5"
              fill={active === 'coxa' ? '#24633a' : '#7abf98'}
              fillOpacity={active === 'coxa' ? 0.75 : 0.4}
              stroke={active === 'coxa' ? '#24633a' : 'none'}
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => toggle('coxa')}
            />

            {/* ── zona braço esquerdo (clicável) ── */}
            <path
              d="M 28 100 C 26 120, 32 135, 40 135 C 38 120, 32 100, 28 100 Z"
              fill={active === 'braco' ? '#b8622b' : '#e8a87a'}
              fillOpacity={active === 'braco' ? 0.75 : 0.4}
              stroke={active === 'braco' ? '#b8622b' : 'none'}
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => toggle('braco')}
            />
            {/* ── zona braço direito (clicável) ── */}
            <path
              d="M 132 100 C 134 120, 128 135, 120 135 C 122 120, 128 100, 132 100 Z"
              fill={active === 'braco' ? '#b8622b' : '#e8a87a'}
              fillOpacity={active === 'braco' ? 0.75 : 0.4}
              stroke={active === 'braco' ? '#b8622b' : 'none'}
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => toggle('braco')}
            />

            {/* ── marcadores pontilhados circulares ── */}
            {active === 'abdomen' && (
              <circle cx="70" cy="180" r="4" fill="none" stroke="#2d7dd2" strokeWidth="2" style={{ pointerEvents: 'none' }} />
            )}
            {active === 'coxa' && (
              <circle cx="56" cy="260" r="4" fill="none" stroke="#24633a" strokeWidth="2" style={{ pointerEvents: 'none' }} />
            )}
            {active === 'braco' && (
              <circle cx="34" cy="118" r="4" fill="none" stroke="#b8622b" strokeWidth="2" style={{ pointerEvents: 'none' }} />
            )}
          </svg>
        </div>

        <div className="sites-legend">
          {SITES.map((site) => (
            <button
              key={site.id}
              className="site-chip"
              data-active={active === site.id}
              style={{
                '--site-color': site.color,
                '--site-color-light': site.colorLight,
              } as React.CSSProperties}
              onClick={() => toggle(site.id)}
              aria-pressed={active === site.id}
            >
              <span className="site-dot" />
              {site.label}
            </button>
          ))}

          {activeSite && (
            <div
              className="site-info"
              style={{
                borderColor: activeSite.color,
                background: activeSite.colorLight,
              }}
            >
              <strong style={{ color: activeSite.color }}>{activeSite.label}</strong>
              <p>{activeSite.description}</p>
            </div>
          )}

          {!activeSite && (
            <p className="site-hint">Selecione uma região acima ou toque no corpo.</p>
          )}

          <p className="site-rotate-tip">
            Alterne sempre o local a cada aplicação. Nunca reutilize a agulha.
          </p>
        </div>
      </div>
    </section>
  );
}
