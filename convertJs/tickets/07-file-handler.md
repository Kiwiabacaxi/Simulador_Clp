# TICKET-07: File Handler (Save/Load) ✅

**Status**: ✅ CONCLUÍDO
**Prioridade**: 🔴 ALTA
**Estimativa**: 1 dia
**Dependências**: TICKET-04
**Concluído em**: 2025-10-31

---

## 📋 Objetivo

Implementar sistema de save/load em JSON, funcional tanto no Electron quanto na web.

---

## ✅ Tarefas

### 1. Formato JSON

```typescript
interface SaveFile {
  version: '1.0'
  metadata: {
    name: string
    description: string
    createdAt: string
  }
  code: string
  inputs?: PLCInputs
  outputs?: PLCOutputs
}
```

### 2. FileHandler

```typescript
export async function saveProgram(
  code: string,
  filename: string
): Promise<void> {
  const data: SaveFile = {
    version: '1.0',
    metadata: {
      name: filename,
      description: '',
      createdAt: new Date().toISOString(),
    },
    code,
  }

  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  a.click()

  URL.revokeObjectURL(url)
}

export async function loadProgram(file: File): Promise<SaveFile> {
  const text = await file.text()
  return JSON.parse(text)
}
```

### 3. Converter exemplos .txt para .json

Criar script para converter:
- Exemplo 1 - Simples.txt → example1-simple.json
- Exemplo 2 - Timer.txt → example2-timer.json
- Exemplo 3 - Contador.txt → example3-counter.json

---

## 🎯 Critérios de Aceitação

- [x] Salva programas em JSON
- [x] Carrega programas JSON
- [x] Funciona no navegador
- [ ] Funciona no Electron (fs) - **Adiado** (focando em versão web)
- [x] Exemplos convertidos (10 exemplos JSON criados)
- [x] Validação de versão e formato
- [x] Tratamento de erros robusto
- [x] Menu de exemplos integrado (ExamplesMenu component)

---

## 🔗 Referência

- `src/save/Save.java` (47 linhas)
- `src/Controllers/HomePageController.java` (linhas 57-111)
