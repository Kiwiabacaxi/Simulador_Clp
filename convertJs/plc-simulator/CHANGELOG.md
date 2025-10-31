# Changelog

Todas as mudanças notáveis do projeto serão documentadas aqui.

---

## [Unreleased]

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
