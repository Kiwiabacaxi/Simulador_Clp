/**
 * Aplicação Principal - Simulador CLP
 * Integra todos os componentes UI
 */

import { useState } from 'react'
import {
  CodeEditor,
  ControlBar,
  FileMenu,
  DataTable,
  ExamplesMenu,
  SceneSelector,
  DefaultScenePanel,
  BatchSimulationPanel,
  GateScene,
  TrafficLightScene,
} from './components'
import { usePLCCycle } from './hooks'
import { saveProgram, loadProgram, type SceneType } from './utils'
import './App.css'

function App() {
  const [code, setCode] = useState('')
  const [currentScene, setCurrentScene] = useState<SceneType>('default')
  const {
    inputs,
    outputs,
    memory,
    isRunning,
    updateInput,
    start,
    stop,
    refresh,
  } = usePLCCycle(code)

  // Salva o código em JSON
  const handleSave = () => {
    try {
      saveProgram(code, memory, 'plc-program')
    } catch (error) {
      alert(`Erro ao salvar: ${error instanceof Error ? error.message : 'erro desconhecido'}`)
    }
  }

  // Carrega código de arquivo JSON
  const handleLoad = async (file: File) => {
    try {
      const data = await loadProgram(file)
      setCode(data.code)

      // Carrega a cena recomendada se disponível
      if (data.metadata?.scene) {
        setCurrentScene(data.metadata.scene)
        console.log(`📌 Cena auto-selecionada: ${data.metadata.scene}`)
      }

      // Mostra instruções se disponível
      if (data.metadata?.instructions) {
        console.log(`📋 Instruções: ${data.metadata.instructions}`)
      }

      // Restaura memória se disponível
      if (data.memory) {
        memory.clear()
        Object.entries(data.memory).forEach(([key, value]) => {
          memory.set(key, value as any)
        })
      }
    } catch (error) {
      alert(`Erro ao carregar: ${error instanceof Error ? error.message : 'erro desconhecido'}`)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 Simulador CLP</h1>
          <p className="header-subtitle">Instruction List (IL) Interpreter</p>
        </div>
        <div className="header-actions">
          <ExamplesMenu
            onLoadExample={handleLoad}
            disabled={isRunning}
          />
          <FileMenu
            onSave={handleSave}
            onLoad={handleLoad}
            disabled={isRunning}
          />
        </div>
      </header>

      <main className="app-main">
        <aside className="code-section">
          <CodeEditor
            value={code}
            onChange={setCode}
            disabled={isRunning}
          />
        </aside>

        <section className="simulation-section">
          <ControlBar
            isRunning={isRunning}
            onStart={start}
            onStop={stop}
            onRefresh={refresh}
          />

          <SceneSelector
            currentScene={currentScene}
            onSceneChange={setCurrentScene}
            disabled={isRunning}
          />

          {/* Renderiza o painel de cena apropriado */}
          {currentScene === 'default' && (
            <DefaultScenePanel
              inputs={inputs}
              outputs={outputs}
              onInputChange={updateInput}
              disabled={isRunning}
            />
          )}
          {currentScene === 'batch' && (
            <BatchSimulationPanel
              inputs={inputs}
              outputs={outputs}
              onInputChange={updateInput}
              disabled={isRunning}
            />
          )}
          {currentScene === 'gate' && (
            <GateScene
              inputs={inputs}
              outputs={outputs}
              onInputChange={updateInput}
              disabled={isRunning}
            />
          )}
          {currentScene === 'traffic-light' && (
            <TrafficLightScene
              inputs={inputs}
              outputs={outputs}
              onInputChange={updateInput}
              disabled={isRunning}
            />
          )}
        </section>

        <aside className="data-section">
          <DataTable
            inputs={inputs}
            outputs={outputs}
            memoryVariables={memory}
          />
        </aside>
      </main>

      <footer className="app-footer">
        <p>
          ✅ TICKET-01 | TICKET-02 | TICKET-03 | TICKET-04 | TICKET-05 | TICKET-06 | TICKET-07
          <span className="footer-separator">•</span>
          TypeScript {import.meta.env.MODE === 'development' ? 'DEV' : 'PROD'}
        </p>
      </footer>
    </div>
  )
}

export default App
