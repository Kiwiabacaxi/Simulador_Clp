/**
 * Batch Simulation Panel - Painel de simulação de processo batch
 * Simula um tanque com bombas, mixer e sensores de nível
 */

import { useState, useEffect, useRef } from 'react'
import { PLCInputs, PLCOutputs } from '../core'
import './BatchSimulationPanel.css'

interface BatchSimulationPanelProps {
  inputs: PLCInputs
  outputs: PLCOutputs
  onInputChange: (key: string, value: boolean) => void
  disabled?: boolean
}

// Constantes do tanque
const TANK_CAPACITY = 100 // 100%
const HI_LEVEL_THRESHOLD = 80 // 80%
const LO_LEVEL_THRESHOLD = 20 // 20%
const FILL_RATE = 2 // % por segundo
const DRAIN_RATE = 1.5 // % por segundo

export function BatchSimulationPanel({ inputs, outputs, onInputChange, disabled = false }: BatchSimulationPanelProps) {
  const [tankLevel, setTankLevel] = useState<number>(0)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastUpdateRef = useRef<number>(Date.now())

  // Atualiza o nível do tanque baseado nas bombas
  useEffect(() => {
    const pump1On = outputs['Q0.1'] // Bomba de enchimento
    const pump3On = outputs['Q0.3'] // Bomba de esvaziamento

    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastUpdateRef.current) / 1000 // em segundos
      lastUpdateRef.current = now

      setTankLevel((prevLevel) => {
        let newLevel = prevLevel

        // Enche se pump1 está ON
        if (pump1On) {
          newLevel += FILL_RATE * deltaTime
        }

        // Esvazia se pump3 está ON
        if (pump3On) {
          newLevel -= DRAIN_RATE * deltaTime
        }

        // Limita entre 0 e 100
        return Math.max(0, Math.min(TANK_CAPACITY, newLevel))
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    if (pump1On || pump3On) {
      lastUpdateRef.current = Date.now()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [outputs])

  // Atualiza sensores de nível (HI e LO)
  useEffect(() => {
    const hiLevel = tankLevel >= HI_LEVEL_THRESHOLD
    const loLevel = tankLevel <= LO_LEVEL_THRESHOLD

    // Atualiza os sensores I1.0 (HI) e I1.1 (LO)
    if (inputs['I1.0'] !== hiLevel) {
      onInputChange('I1.0', hiLevel)
    }
    if (inputs['I1.1'] !== loLevel) {
      onInputChange('I1.1', loLevel)
    }
  }, [tankLevel, inputs, onInputChange])

  const handleButtonClick = (key: string, currentValue: boolean) => {
    if (!disabled) {
      onInputChange(key, !currentValue)
    }
  }

  return (
    <div className="batch-simulation-panel">
      {/* Background com imagem */}
      <div
        className="batch-background"
        style={{ backgroundImage: 'url(/assets/batch_bg.png)' }}
      >
        {/* Controles */}
        <div className="batch-controls">
          <h3 className="controls-title">Controles</h3>

          {/* Botão START (I0.0 - NO) */}
          <button
            className={`batch-button start-button ${inputs['I0.0'] ? 'active' : ''}`}
            onClick={() => handleButtonClick('I0.0', inputs['I0.0'])}
            disabled={disabled}
          >
            <span className="button-label">START</span>
            <span className="button-id">I0.0</span>
          </button>

          {/* Botão STOP (I0.1 - NC) */}
          <button
            className={`batch-button stop-button ${!inputs['I0.1'] ? 'active' : ''}`}
            onClick={() => handleButtonClick('I0.1', inputs['I0.1'])}
            disabled={disabled}
          >
            <span className="button-label">STOP</span>
            <span className="button-id">I0.1</span>
          </button>
        </div>

        {/* Tanque com visualização de nível */}
        <div className="tank-container">
          <svg viewBox="0 0 200 300" className="tank-svg">
            {/* Corpo do tanque */}
            <rect
              x="50"
              y="50"
              width="100"
              height="200"
              fill="#e0e0e0"
              stroke="#333"
              strokeWidth="3"
              rx="5"
            />

            {/* Nível do líquido */}
            <rect
              x="52"
              y={50 + 200 * (1 - tankLevel / 100)}
              width="96"
              height={200 * (tankLevel / 100)}
              fill="#4dabf7"
              opacity="0.8"
            />

            {/* Linha HI (80%) */}
            <line
              x1="40"
              y1={50 + 200 * 0.2}
              x2="160"
              y2={50 + 200 * 0.2}
              stroke="#f03e3e"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="165" y={50 + 200 * 0.2 + 5} fontSize="12" fill="#f03e3e">
              HI
            </text>

            {/* Linha LO (20%) */}
            <line
              x1="40"
              y1={50 + 200 * 0.8}
              x2="160"
              y2={50 + 200 * 0.8}
              stroke="#ffa94d"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="165" y={50 + 200 * 0.8 + 5} fontSize="12" fill="#ffa94d">
              LO
            </text>

            {/* Texto do nível */}
            <text
              x="100"
              y="160"
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
              fill="#333"
            >
              {Math.round(tankLevel)}%
            </text>
          </svg>
        </div>

        {/* Indicadores */}
        <div className="batch-indicators">
          <h3 className="indicators-title">Indicadores</h3>

          {/* LEDs de Status */}
          <div className="led-group">
            <div className={`led ${outputs['Q1.0'] ? 'led-on' : 'led-off'}`}>
              <span className="led-label">RUN</span>
              <span className="led-id">Q1.0</span>
            </div>
            <div className={`led ${outputs['Q1.1'] ? 'led-on' : 'led-off'}`}>
              <span className="led-label">IDLE</span>
              <span className="led-id">Q1.1</span>
            </div>
            <div className={`led ${outputs['Q1.2'] ? 'led-on' : 'led-off'}`}>
              <span className="led-label">FULL</span>
              <span className="led-id">Q1.2</span>
            </div>
          </div>

          {/* Equipamentos */}
          <div className="equipment-group">
            <div className={`equipment ${outputs['Q0.1'] ? 'equipment-on' : ''}`}>
              <span className="equipment-icon">⬆️</span>
              <span className="equipment-label">Pump 1</span>
              <span className="equipment-id">Q0.1</span>
            </div>
            <div className={`equipment ${outputs['Q0.2'] ? 'equipment-on' : ''}`}>
              <span className="equipment-icon">🌀</span>
              <span className="equipment-label">Mixer</span>
              <span className="equipment-id">Q0.2</span>
            </div>
            <div className={`equipment ${outputs['Q0.3'] ? 'equipment-on' : ''}`}>
              <span className="equipment-icon">⬇️</span>
              <span className="equipment-label">Pump 3</span>
              <span className="equipment-id">Q0.3</span>
            </div>
          </div>

          {/* Sensores */}
          <div className="sensor-group">
            <div className={`sensor ${inputs['I1.0'] ? 'sensor-active' : ''}`}>
              <span className="sensor-label">HI Level</span>
              <span className="sensor-id">I1.0</span>
            </div>
            <div className={`sensor ${inputs['I1.1'] ? 'sensor-active' : ''}`}>
              <span className="sensor-label">LO Level</span>
              <span className="sensor-id">I1.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
