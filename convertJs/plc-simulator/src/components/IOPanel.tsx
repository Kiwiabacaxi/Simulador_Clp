/**
 * Painel de Entradas e Saídas
 * Baseado em HomePg.java botões e LEDs
 */

import type { PLCInputs, PLCOutputs } from '../core/types'
import './IOPanel.css'

interface IOPanelProps {
  inputs: PLCInputs
  outputs: PLCOutputs
  onInputChange: (key: string, value: boolean) => void
  disabled?: boolean
}

export function IOPanel({ inputs, outputs, onInputChange, disabled }: IOPanelProps) {
  return (
    <div className="io-panel">
      <div className="inputs-section">
        <h3>🔘 Entradas (I)</h3>
        <p className="section-description">Clique para ligar/desligar</p>
        <div className="io-grid">
          {Object.entries(inputs).map(([key, value]) => (
            <div key={key} className="io-item">
              <button
                className={`input-button ${value ? 'active' : ''}`}
                onClick={() => !disabled && onInputChange(key, !value)}
                disabled={disabled}
                aria-label={`Entrada ${key}`}
                title={`Entrada ${key} - ${value ? 'LIGADA' : 'DESLIGADA'}`}
              >
                <span className="io-label">{key}</span>
                <span className="io-status">{value ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="outputs-section">
        <h3>💡 Saídas (Q)</h3>
        <p className="section-description">LEDs indicadores</p>
        <div className="io-grid">
          {Object.entries(outputs).map(([key, value]) => (
            <div key={key} className="io-item">
              <div
                className={`output-led ${value ? 'on' : 'off'}`}
                aria-label={`Saída ${key}`}
                title={`Saída ${key} - ${value ? 'LIGADA' : 'DESLIGADA'}`}
              >
                <span className="io-label">{key}</span>
                <span className="led-indicator"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
