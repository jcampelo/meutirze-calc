import { Pill } from 'lucide-react';
import { DOSE_PRESETS_MG, parseDecimalInput, toInputValue } from '../domain/dose';

interface DoseSelectorProps {
  value: string;
  error?: string;
  focused: boolean;
  onFocusChange: (focused: boolean) => void;
  onChange: (value: string) => void;
}

export function DoseSelector({ value, error, focused, onFocusChange, onChange }: DoseSelectorProps) {
  const numericValue = parseDecimalInput(value);

  return (
    <section className="control-group" aria-labelledby="dose-label">
      <div className="group-header">
        <span className="step-badge">1</span>
        <div>
          <h2 id="dose-label">Dose desejada</h2>
          <p>mg prescritos para esta aplicação</p>
        </div>
        <Pill className="header-icon" size={22} aria-hidden="true" />
      </div>

      <div className="chip-grid" role="group" aria-label="Doses comuns">
        {DOSE_PRESETS_MG.map((dose) => {
          const selected = numericValue === dose && !focused;
          return (
            <button
              className="choice-chip"
              data-selected={selected}
              type="button"
              key={dose}
              onClick={() => {
                onFocusChange(false);
                onChange(toInputValue(dose));
              }}
            >
              {toInputValue(dose)} mg
            </button>
          );
        })}
      </div>

      <label className="field-label" htmlFor="manual-dose">
        Outra dose
      </label>
      <div className="input-with-unit" data-invalid={Boolean(error)}>
        <input
          id="manual-dose"
          inputMode="decimal"
          value={value}
          onFocus={() => onFocusChange(true)}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'dose-error' : undefined}
        />
        <span>mg</span>
      </div>
      {error ? (
        <p className="field-error" id="dose-error">
          {error}
        </p>
      ) : null}
    </section>
  );
}

