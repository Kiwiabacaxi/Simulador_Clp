# TICKET-01: Setup Inicial

**Status**: 🔴 TODO
**Prioridade**: 🔥 CRÍTICO
**Estimativa**: 1 dia
**Dependências**: Nenhuma

---

## 📋 Objetivo

Criar toda a estrutura base do projeto TypeScript/React/Vite/Electron com as configurações necessárias.

---

## ✅ Tarefas

### 1. Inicializar projeto Node.js
```bash
cd convertJs/plc-simulator
npm init -y
```

### 2. Instalar dependências principais
```bash
# React + TypeScript
npm install react react-dom
npm install -D @types/react @types/react-dom

# Vite
npm install -D vite @vitejs/plugin-react

# TypeScript
npm install -D typescript

# Electron
npm install -D electron electron-builder
```

### 3. Criar arquivos de configuração

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Para funcionar no Electron e GitHub Pages
})
```

#### `package.json` - adicionar scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "electron:dev": "electron .",
    "electron:build": "npm run build && electron-builder"
  }
}
```

### 4. Criar estrutura de pastas
```bash
mkdir -p src/core src/components src/hooks src/utils electron public
```

### 5. Criar arquivos iniciais

#### `src/main.tsx`
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `src/App.tsx`
```typescript
function App() {
  return (
    <div>
      <h1>PLC Simulator - TypeScript</h1>
      <p>Setup inicial concluído!</p>
    </div>
  )
}

export default App
```

#### `index.html`
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simulador CLP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 6. Criar arquivo de constantes

#### `src/core/constants.ts`
```typescript
export const VALID_OPERATORS = [
  'LD',
  'LDN',
  'ST',
  'STN',
  'AND',
  'ANDN',
  'OR',
  'ORN',
  'TON',
  'TOFF',
  'CTD',
  'CTU',
] as const

export type Operator = typeof VALID_OPERATORS[number]

export const CYCLE_DELAY_MS = 100
```

### 7. Setup ESLint/Prettier (opcional mas recomendado)
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

---

## 🎯 Critérios de Aceitação

- [ ] Projeto roda com `npm run dev`
- [ ] TypeScript compila sem erros
- [ ] React renderiza componente básico
- [ ] Hot Module Replacement (HMR) funciona
- [ ] Estrutura de pastas criada
- [ ] Arquivo de constantes criado

---

## 📝 Notas

- Usar Vite por ser muito mais rápido que Create React App
- Base path `./' importante para funcionar no Electron
- Strict mode do TypeScript para pegar erros cedo

---

## 🔗 Links Úteis

- [Vite Getting Started](https://vitejs.dev/guide/)
- [TypeScript React](https://react.dev/learn/typescript)
- [Electron Quick Start](https://www.electronjs.org/docs/latest/tutorial/quick-start)
