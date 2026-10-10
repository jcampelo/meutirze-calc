import { X, Heart, Code2 } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="about-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="about-title">Sobre o Desenvolvedor</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-body">
          <div className="about-avatar">JC</div>
          <p className="about-name">Jefferson Campelo</p>
          <p className="about-role">Desenvolvedor de Software</p>

          <div className="about-divider" />

          <div className="about-thanks">
            <div className="about-thanks-title">
              <Heart size={15} aria-hidden="true" />
              Agradecimentos
            </div>
            <p>
              Um agradecimento especial a todos os <strong>profissionais de enfermagem</strong> que,
              com dedicação e cuidado, orientam pacientes no preparo e aplicação correta de
              medicamentos injetáveis. Vocês são essenciais nesse processo.
            </p>
            <p>
              Este app — <strong>MeuTirze Calc</strong> — foi criado para apoiar o trabalho de quem está na linha de frente
              do cuidado com o paciente.
            </p>
          </div>

          <div className="about-divider" />

          <div className="about-tech">
            <div className="about-thanks-title">
              <Code2 size={15} aria-hidden="true" />
              Tecnologias
            </div>
            <div className="about-tech-chips">
              <span>React 19</span>
              <span>TypeScript</span>
              <span>Vite 8</span>
              <span>Lucide React</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
