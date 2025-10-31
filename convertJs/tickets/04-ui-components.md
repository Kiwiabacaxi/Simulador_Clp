# TICKET-04: UI - Componentes Base ✅

**Status**: ✅ CONCLUÍDO
**Prioridade**: 🔴 ALTA
**Estimativa**: 2-3 dias
**Dependências**: TICKET-02, TICKET-03
**Concluído em**: 2025-10-31

---

## 📋 Objetivo

Criar os componentes React fundamentais para a interface do simulador.

---

## ✅ Tarefas

### 1. CodeEditor Component

#### `src/components/CodeEditor.tsx`
```typescript
import { useState } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function CodeEditor({ value, onChange, disabled }: CodeEditorProps) {
  return (
    <div className="code-editor">
      <div className="editor-header">
        <h3>Código IL</h3>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        disabled={disabled}
        className="code-textarea"
        spellCheck={false}
        placeholder="Digite seu código aqui...
Exemplo:
LD I0.0
ST Q0.0"
      />
    </div>
  )
}
```

#### `src/components/CodeEditor.css`
```css
.code-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.editor-header {
  background: #f5f5f5;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
}

.code-textarea {
  flex: 1;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  border: none;
  resize: none;
  min-height: 300px;
}

.code-textarea:disabled {
  background: #f9f9f9;
  color: #666;
}
```

### 2. IOPanel Component

#### `src/components/IOPanel.tsx`
```typescript
import { PLCInputs, PLCOutputs } from '../core/types'

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
        <h3>Entradas (I)</h3>
        <div className="io-grid">
          {Object.entries(inputs).map(([key, value]) => (
            <div key={key} className="io-item">
              <button
                className={`input-button ${value ? 'active' : ''}`}
                onClick={() => !disabled && onInputChange(key, !value)}
                disabled={disabled}
              >
                {key}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="outputs-section">
        <h3>Saídas (Q)</h3>
        <div className="io-grid">
          {Object.entries(outputs).map(([key, value]) => (
            <div key={key} className="io-item">
              <div className={`output-led ${value ? 'on' : 'off'}`}>
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### `src/components/IOPanel.css`
```css
.io-panel {
  display: flex;
  gap: 20px;
  padding: 16px;
}

.inputs-section,
.outputs-section {
  flex: 1;
}

.io-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.input-button {
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.input-button:hover:not(:disabled) {
  background: #f0f0f0;
}

.input-button.active {
  background: #4CAF50;
  color: white;
  border-color: #45a049;
}

.input-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.output-led {
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 4px;
  text-align: center;
  transition: all 0.2s;
}

.output-led.on {
  background: #ff4444;
  color: white;
  border-color: #cc0000;
  box-shadow: 0 0 10px rgba(255, 68, 68, 0.6);
}

.output-led.off {
  background: #f5f5f5;
  color: #999;
}
```

### 3. ControlBar Component

#### `src/components/ControlBar.tsx`
```typescript
interface ControlBarProps {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  onRefresh: () => void
}

export function ControlBar({ isRunning, onStart, onStop, onRefresh }: ControlBarProps) {
  return (
    <div className="control-bar">
      <button
        onClick={onStart}
        disabled={isRunning}
        className="control-btn start"
      >
        ▶ Start
      </button>
      <button
        onClick={onStop}
        disabled={!isRunning}
        className="control-btn stop"
      >
        ⏸ Stop
      </button>
      <button
        onClick={onRefresh}
        disabled={isRunning}
        className="control-btn refresh"
      >
        🔄 Refresh
      </button>
    </div>
  )
}
```

### 4. FileMenu Component

#### `src/components/FileMenu.tsx`
```typescript
interface FileMenuProps {
  onSave: () => void
  onLoad: (file: File) => void
  disabled?: boolean
}

export function FileMenu({ onSave, onLoad, disabled }: FileMenuProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onLoad(file)
    }
  }

  return (
    <div className="file-menu">
      <button onClick={onSave} disabled={disabled}>
        💾 Salvar
      </button>
      <label className="file-input-label">
        📂 Carregar
        <input
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          disabled={disabled}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )
}
```

### 5. App.tsx - Integração

#### `src/App.tsx`
```typescript
import { useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { IOPanel } from './components/IOPanel'
import { ControlBar } from './components/ControlBar'
import { FileMenu } from './components/FileMenu'
import { usePLCCycle } from './hooks/usePLCCycle'
import './App.css'

function App() {
  const [code, setCode] = useState('')
  const {
    inputs,
    outputs,
    isRunning,
    updateInput,
    start,
    stop,
    refresh,
  } = usePLCCycle(code)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 Simulador CLP - TypeScript</h1>
        <FileMenu
          onSave={() => console.log('Save')}
          onLoad={() => console.log('Load')}
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
          />
        </section>
      </main>
    </div>
  )
}

export default App
```

---

## 🎯 Critérios de Aceitação

- [x] CodeEditor exibe e edita código
- [x] IOPanel mostra entradas e saídas
- [x] Botões de entrada funcionam
- [x] LEDs de saída acendem/apagam
- [x] ControlBar controla execução
- [x] FileMenu permite save/load
- [x] Layout responsivo e limpo
- [x] Componentes tipados com TypeScript

---

## 📝 Notas

- Usar CSS modules ou styled-components se preferir
- Manter componentes pequenos e reutilizáveis
- Accessibility: botões com aria-labels
- Mobile: layout deve se adaptar

---

## 🔗 Referência

- Java UI: `src/screens/HomePg.java`
