/**
 * Gate Scene - Cena de Portão Automático
 * Simula um portão com sensores de fim de curso e botões de controle
 */

import { useState, useEffect } from 'react'
import { PLCInputs, PLCOutputs } from '../core'
import './GateScene.css'

interface GateSceneProps {
  inputs: PLCInputs
  outputs: PLCOutputs
  onInputChange: (key: string, value: boolean) => void
  disabled?: boolean
}

// Posição do portão (0 = fechado, 100 = aberto)
const GATE_SPEED = 15 // % por segundo

export function GateScene({ inputs, outputs, onInputChange, disabled = false }: GateSceneProps) {
  const [gatePosition, setGatePosition] = useState<number>(0) // 0 = fechado, 100 = aberto

  // Atualiza posição do portão baseado nos motores
  useEffect(() => {
    const motorOpen = outputs['Q0.0'] // Motor abrindo
    const motorClose = outputs['Q0.1'] // Motor fechando

    let animationFrame: number | undefined

    const animate = () => {
      setGatePosition((prev) => {
        let newPos = prev

        if (motorOpen && !motorClose) {
          newPos += GATE_SPEED / 60 // Aproximadamente 60 FPS
        } else if (motorClose && !motorOpen) {
          newPos -= GATE_SPEED / 60
        }

        return Math.max(0, Math.min(100, newPos))
      })

      animationFrame = requestAnimationFrame(animate)
    }

    if (motorOpen || motorClose) {
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [outputs])

  // Atualiza sensores de fim de curso
  useEffect(() => {
    const fcOpen = gatePosition >= 99 // I1.0 - Fim de curso aberto
    const fcClosed = gatePosition <= 1 // I1.1 - Fim de curso fechado

    if (inputs['I1.0'] !== fcOpen) {
      onInputChange('I1.0', fcOpen)
    }
    if (inputs['I1.1'] !== fcClosed) {
      onInputChange('I1.1', fcClosed)
    }
  }, [gatePosition, inputs, onInputChange])

  const handleButtonClick = (key: string) => {
    if (!disabled) {
      // Pulso momentâneo - simula botão físico
      onInputChange(key, true)
      setTimeout(() => onInputChange(key, false), 200)
    }
  }

  return (
    <div className="gate-scene">
      {/* Controles */}
      <div className="gate-controls">
        <h3 className="controls-title">Controles</h3>

        <button
          className="gate-control-button open-button"
          onClick={() => handleButtonClick('I0.0')}
          disabled={disabled}
        >
          <span className="button-icon">⬆️</span>
          <span className="button-label">ABRIR</span>
          <span className="button-id">I0.0</span>
        </button>

        <button
          className="gate-control-button close-button"
          onClick={() => handleButtonClick('I0.1')}
          disabled={disabled}
        >
          <span className="button-icon">⬇️</span>
          <span className="button-label">FECHAR</span>
          <span className="button-id">I0.1</span>
        </button>

        <button
          className="gate-control-button stop-button"
          onClick={() => handleButtonClick('I0.2')}
          disabled={disabled}
        >
          <span className="button-icon">⏸️</span>
          <span className="button-label">PARAR</span>
          <span className="button-id">I0.2</span>
        </button>
      </div>

      {/* Visualização do Portão */}
      <div className="gate-visualization">
        <svg viewBox="0 0 400 300" className="gate-svg">
          {/* Estrutura */}
          <rect x="50" y="50" width="20" height="200" fill="#666" /> {/* Pilar esquerdo */}
          <rect x="330" y="50" width="20" height="200" fill="#666" /> {/* Pilar direito */}
          <rect x="70" y="50" width="260" height="10" fill="#444" /> {/* Topo */}

          {/* Portão (move verticalmente) */}
          <rect
            x="75"
            y={60 + (140 * (100 - gatePosition)) / 100}
            width="250"
            height="140"
            fill={outputs['Q0.0'] || outputs['Q0.1'] ? '#4dabf7' : '#94a3b8'}
            stroke="#334155"
            strokeWidth="3"
            opacity="0.9"
          />

          {/* Linhas do portão (efeito de grade) */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`h${i}`}
              x1="75"
              y1={60 + (140 * (100 - gatePosition)) / 100 + i * 28}
              x2="325"
              y2={60 + (140 * (100 - gatePosition)) / 100 + i * 28}
              stroke="#334155"
              strokeWidth="2"
            />
          ))}

          {/* Indicador de posição */}
          <text x="200" y="280" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#333">
            {Math.round(gatePosition)}%
          </text>

          {/* Setas indicando movimento */}
          {outputs['Q0.0'] && (
            <text x="200" y="30" textAnchor="middle" fontSize="32">
              ⬆️
            </text>
          )}
          {outputs['Q0.1'] && (
            <text x="200" y="30" textAnchor="middle" fontSize="32">
              ⬇️
            </text>
          )}
        </svg>
      </div>

      {/* Indicadores */}
      <div className="gate-indicators">
        <h3 className="indicators-title">Status</h3>

        {/* Motores */}
        <div className="indicator-group">
          <div className={`indicator ${outputs['Q0.0'] ? 'indicator-on' : ''}`}>
            <span className="indicator-icon">⬆️</span>
            <span className="indicator-label">Motor Abrindo</span>
            <span className="indicator-id">Q0.0</span>
          </div>

          <div className={`indicator ${outputs['Q0.1'] ? 'indicator-on' : ''}`}>
            <span className="indicator-icon">⬇️</span>
            <span className="indicator-label">Motor Fechando</span>
            <span className="indicator-id">Q0.1</span>
          </div>
        </div>

        {/* Sensores */}
        <div className="indicator-group">
          <div className={`indicator sensor ${inputs['I1.0'] ? 'sensor-active' : ''}`}>
            <span className="indicator-icon">🔴</span>
            <span className="indicator-label">FC Aberto</span>
            <span className="indicator-id">I1.0</span>
          </div>

          <div className={`indicator sensor ${inputs['I1.1'] ? 'sensor-active' : ''}`}>
            <span className="indicator-icon">🔴</span>
            <span className="indicator-label">FC Fechado</span>
            <span className="indicator-id">I1.1</span>
          </div>
        </div>

        {/* LEDs de Sinalização */}
        <div className="indicator-group">
          <div className={`indicator led ${outputs['Q1.0'] ? 'led-on' : ''}`}>
            <span className="indicator-icon">💡</span>
            <span className="indicator-label">Luz Verde</span>
            <span className="indicator-id">Q1.0</span>
          </div>

          <div className={`indicator led ${outputs['Q1.1'] ? 'led-on' : ''}`}>
            <span className="indicator-icon">💡</span>
            <span className="indicator-label">Luz Vermelha</span>
            <span className="indicator-id">Q1.1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
