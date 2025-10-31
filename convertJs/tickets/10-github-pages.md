# TICKET-10: GitHub Pages Deploy

**Status**: 🔴 TODO
**Prioridade**: 🟡 MÉDIA
**Estimativa**: 1 dia
**Dependências**: TICKET-04, TICKET-07

---

## 📋 Objetivo

Configurar deploy automático para GitHub Pages com CI/CD.

---

## ✅ Tarefas

### 1. Configurar Vite para GitHub Pages

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON === 'true' ? './' : '/Simulador_Clp/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```

### 2. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd convertJs/plc-simulator
          npm ci

      - name: Build
        run: |
          cd convertJs/plc-simulator
          npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: convertJs/plc-simulator/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Adaptar FileHandler para web

```typescript
// src/utils/fileHandler.ts

export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}

export async function saveFile(data: SaveFile, filename: string): Promise<void> {
  if (isElectron()) {
    // Usar Electron dialog
    await window.electronAPI!.saveFile(JSON.stringify(data, null, 2), filename)
  } else {
    // Usar download do navegador
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

export async function loadFile(): Promise<SaveFile | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const text = await file.text()
        resolve(JSON.parse(text))
      } else {
        resolve(null)
      }
    }
    input.click()
  })
}

// LocalStorage para web (não tem fs)
export function saveToLocalStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadFromLocalStorage(key: string): any {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}
```

### 4. Configurar GitHub Pages

1. Ir em Settings > Pages
2. Source: GitHub Actions
3. Aguardar deploy

---

## 🎯 Critérios de Aceitação

- [ ] Build automático no push para main
- [ ] Deploy bem-sucedido no GitHub Pages
- [ ] Site acessível em URL pública
- [ ] File save/load funciona no navegador
- [ ] LocalStorage salva estado

---

## 📝 Notas

- Base path deve incluir nome do repositório
- LocalStorage como fallback para arquivos
- Exemplos podem vir pré-carregados

---

## 🔗 Links Úteis

- [Vite deploy guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions docs](https://docs.github.com/en/actions)
