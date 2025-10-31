/**
 * Barra de Controle (Start/Stop/Refresh)
 * Baseado em HomePg.java botões de controle
 */

import './ControlBar.css'

interface ControlBarProps {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  onRefresh: () => void
}

export function ControlBar({ isRunning, onStart, onStop, onRefresh }: ControlBarProps) {
  return (
    <div className="control-bar">
      <div className="control-buttons">
        <button
          onClick={onStart}
          disabled={isRunning}
          className="control-btn start"
          aria-label="Iniciar simulação"
          title="Iniciar simulação (F5)"
        >
          <span className="btn-icon">▶</span>
          <span className="btn-text">Start</span>
        </button>

        <button
          onClick={onStop}
          disabled={!isRunning}
          className="control-btn stop"
          aria-label="Parar simulação"
          title="Parar simulação (F6)"
        >
          <span className="btn-icon">⏸</span>
          <span className="btn-text">Stop</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={isRunning}
          className="control-btn refresh"
          aria-label="Resetar memória"
          title="Resetar toda a memória (F7)"
        >
          <span className="btn-icon">🔄</span>
          <span className="btn-text">Refresh</span>
        </button>
      </div>

      <div className="status-indicator">
        <span className={`status-dot ${isRunning ? 'running' : 'stopped'}`}></span>
        <span className="status-text">
          {isRunning ? '🟢 Rodando' : '🔴 Parado'}
        </span>
      </div>
    </div>
  )
}
