import { FlaskConical } from 'lucide-react';
import { VIAL_STRENGTH_PRESETS_MG, parseDecimalInput, toInputValue } from '../domain/dose';

interface VialInputProps {
  strengthValue: string;
  volumeValue: string;
  strengthError?: string;
  volumeError?: string;
  onStrengthChange: (value: string) => void;
  onVolumeChange: (value: string) => void;
}

export function VialInput({
  strengthValue,
  volumeValue,
  strengthError,
  volumeError,
  onStrengthChange,
  onVolumeChange
}: VialInputProps) {
  const numericStrength = parseDecimalInput(strengthValue);

  return (
    <section className="control-group vial-control" aria-labelledby="vial-label">
      <div className="group-header">
        <span className="step-badge">2</span>
        <div>
          <h2 id="vial-label">Dados do rótulo</h2>
          <p>copie exatamente o que aparece na embalagem</p>
        </div>
        <FlaskConical className="header-icon" size={22} aria-hidden="true" />
      </div>

      <div className="chip-grid" role="group" aria-label="Doses comuns no rótulo">
        {VIAL_STRENGTH_PRESETS_MG.map((strength) => (
          <button
            className="choice-chip"
            data-selected={numericStrength === strength}
            type="button"
            key={strength}
            onClick={() => onStrengthChange(toInputValue(strength))}
          >
            {toInputValue(strength)} mg
          </button>
        ))}
      </div>

      <div className="field-row">
        <div>
          <label className="field-label" htmlFor="vial-strength">
            Dose escrita no rótulo
          </label>
          <div className="input-with-unit" data-invalid={Boolean(strengthError)}>
            <input
              id="vial-strength"
              inputMode="decimal"
              value={strengthValue}
              onChange={(event) => onStrengthChange(event.target.value)}
              aria-invalid={Boolean(strengthError)}
              aria-describedby={strengthError ? 'strength-error' : undefined}
            />
            <span>mg</span>
          </div>
          {strengthError ? (
            <p className="field-error" id="strength-error">
              {strengthError}
            </p>
          ) : null}
        </div>

        <div>
          <label className="field-label" htmlFor="solution-volume">
            Volume escrito no rótulo
          </label>
          <div className="input-with-unit" data-invalid={Boolean(volumeError)}>
            <input
              id="solution-volume"
              inputMode="decimal"
              value={volumeValue}
              onChange={(event) => onVolumeChange(event.target.value)}
              aria-invalid={Boolean(volumeError)}
              aria-describedby={volumeError ? 'volume-error' : undefined}
            />
            <span>mL</span>
          </div>
          {volumeError ? (
            <p className="field-error" id="volume-error">
              {volumeError}
            </p>
          ) : null}
        </div>
      </div>

      <div className="vial-help" aria-label="Como ler o rótulo do frasco">
        <div className="vial-example">
          <span>Seu rótulo selecionado</span>
          <strong>
            {strengthValue || '-'} mg / {volumeValue || '-'} mL
          </strong>
        </div>
        <p>
          Isso significa que <strong>{volumeValue || '-'} mL</strong> desse líquido contém{' '}
          <strong>{strengthValue || '-'} mg</strong> de Tirzepatida.
        </p>
        <p>O app usa esse par do rótulo para calcular quanto aspirar na seringa.</p>
      </div>
    </section>
  );
}
