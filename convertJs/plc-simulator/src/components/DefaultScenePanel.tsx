/**
 * Default Scene Panel - Painel de simulação padrão
 * Mostra 8 entradas e 8 saídas com imagens
 */

import { PLCInputs, PLCOutputs } from '../core'
import './DefaultScenePanel.css'

interface DefaultScenePanelProps {
  inputs: PLCInputs
  outputs: PLCOutputs
  onInputChange: (key: string, value: boolean) => void
  disabled?: boolean
}

export function DefaultScenePanel({ inputs, outputs, onInputChange, disabled = false }: DefaultScenePanelProps) {
  // Entradas (I0.0 - I0.7)
  const inputKeys = ['I0.0', 'I0.1', 'I0.2', 'I0.3', 'I0.4', 'I0.5', 'I0.6', 'I0.7']

  // Saídas (Q0.0 - Q0.7)
  const outputKeys = ['Q0.0', 'Q0.1', 'Q0.2', 'Q0.3', 'Q0.4', 'Q0.5', 'Q0.6', 'Q0.7']

  const handleInputClick = (key: string) => {
    if (!disabled) {
      onInputChange(key, !inputs[key])
    }
  }

  return (
    <div className="default-scene-panel">
      {/* Coluna de Entradas */}
      <div className="scene-column">
        <h3 className="column-title">Entradas</h3>
        <div className="components-grid">
          {inputKeys.map((key) => (
            <div key={key} className="component-item">
              <div className="component-label">{key}</div>
              <button
                className={`input-button ${inputs[key] ? 'active' : ''}`}
                onClick={() => handleInputClick(key)}
                disabled={disabled}
                title={`${key} - Clique para ${inputs[key] ? 'desativar' : 'ativar'}`}
              >
                <img
                  src={`/assets/${inputs[key] ? 'chave_fechada' : 'chave_aberta'}.png`}
                  alt={inputs[key] ? 'Fechado' : 'Aberto'}
                  className="component-image"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna de Saídas */}
      <div className="scene-column">
        <h3 className="column-title">Saídas</h3>
        <div className="components-grid">
          {outputKeys.map((key) => (
            <div key={key} className="component-item">
              <div className="component-label">{key}</div>
              <div className="output-led">
                <img
                  src={`/assets/${outputs[key] ? 'led_ligado' : 'led_desligado'}.png`}
                  alt={outputs[key] ? 'Ligado' : 'Desligado'}
                  className="component-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
