/**
 * Scene Selector - Seleciona entre diferentes cenas de simulação
 */

import './SceneSelector.css'
import type { SceneType } from '../utils'

interface SceneSelectorProps {
  currentScene: SceneType
  onSceneChange: (scene: SceneType) => void
  disabled?: boolean
}

const SCENES = [
  { id: 'default' as SceneType, label: 'Painel (padrão)', icon: '🎛️', description: 'Interface genérica I/O' },
  { id: 'batch' as SceneType, label: 'Simulação Batch', icon: '🏭', description: 'Processo de tanque' },
  { id: 'gate' as SceneType, label: 'Portão Automático', icon: '🚪', description: 'Controle de portão' },
  { id: 'traffic-light' as SceneType, label: 'Semáforo', icon: '🚦', description: 'Semáforo com timers' },
]

export function SceneSelector({ currentScene, onSceneChange, disabled = false }: SceneSelectorProps) {
  return (
    <div className="scene-selector">
      <label className="scene-selector-label">Cena de Simulação:</label>
      <div className="scene-selector-buttons">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            className={`scene-button ${currentScene === scene.id ? 'active' : ''}`}
            onClick={() => onSceneChange(scene.id)}
            disabled={disabled}
            title={scene.description}
          >
            <span className="scene-icon">{scene.icon}</span>
            <div className="scene-info">
              <span className="scene-label">{scene.label}</span>
              <span className="scene-description">{scene.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
