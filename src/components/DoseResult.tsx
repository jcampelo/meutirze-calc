import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ValidationResult } from '../domain/dose';
import { formatPtNumber } from '../domain/dose';

interface DoseResultProps {
  validation: ValidationResult;
}

export function DoseResult({ validation }: DoseResultProps) {
  const blockingErrors = Object.values(validation.fieldErrors).filter(Boolean);

  if (!validation.result) {
    return (
      <section className="result-panel" aria-live="polite">
        <div className="status-line" data-tone="warning">
          <AlertTriangle size={20} aria-hidden="true" />
          <span>Complete os dados para calcular.</span>
        </div>
        {blockingErrors.map((error) => (
          <p className="result-note" key={error}>
            {error}
          </p>
        ))}
      </section>
    );
  }

  const { result } = validation;
  const hasError = blockingErrors.length > 0;

  return (
    <section className="result-panel" aria-live="polite">
      <div className="status-line" data-tone={hasError ? 'warning' : 'ok'}>
        {hasError ? <AlertTriangle size={20} aria-hidden="true" /> : <CheckCircle2 size={20} aria-hidden="true" />}
        <span>{hasError ? 'Revise os dados antes de usar.' : 'Resultado calculado localmente.'}</span>
      </div>

      <div className="result-numbers">
        <div>
          <span>Volume</span>
          <strong>{formatPtNumber(result.volumeMl, 3)} mL</strong>
        </div>
        <div>
          <span>{result.syringe.shortLabel}</span>
          <strong>{formatPtNumber(result.unitsUi, 1)} UI</strong>
        </div>
      </div>

      <div className="concentration-line">
        Concentração: {formatPtNumber(result.concentrationMgPerMl, 2)} mg/mL
      </div>

      {[...blockingErrors, ...validation.warnings].map((message) => (
        <p className="result-note" key={message}>
          {message}
        </p>
      ))}
      <p className="result-note">A marcação visual é aproximada; confirme com um profissional de saúde.</p>
    </section>
  );
}
