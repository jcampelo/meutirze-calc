import { Heart, Info, RotateCcw, BookOpen } from 'lucide-react';
import { useMemo, useState, useDeferredValue } from 'react';
import { AboutModal } from './components/AboutModal';
import { AdditionalInfoModal } from './components/AdditionalInfoModal';
import { DonateModal } from './components/DonateModal';
import { DoseResult } from './components/DoseResult';
import { DoseSelector } from './components/DoseSelector';
import { SyringeSelector } from './components/SyringeSelector';
import { SyringeVisual } from './components/SyringeVisual';
import { VialInput } from './components/VialInput';
import { VialVisual } from './components/VialVisual';
import type { RawDoseInput } from './domain/dose';
import { validateDoseInput } from './domain/dose';
import { usePersistentDoseState } from './hooks/usePersistentDoseState';

const DEFAULT_STATE: RawDoseInput = {
  desiredDoseMg: '2,5',
  vialStrengthMg: '15',
  solutionVolumeMl: '0,5',
  syringeId: 'u100-100'
};

export function App() {
  const [doseState, setDoseState] = usePersistentDoseState('monjaro-dose-state', DEFAULT_STATE);
  const [manualDoseFocused, setManualDoseFocused] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  
  // Cálculo imediato para validação e lógica de entrada
  const validation = useMemo(() => validateDoseInput(doseState), [doseState]);
  
  // Valor diferido para componentes visuais pesados, garantindo que o input não trave
  const deferredValidation = useDeferredValue(validation);

  function updateDoseState(patch: Partial<RawDoseInput>) {
    setDoseState((current) => ({ ...current, ...patch }));
  }

  function reset() {
    setDoseState(DEFAULT_STATE);
    setManualDoseFocused(false);
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="app-title">
        <div className="hero-brand">
          <svg className="app-logo" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
            <rect width="48" height="48" rx="13" fill="#184425" />
            <rect x="21" y="10" width="6" height="28" rx="3" fill="white" />
            <rect x="10" y="21" width="28" height="6" rx="3" fill="white" />
            <circle cx="39" cy="9" r="5" fill="#4caf72" />
          </svg>
          <div>
            <h1 id="app-title">MeuTirze Calc</h1>
            <p className="eyebrow">Calculadora de Dose · Tirzepatida</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="icon-button" type="button" onClick={reset} aria-label="Restaurar exemplo inicial">
            <RotateCcw size={20} aria-hidden="true" />
          </button>
          <button className="icon-button donate-trigger" type="button" onClick={() => setDonateOpen(true)} aria-label="Apoiar o projeto via PIX">
            <Heart size={20} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" onClick={() => setAboutOpen(true)} aria-label="Sobre o desenvolvedor">
            <Info size={20} aria-hidden="true" />
          </button>
        </div>
      </section>

      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {infoOpen && <AdditionalInfoModal onClose={() => setInfoOpen(false)} />}

      <section className="workspace" aria-label="Calculadora">
        <div className="input-stack">
          <DoseSelector
            value={doseState.desiredDoseMg}
            error={validation.fieldErrors.desiredDoseMg}
            focused={manualDoseFocused}
            onFocusChange={setManualDoseFocused}
            onChange={(desiredDoseMg) => updateDoseState({ desiredDoseMg })}
          />
          <VialInput
            strengthValue={doseState.vialStrengthMg}
            volumeValue={doseState.solutionVolumeMl}
            strengthError={validation.fieldErrors.vialStrengthMg}
            volumeError={validation.fieldErrors.solutionVolumeMl}
            onStrengthChange={(vialStrengthMg) => updateDoseState({ vialStrengthMg })}
            onVolumeChange={(solutionVolumeMl) => updateDoseState({ solutionVolumeMl })}
          />
          <SyringeSelector
            value={doseState.syringeId}
            error={validation.fieldErrors.syringeId}
            onChange={(syringeId) => updateDoseState({ syringeId })}
          />
        </div>

        <div className="visual-stack">
          <div className="visual-grid">
            <VialVisual
              strengthLabel={doseState.vialStrengthMg}
              volumeLabel={doseState.solutionVolumeMl}
              result={deferredValidation.result}
            />
            <SyringeVisual result={deferredValidation.result} selectedSyringeId={doseState.syringeId} />
          </div>
          
          <div aria-live="polite" aria-atomic="true">
            <DoseResult validation={validation} />
          </div>
          
          <button 
            className="action-button" 
            type="button" 
            onClick={() => setInfoOpen(true)}
            style={{ marginTop: 8 }}
          >
            <BookOpen size={18} aria-hidden="true" />
            Informações Adicionais
          </button>
        </div>
      </section>
    </main>
  );
}
