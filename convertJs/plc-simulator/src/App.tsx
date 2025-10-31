/**
 * Aplicação Principal - Simulador CLP
 * Integra todos os componentes UI
 */

import { useState } from 'react'
import { CodeEditor, IOPanel, ControlBar, FileMenu } from './components'
import { usePLCCycle } from './hooks'
import { serializeMemory, deserializeMemory } from './core'
import './App.css'

function App() {
  const [code, setCode] = useState('')
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
    const data = {
      version: '1.0',
      metadata: {
        name: 'Programa PLC',
        date: new Date().toISOString(),
        description: 'Programa exportado do Simulador CLP'
      },
      code,
      memory: serializeMemory(memory)
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `plc-program-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('💾 Arquivo salvo:', a.download)
  }

  // Carrega código de arquivo JSON
  const handleLoad = async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (data.code) {
        setCode(data.code)
        console.log('📂 Arquivo carregado:', file.name)

        // Restaura memória se disponível
        if (data.memory) {
          const loadedMemory = deserializeMemory(data.memory)
          memory.clear()
          loadedMemory.forEach((value, key) => {
            memory.set(key, value)
          })
        }
      } else {
        alert('Arquivo JSON inválido: campo "code" não encontrado')
      }
    } catch (error) {
      console.error('Erro ao carregar arquivo:', error)
      alert('Erro ao carregar arquivo. Verifique se é um JSON válido.')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 Simulador CLP</h1>
          <p className="header-subtitle">Instruction List (IL) Interpreter</p>
        </div>
        <FileMenu
          onSave={handleSave}
          onLoad={handleLoad}
          disabled={isRunning}
        />
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
          <IOPanel
            inputs={inputs}
            outputs={outputs}
            onInputChange={updateInput}
            disabled={isRunning}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          ✅ TICKET-01 | TICKET-02 | TICKET-03 | TICKET-04
          <span className="footer-separator">•</span>
          TypeScript {import.meta.env.MODE === 'development' ? 'DEV' : 'PROD'}
        </p>
      </footer>
    </div>
  )
}

export default App
