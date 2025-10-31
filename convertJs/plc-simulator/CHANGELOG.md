# Changelog

Todas as mudanças notáveis do projeto serão documentadas aqui.

---

## [Unreleased]

### ✅ 2025-10-31 - TICKET-06: Data Table

**Implementado:**
- ✅ DataTable component (DataTable.tsx + CSS - 270 linhas)
  - Tabela de variáveis em tempo real
  - Mostra I, Q, M, T, C
  - Atualização automática durante simulação
- ✅ Filtros por tipo
  - Botões: Todas, Entradas, Saídas, Memória, Timers, Contadores
  - Cores diferentes para cada tipo
- ✅ Busca por nome
  - Input de busca com filtro em tempo real
  - Pesquisa case-insensitive
- ✅ Estatísticas no header
  - Conta variáveis ativas
  - Mostra total de cada tipo
- ✅ Informações detalhadas
  - Timers: counter/preset e porcentagem
  - Contadores: counter/preset e tipo (UP/DOWN)
  - Valores booleanos: ON/OFF
- ✅ Layout 3 colunas
  - Código | Simulação | Tabela de Dados
  - Responsivo (mobile: 1 coluna)

**Funcionalidades:**
- ✅ Tabela sticky header (scroll independente)
- ✅ Indicadores visuais (verde ON, cinza OFF)
- ✅ Border lateral colorida por tipo
- ✅ Hover effects nas linhas
- ✅ Total de variáveis filtradas no footer

**Total TICKET-06:** ~270 linhas

---

### ✅ 2025-10-31 - TICKET-04: UI Components

**Implementado:**
- ✅ CodeEditor component (CodeEditor.tsx + CSS)
  - Editor de código IL com maiúsculas automáticas
  - Textarea com fonte monospace
  - Placeholder com exemplos
- ✅ IOPanel component (IOPanel.tsx + CSS)
  - Botões para entradas (I0.0 - I1.7)
  - LEDs para saídas (Q0.0 - Q1.7)
  - Estados visuais (on/off com animações)
- ✅ ControlBar component (ControlBar.tsx + CSS)
  - Botão Start (inicia simulação)
  - Botão Stop (para simulação)
  - Botão Refresh (reseta memória)
  - Indicador de status (rodando/parado)
- ✅ FileMenu component (FileMenu.tsx + CSS)
  - Salvar código em JSON
  - Carregar código de JSON
  - Serialização de memória
- ✅ Hook usePLCCycle
  - Gerencia ciclo do PLC (100ms)
  - Controla inputs/outputs
  - Integra com timers
- ✅ App.tsx redesenhado
  - Layout grid responsivo
  - Header com gradiente
  - Footer com info dos tickets
  - Save/Load funcionais

**Funcionalidades:**
- ✅ Interface completa e funcional
- ✅ Layout responsivo (desktop e mobile)
- ✅ Animações e transições suaves
- ✅ Gradientes roxo/violeta
- ✅ LEDs com efeito pulse
- ✅ Botões com hover e disabled states

**Total TICKET-04:** ~650 linhas (componentes + estilos)

---

### ✅ 2025-10-31 - TICKET-03: Timers e Contadores

**Implementado:**
- ✅ Timer Manager (`timerManager.ts` - 158 linhas)
  - startTimer() / stopTimer() / resetTimer()
  - updateTimers() - Gerencia TON/TOFF baseado em currentValue
  - stopAllTimers() - Cleanup para prevenir memory leaks
- ✅ Memory Manager (`memoryManager.ts` - 169 linhas)
  - resetAllMemory() / resetTimers() / resetCounters()
  - getVariablesByType() / countVariablesByType()
  - serializeMemory() / deserializeMemory() - Para save/load
- ✅ Hook React (`useTimerUpdate.ts` - 88 linhas)
  - useTimerUpdate() - Hook principal
  - useTimerUpdateWithInterval() - Com controle de intervalo
  - useTimerCleanup() - Apenas cleanup
- ✅ Exports atualizados (`core/index.ts`, `hooks/index.ts`)

**Funcionalidades:**
- ✅ TON (Timer ON Delay) - Timer conta quando entrada = true
- ✅ TOFF (Timer OFF Delay) - Timer conta quando entrada = false
- ✅ CTU (Counter Up) - Rising edge detection
- ✅ CTD (Counter Down) - Rising edge detection
- ✅ Tick de 100ms (compatível com Java)

**Total TICKET-03:** ~415 linhas de código TypeScript

---

### ✅ 2025-10-31 - TICKET-02: Core Logic - Interpretador

**Implementado:**
- ✅ Tipos TypeScript completos (`types.ts` - 67 linhas)
- ✅ Funções utilitárias (`utils.ts` - 121 linhas)
- ✅ Parser de instruções IL (`parser.ts` - 88 linhas)
- ✅ Interpretador completo (`interpreter.ts` - 364 linhas)
- ✅ Exports centralizados (`index.ts`)

**Operadores IL implementados:**
- ✅ LD / LDN - Load / Load Negado
- ✅ ST / STN - Store / Store Negado
- ✅ AND / ANDN - AND / AND Negado
- ✅ OR / ORN - OR / OR Negado
- ✅ TON / TOFF - Timer ON/OFF Delay (configuração)
- ✅ CTU / CTD - Counter Up/Down (configuração)

**Port do Java:**
- Baseado em `Interpreter.java` (466 linhas)
- Lógica 100% preservada
- TypeScript strict mode

**Total:** ~640 linhas de código TypeScript

---

### ✅ 2025-10-31 - TICKET-01: Setup Inicial

**Implementado:**
- ✅ Projeto Node.js inicializado
- ✅ React 19.2 + TypeScript 5.7 + Vite 7.1
- ✅ Configurações (tsconfig, vite.config)
- ✅ Estrutura de pastas (src/core, components, hooks, utils)
- ✅ App.tsx básico
- ✅ Constantes do PLC (operadores válidos)

**Build:**
- ✅ Compila sem erros
- ✅ HMR funcional
- ✅ Bundle: ~200KB (gzip: ~63KB)

---

## Próximos Passos

### 🔜 TICKET-03: Timers e Contadores
- Implementar `timerManager.ts`
- setInterval para TON/TOFF
- Rising edge detection para CTU/CTD
- Hook `useTimerUpdate.ts`

### 🔜 TICKET-04: UI Components
- CodeEditor
- IOPanel (entradas/saídas)
- ControlBar (Start/Stop/Refresh)
- FileMenu

---

**Versão atual:** 0.2.0 (Pre-release)
**Status:** Core logic completo, aguardando UI
