import { Syringe } from 'lucide-react';
import type { SyringeId } from '../domain/dose';
import { SYRINGES } from '../domain/dose';

interface SyringeSelectorProps {
  value: SyringeId;
  error?: string;
  onChange: (value: SyringeId) => void;
}

export function SyringeSelector({ value, error, onChange }: SyringeSelectorProps) {
  const selectedSyringe = SYRINGES.find((syringe) => syringe.id === value) ?? SYRINGES[0];

  return (
    <section className="control-group" aria-labelledby="syringe-label">
      <div className="group-header">
        <span className="step-badge">3</span>
        <div>
          <h2 id="syringe-label">Tamanho da seringa U-100</h2>
          <p>selecionada: {selectedSyringe.shortLabel}</p>
        </div>
        <Syringe className="header-icon" size={22} aria-hidden="true" />
      </div>

      <div className="segmented-control" role="radiogroup" aria-label="Tipo de seringa">
        {SYRINGES.map((syringe) => (
          <button
            type="button"
            role="radio"
            aria-checked={value === syringe.id}
            data-selected={value === syringe.id}
            key={syringe.id}
            onClick={() => onChange(syringe.id)}
          >
            {syringe.shortLabel}
          </button>
        ))}
      </div>
      <p className="helper-note">
        U-100 significa que 1 mL equivale a 100 UI. A diferença entre as opções é apenas a capacidade
        da seringa.
      </p>
      {error ? <p className="field-error">{error}</p> : null}
    </section>
  );
}
