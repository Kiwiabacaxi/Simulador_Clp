/**
 * Traffic Light Scene - Cena de Semáforo
 * Simula um semáforo simples com visual claro
 */

import { PLCInputs, PLCOutputs } from '../core'
import './TrafficLightScene.css'

interface TrafficLightSceneProps {
  inputs: PLCInputs
  outputs: PLCOutputs
  onInputChange: (key: string, value: boolean) => void
  disabled?: boolean
}

export function TrafficLightScene({ inputs, outputs, onInputChange, disabled = false }: TrafficLightSceneProps) {
  const handleButtonClick = (key: string) => {
    if (!disabled) {
      onInputChange(key, !inputs[key])
    }
  }

  return (
    <div className="traffic-light-scene">
      {/* Controles */}
      <div className="traffic-controls">
        <h3 className="controls-title">Controles</h3>

        <button
          className={`traffic-button ${inputs['I0.0'] ? 'active' : ''}`}
          onClick={() => handleButtonClick('I0.0')}
          disabled={disabled}
        >
          <span className="button-icon">▶️</span>
          <span className="button-label">Ligar Sistema</span>
          <span className="button-id">I0.0</span>
        </button>

        <button
          className={`traffic-button ${inputs['I0.1'] ? 'active' : ''}`}
          onClick={() => handleButtonClick('I0.1')}
          disabled={disabled}
        >
          <span className="button-icon">🌙</span>
          <span className="button-label">Modo Noturno</span>
          <span className="button-id">I0.1</span>
        </button>
      </div>

      {/* Visualização dos Semáforos */}
      <div className="traffic-visualization">
        {/* Semáforo Principal (Norte-Sul) */}
        <div className="traffic-light-box main">
          <div className="traffic-light-header">
            <span className="traffic-icon">🚦</span>
            <span className="traffic-title">Via Norte-Sul</span>
          </div>
          <div className="lights-container">
            <div className={`traffic-light-bulb red ${outputs['Q0.0'] ? 'on' : ''}`}>
              <div className="bulb-shine"></div>
            </div>
            <div className={`traffic-light-bulb yellow ${outputs['Q0.1'] ? 'on' : ''}`}>
              <div className="bulb-shine"></div>
            </div>
            <div className={`traffic-light-bulb green ${outputs['Q0.2'] ? 'on' : ''}`}>
              <div className="bulb-shine"></div>
            </div>
          </div>
        </div>

        {/* Semáforo Secundário (Leste-Oeste) */}
        <div className="traffic-light-box secondary">
          <div className="traffic-light-header">
            <span className="traffic-icon">🚦</span>
            <span className="traffic-title">Via Leste-Oeste</span>
          </div>
          <div className="lights-container">
            <div className={`traffic-light-bulb red ${outputs['Q1.0'] ? 'on' : ''}`}>
              <div className="bulb-shine"></div>
            </div>
            <div className={`traffic-light-bulb yellow ${outputs['Q1.1'] ? 'on' : ''}`}>
              <div className="bulb-shine"></div>
            </div>
            <div className={`traffic-light-bulb green ${outputs['Q1.2'] ? 'on' : ''}`}>
              <div className="bulb-shine"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="traffic-indicators">
        <h3 className="indicators-title">Status das Luzes</h3>

        <div className="indicator-section">
          <div className="section-label">Via Norte-Sul</div>
          <div className={`status-indicator ${outputs['Q0.0'] ? 'red-active' : ''}`}>
            <span className="status-dot red"></span>
            <span className="status-label">Vermelho</span>
            <span className="status-id">Q0.0</span>
          </div>
          <div className={`status-indicator ${outputs['Q0.1'] ? 'yellow-active' : ''}`}>
            <span className="status-dot yellow"></span>
            <span className="status-label">Amarelo</span>
            <span className="status-id">Q0.1</span>
          </div>
          <div className={`status-indicator ${outputs['Q0.2'] ? 'green-active' : ''}`}>
            <span className="status-dot green"></span>
            <span className="status-label">Verde</span>
            <span className="status-id">Q0.2</span>
          </div>
        </div>

        <div className="indicator-section">
          <div className="section-label">Via Leste-Oeste</div>
          <div className={`status-indicator ${outputs['Q1.0'] ? 'red-active' : ''}`}>
            <span className="status-dot red"></span>
            <span className="status-label">Vermelho</span>
            <span className="status-id">Q1.0</span>
          </div>
          <div className={`status-indicator ${outputs['Q1.1'] ? 'yellow-active' : ''}`}>
            <span className="status-dot yellow"></span>
            <span className="status-label">Amarelo</span>
            <span className="status-id">Q1.1</span>
          </div>
          <div className={`status-indicator ${outputs['Q1.2'] ? 'green-active' : ''}`}>
            <span className="status-dot green"></span>
            <span className="status-label">Verde</span>
            <span className="status-id">Q1.2</span>
          </div>
        </div>
      </div>
    </div>
  )
}
