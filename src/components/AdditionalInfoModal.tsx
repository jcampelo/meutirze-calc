import { X, BookOpen } from 'lucide-react';
import { InjectionSites } from './InjectionSites';
import { MedicalDisclaimer } from './MedicalDisclaimer';

interface AdditionalInfoModalProps {
  onClose: () => void;
}

export function AdditionalInfoModal({ onClose }: AdditionalInfoModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="info-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="info-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={18} className="header-icon" />
            Informações Adicionais
          </h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'left' }}>
          <InjectionSites />
          
          <div style={{ marginTop: 24, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            <MedicalDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
