# 🏗️ Arquitetura do Projeto

**Simulador CLP - TypeScript/React/Electron**

---

## 📐 Visão Geral

Este projeto é uma migração completa do Simulador CLP de Java/Swing para TypeScript/React, mantendo toda a lógica e funcionalidade originais.

### Objetivos da Migração

1. **Multiplataforma moderna**: Desktop (Electron) + Web (GitHub Pages)
2. **Interface responsiva**: React com componentes funcionais
3. **TypeScript**: Segurança de tipos e melhor DX
4. **Performance**: Vite para builds instantâneos
5. **Manutenibilidade**: Código moderno e testável

---

## 🎨 Decisões Técnicas

### Por que TypeScript?

- ✅ **Segurança de tipos**: Evita bugs na lógica do interpretador
- ✅ **IntelliSense**: Autocomplete e documentação inline
- ✅ **Refatoração segura**: Mudanças quebram em compile-time
- ✅ **Escalabilidade**: Código mais fácil de manter

### Por que React?

- ✅ **Ecossistema maduro**: Milhões de desenvolvedores
- ✅ **Componentes reutilizáveis**: UI modular
- ✅ **Hooks**: useState, useEffect para lógica de estado
- ✅ **Performance**: Virtual DOM otimizado

### Por que Vite?

- ✅ **Velocidade**: HMR em < 100ms
- ✅ **Build otimizado**: Rollup para produção
- ✅ **ESM nativo**: Módulos modernos
- ✅ **Plugins**: Fácil integração com React/TypeScript

### Por que Electron?

- ✅ **Cross-platform**: Windows/macOS/Linux com mesmo código
- ✅ **Acesso ao sistema**: File system, dialogs nativos
- ✅ **Instaladores**: .exe, .dmg, .AppImage

---

## 📁 Estrutura de Pastas

```
plc-simulator/
├── electron/           # Electron main process
│   ├── main.ts        # Processo principal
│   └── preload.ts     # Ponte IPC segura
│
├── src/
│   ├── core/          # LÓGICA CENTRAL (port do Java)
│   │   ├── interpreter.ts       # Interpreta instruções IL
│   │   ├── parser.ts            # Parse linha → instrução
│   │   ├── types.ts             # Tipos TypeScript
│   │   ├── constants.ts         # Operadores válidos
│   │   ├── timerManager.ts      # Gerencia TON/TOFF
│   │   ├── memoryManager.ts     # Gerencia variáveis M/T/C
│   │   ├── utils.ts             # Funções auxiliares
│   │   └── validator.ts         # Validação de sintaxe
│   │
│   ├── components/    # Componentes React
│   │   ├── CodeEditor.tsx       # Editor de código IL
│   │   ├── IOPanel.tsx          # Painel I/O
│   │   ├── ControlBar.tsx       # Start/Stop/Refresh
│   │   ├── DataTable.tsx        # Tabela de variáveis
│   │   ├── FileMenu.tsx         # Menu arquivo
│   │   └── LanguageSelector.tsx # Seletor de idioma
│   │
│   ├── hooks/         # Custom hooks
│   │   ├── usePLCCycle.ts       # Ciclo de varredura PLC
│   │   ├── useTimerUpdate.ts    # Atualiza timers
│   │   └── useLanguage.ts       # i18n
│   │
│   ├── utils/         # Utilitários
│   │   └── fileHandler.ts       # Save/Load JSON
│   │
│   ├── i18n/          # Internacionalização
│   │   └── translations.ts      # PT/EN/JA/DE
│   │
│   ├── App.tsx        # Componente raiz
│   └── main.tsx       # Entry point
│
├── public/            # Assets estáticos
├── dist/              # Build output
└── build/             # Electron resources (ícones)
```

---

## 🔄 Fluxo de Dados

### 1. Ciclo de Varredura PLC

```
┌─────────────────────────────────────┐
│  1. Lê Entradas (inputs)            │
│     → Usuário clica botões I0.0...  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Processa Código IL               │
│     → Parser: texto → instruções     │
│     → Interpreter: executa lógica    │
│     → Acumulador, memória, timers    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Atualiza Saídas (outputs)        │
│     → LEDs Q0.0... acendem/apagam    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Atualiza Timers/Contadores       │
│     → setInterval para TON/TOFF      │
│     → Rising edge para CTU/CTD       │
└──────────────┬──────────────────────┘
               │
               ▼
        Repete (100ms)
```

### 2. Estado React

```typescript
// Estado principal (App.tsx ou hook)
interface PLCAppState {
  code: string                              // Código IL do usuário
  inputs: PLCInputs                         // I0.0, I0.1, ...
  outputs: PLCOutputs                       // Q0.0, Q0.1, ...
  memoryVariables: Map<string, MemoryVariable>  // M1, T1, C1...
  isRunning: boolean                        // RUN ou STOP
  language: Language                        // PT-BR, EN, JA, DE
}
```

### 3. Comunicação Electron ↔ Renderer

```
Main Process (Node.js)          Renderer Process (React)
     │                                    │
     │◄───────IPC: save-file─────────────│
     │                                    │
     │─────Show Save Dialog──────────────│
     │                                    │
     │─────Write to fs────────────────────│
     │                                    │
     │───────IPC: success────────────────►│
```

---

## 🧩 Componentes Principais

### 1. Interpreter (Core)

**Responsabilidade**: Executar instruções IL linha por linha

**Entrada**:
- `lines: string[]` - Array de linhas de código
- `inputs: PLCInputs` - Estado atual das entradas
- `outputs: PLCOutputs` - Estado anterior das saídas
- `memoryVariables: Map<>` - Memórias M/T/C

**Saída**:
- `outputs: PLCOutputs` - Saídas atualizadas

**Lógica**:
1. Parse cada linha (operador + variáveis)
2. Validar sintaxe
3. Executar operação no acumulador
4. Atualizar outputs ou memórias
5. Gerenciar timers/contadores

**Port do Java**:
- `Interpreter.java` (466 linhas) → `interpreter.ts`
- Lógica 100% idêntica
- Usar Map para memória (não objeto)

### 2. usePLCCycle Hook

**Responsabilidade**: Ciclo de 100ms (RUN mode)

```typescript
export function usePLCCycle(code: string) {
  const [inputs, setInputs] = useState<PLCInputs>(/* ... */)
  const [outputs, setOutputs] = useState<PLCOutputs>(/* ... */)
  const [memory, setMemory] = useState(new Map())
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // 1. Lê inputs (já no estado)
      // 2. Processa código
      const lines = code.split('\n')
      const newOutputs = executeCycle(lines, inputs, outputs, memory)

      // 3. Atualiza outputs
      setOutputs(newOutputs)

      // 4. Timers são gerenciados separadamente
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, code, inputs])

  return {
    inputs,
    outputs,
    memory,
    isRunning,
    updateInput: (key, value) => setInputs(prev => ({ ...prev, [key]: value })),
    start: () => setIsRunning(true),
    stop: () => setIsRunning(false),
    refresh: () => { /* reset tudo */ },
  }
}
```

### 3. Timer Manager

**Responsabilidade**: Controlar TON/TOFF com setInterval

```typescript
export function startTimer(memory: MemoryVariable) {
  memory.timerHandle = setInterval(() => {
    memory.counter++
    if (memory.counter >= memory.maxTimer) {
      memory.endTimer = (memory.timerType === 'ON')
      stopTimer(memory)
    }
  }, 100)
}
```

**Diferença do Java**:
- Java usa `javax.swing.Timer`
- JS usa `setInterval` (mesmo conceito)
- Tick de 100ms igual ao Java

---

## 🔌 Electron vs Web

### Feature Detection

```typescript
export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}
```

### Diferenças

| Feature | Electron | Web |
|---------|----------|-----|
| File System | `fs` via IPC | Download/Upload |
| Save/Load | Native dialogs | File input |
| Menu | Native menu | HTML menu |
| Atalhos | Global | Page-level |
| Persistência | Files | LocalStorage |

---

## 🎨 UI/UX

### Layout

```
┌─────────────────────────────────────────────────┐
│ Header: Título + Menu + Language                │
├──────────────────┬──────────────────────────────┤
│                  │                               │
│  Code Editor     │   Control Bar                 │
│  (CodeEditor.tsx)│   [Start] [Stop] [Refresh]    │
│                  │                               │
│  LD I0.0         │   IO Panel                    │
│  ST Q0.0         │   Inputs: [I0.0] [I0.1] ...   │
│                  │   Outputs: [Q0.0] [Q0.1] ...  │
│                  │                               │
│                  │   Data Table (opcional)       │
│                  │   Lista de variáveis          │
└──────────────────┴──────────────────────────────┘
```

### Cores e Tema

- **Input ativo**: Verde (#4CAF50)
- **Output ativo**: Vermelho (#ff4444) com glow
- **Background**: Branco/Cinza claro
- **Código**: Monospace (Courier New)

---

## 🧪 Testes

### Unitários (Vitest)

- Testar cada operador (LD, ST, AND, OR, etc)
- Testar timers e contadores
- Testar parser
- Testar validador de sintaxe

### E2E (Playwright)

- Fluxo completo: digitar código → start → clicar entrada → verificar saída
- Save/Load programa
- Trocar idioma
- Data table

---

## 🚀 Deploy

### Web (GitHub Pages)

- Build estático com Vite
- GitHub Actions para CI/CD
- Base path: `/Simulador_Clp/`
- LocalStorage para persistência

### Desktop (Electron)

- electron-builder
- Instaladores:
  - Windows: `.exe` (NSIS)
  - macOS: `.dmg`
  - Linux: `.AppImage`
- Sem code signing (caro)

---

## 📊 Comparação Java ↔ TypeScript

| Aspecto | Java | TypeScript |
|---------|------|------------|
| UI | Swing | React |
| Linguagem | OOP Classes | Functions |
| Timer | javax.swing.Timer | setInterval |
| File | FileReader/Writer | fs (Electron) / download (Web) |
| Build | Gradle | Vite |
| Instalador | Launch4j / jpackage | electron-builder |
| Tamanho | ~30MB | ~100MB (Electron) |
| Startup | ~2s | ~1s |

---

## 🔮 Próximos Passos

Após completar os 12 tickets:

1. **Repositório próprio**: Mover de `/convertJs` para repo exclusivo
2. **Features extras**:
   - Ladder Diagram (conversão IL ↔ Ladder)
   - Debugger passo a passo
   - Simulações 3D (Three.js)
3. **Publicação**:
   - NPM package para o core
   - VS Code extension
   - Mobile (React Native)

---

## 📚 Referências

- [Projeto Java Original](https://github.com/IasminPieraco/Trabalho-Final-CLP)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Electron Docs](https://electronjs.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👥 Contribuindo

Para contribuir:
1. Escolha um ticket em `/tickets`
2. Crie branch: `git checkout -b feature/ticket-XX`
3. Implemente seguindo este documento
4. Teste localmente
5. Abra PR com referência ao ticket

---

**Última atualização**: 2025-10-31
