# TICKET-03: Core Logic - Timers e Contadores ✅

**Status**: ✅ CONCLUÍDO
**Prioridade**: 🔥 ALTA
**Estimativa**: 1-2 dias
**Dependências**: TICKET-02
**Concluído em**: 2025-10-31

---

## 📋 Objetivo

Implementar temporizadores (TON/TOFF) e contadores (CTU/CTD) usando setInterval do JavaScript.

**Arquivo de referência**: `src/ilcompiler/memoryvariable/MemoryVariable.java` (Timer em linha 28-40)

---

## ✅ Tarefas

### 1. Atualizar tipos para incluir timer handle

#### `src/core/types.ts` (adicionar)
```typescript
export interface MemoryVariable {
  id: string
  currentValue: boolean
  endTimer: boolean
  counter: number
  maxTimer: number
  timerType: 'ON' | 'OFF' | ''
  counterType: 'UP' | 'DOWN' | ''
  timerHandle?: NodeJS.Timeout  // Handle do setInterval
}
```

### 2. Implementar gerenciador de timers

#### `src/core/timerManager.ts`
```typescript
import { MemoryVariable } from './types'

const TIMER_TICK_MS = 100 // Cada tick = 100ms

export function startTimer(memory: MemoryVariable): void {
  // Parar timer anterior se existir
  if (memory.timerHandle) {
    clearInterval(memory.timerHandle)
  }

  memory.counter = 0
  memory.endTimer = memory.timerType === 'OFF'

  memory.timerHandle = setInterval(() => {
    if (memory.counter < memory.maxTimer) {
      memory.counter++
    }

    if (memory.counter >= memory.maxTimer) {
      if (memory.timerType === 'ON') {
        memory.endTimer = true
      } else if (memory.timerType === 'OFF') {
        memory.endTimer = false
      }
      stopTimer(memory)
    }
  }, TIMER_TICK_MS)
}

export function stopTimer(memory: MemoryVariable): void {
  if (memory.timerHandle) {
    clearInterval(memory.timerHandle)
    memory.timerHandle = undefined
  }
}

export function resetTimer(memory: MemoryVariable): void {
  stopTimer(memory)
  memory.counter = 0
  memory.endTimer = memory.timerType === 'OFF'
}
```

### 3. Adicionar lógica TON/TOFF ao interpretador

#### `src/core/interpreter.ts` (adicionar ao executeInstruction)
```typescript
import { startTimer, stopTimer } from './timerManager'

// Dentro de executeInstruction:

// TON - Timer ON Delay
if (operator === 'TON') {
  let mem = memoryVariables.get(variable)
  if (!mem) {
    mem = createMemoryVariable(variable)
    memoryVariables.set(variable, mem)
  }

  mem.timerType = 'ON'
  mem.maxTimer = parseInt(variables[1], 10)

  // Timer será controlado no ciclo de atualização
}

// TOFF - Timer OFF Delay
if (operator === 'TOFF') {
  let mem = memoryVariables.get(variable)
  if (!mem) {
    mem = createMemoryVariable(variable)
    memoryVariables.set(variable, mem)
  }

  mem.timerType = 'OFF'
  mem.maxTimer = parseInt(variables[1], 10)
}

// CTU - Counter Up
if (operator === 'CTU') {
  let mem = memoryVariables.get(variable)
  if (!mem) {
    mem = createMemoryVariable(variable)
    memoryVariables.set(variable, mem)
  }

  mem.counterType = 'UP'
  mem.maxTimer = parseInt(variables[1], 10) // maxTimer = preset
}

// CTD - Counter Down
if (operator === 'CTD') {
  let mem = memoryVariables.get(variable)
  if (!mem) {
    mem = createMemoryVariable(variable)
    memoryVariables.set(variable, mem)
  }

  mem.counterType = 'DOWN'
  mem.maxTimer = parseInt(variables[1], 10)
}
```

### 4. Criar hook para atualizar timers no ciclo

#### `src/hooks/useTimerUpdate.ts`
```typescript
import { useEffect } from 'react'
import { MemoryVariable } from '../core/types'
import { startTimer, stopTimer } from '../core/timerManager'

export function useTimerUpdate(
  memoryVariables: Map<string, MemoryVariable>,
  isRunning: boolean
) {
  useEffect(() => {
    if (!isRunning) {
      // Parar todos os timers quando parado
      memoryVariables.forEach((mem) => {
        if (mem.timerType !== '') {
          stopTimer(mem)
        }
      })
      return
    }

    // Atualizar timers baseado no currentValue
    memoryVariables.forEach((mem) => {
      if (mem.timerType === '') return

      if (mem.timerType === 'ON') {
        if (mem.currentValue) {
          // Timer deve estar rodando
          if (!mem.timerHandle) {
            startTimer(mem)
          }
        } else {
          // Timer deve estar parado e resetado
          stopTimer(mem)
          mem.counter = 0
          mem.endTimer = false
        }
      }

      if (mem.timerType === 'OFF') {
        if (mem.currentValue) {
          // Timer deve estar parado
          stopTimer(mem)
          mem.counter = 0
          mem.endTimer = true
        } else {
          // Timer deve estar rodando
          if (!mem.timerHandle) {
            startTimer(mem)
          }
        }
      }
    })
  }, [memoryVariables, isRunning])
}
```

### 5. Função de limpeza

#### `src/core/memoryManager.ts`
```typescript
import { MemoryVariable } from './types'
import { stopTimer } from './timerManager'

export function cleanupAllTimers(memoryVariables: Map<string, MemoryVariable>): void {
  memoryVariables.forEach((mem) => {
    if (mem.timerHandle) {
      stopTimer(mem)
    }
  })
}

export function resetAllMemory(memoryVariables: Map<string, MemoryVariable>): void {
  memoryVariables.forEach((mem) => {
    mem.currentValue = false
    mem.counter = 0
    mem.endTimer = mem.timerType === 'OFF'
    stopTimer(mem)
  })
}
```

---

## 🎯 Critérios de Aceitação

- [x] TON funciona: timer inicia quando entrada ativa
- [x] TOFF funciona: timer inicia quando entrada desativa
- [x] CTU incrementa no rising edge
- [x] CTD decrementa no rising edge
- [x] Timers param quando programa para
- [x] Timers resetam corretamente
- [x] Preset value funciona (ex: TON T1,30)
- [x] endTimer flag atualiza corretamente
- [x] Código TypeScript compila sem erros

---

## 🧪 Testes

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('Timers', () => {
  it('TON should activate after delay', async () => {
    const mem = createMemoryVariable('T1')
    mem.timerType = 'ON'
    mem.maxTimer = 5 // 500ms
    mem.currentValue = true

    startTimer(mem)

    await new Promise(resolve => setTimeout(resolve, 600))

    expect(mem.endTimer).toBe(true)
    expect(mem.counter).toBe(5)
  })

  it('CTU should count up', () => {
    const mem = createMemoryVariable('C1')
    mem.counterType = 'UP'
    mem.maxTimer = 3

    // Simular rising edges
    mem.currentValue = false
    handleCounter(mem, true) // 1
    mem.currentValue = true

    mem.currentValue = false
    handleCounter(mem, true) // 2
    mem.currentValue = true

    mem.currentValue = false
    handleCounter(mem, true) // 3
    mem.currentValue = true

    expect(mem.counter).toBe(3)
    expect(mem.endTimer).toBe(true)
  })
})
```

---

## 📝 Notas

- Timer tick de 100ms = mesma granularidade do Java
- Usar `clearInterval` na limpeza para evitar memory leaks
- Rising edge detection é crucial para contadores
- TON: timer roda quando entrada = true
- TOFF: timer roda quando entrada = false

---

## 🔗 Referência

- Java Timer: `MemoryVariable.java` linha 28-40
- Java Counter: `Interpreter.java` linhas 296-325
