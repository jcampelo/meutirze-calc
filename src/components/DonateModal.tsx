import { Check, Copy, Heart, X } from 'lucide-react';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// ── PIX EMV payload generator ────────────────────────────────────────────────

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return ((crc & 0xffff).toString(16).toUpperCase().padStart(4, '0'));
}

function tlv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

function generatePixPayload(pixKey: string, name: string, city: string): string {
  const gui = tlv('00', 'br.gov.bcb.pix') + tlv('01', pixKey);
  const merchantInfo = tlv('26', gui);
  const additionalData = tlv('62', tlv('05', '***'));

  let payload =
    tlv('00', '01') +
    merchantInfo +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('58', 'BR') +
    tlv('59', name.substring(0, 25)) +
    tlv('60', city.substring(0, 15)) +
    additionalData +
    '6304';

  return payload + crc16(payload);
}

// ── Config ───────────────────────────────────────────────────────────────────

const PIX_KEY = 'campelo.jefferson@gmail.com';
const PIX_NAME = 'Jefferson Campelo';
const PIX_CITY = 'Sao Paulo';
const PIX_PAYLOAD = generatePixPayload(PIX_KEY, PIX_NAME, PIX_CITY);

// ── Component ────────────────────────────────────────────────────────────────

interface DonateModalProps {
  onClose: () => void;
}

export function DonateModal({ onClose }: DonateModalProps) {
  const [copied, setCopied] = useState(false);

  function copyKey() {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="donate-title" onClick={handleOverlayClick}>
      <div className="modal-card donate-card">
        <div className="modal-header">
          <div className="donate-title-row">
            <Heart size={18} className="donate-heart" aria-hidden="true" />
            <span id="donate-title" className="donate-title">Apoiar o projeto</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="donate-body">
          <p className="donate-message">
            Este app é gratuito e sem anúncios. Se ele te ajudou, um café já faz a diferença! ☕
          </p>

          <div className="donate-qr-wrapper">
            <QRCodeSVG
              value={PIX_PAYLOAD}
              size={200}
              bgColor="#ffffff"
              fgColor="#184425"
              level="M"
              className="donate-qr"
            />
          </div>

          <p className="donate-scan-hint">Abra o app do banco → PIX → Ler QR Code</p>

          <div className="donate-divider">
            <span>ou copie a chave</span>
          </div>

          <div className="donate-key-row">
            <span className="donate-key-text">{PIX_KEY}</span>
            <button
              className={`donate-copy-btn${copied ? ' donate-copy-btn--done' : ''}`}
              type="button"
              onClick={copyKey}
              aria-label="Copiar chave PIX"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          <p className="donate-thanks">Obrigado pelo apoio! 💚</p>
        </div>
      </div>
    </div>
  );
}
