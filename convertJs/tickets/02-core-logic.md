# TICKET-02: Core Logic - Interpretador

**Status**: 🔴 TODO
**Prioridade**: 🔥 CRÍTICO
**Estimativa**: 2-3 dias
**Dependências**: TICKET-01

---

## 📋 Objetivo

Portar a lógica principal do interpretador IL de Java para TypeScript, mantendo 100% da funcionalidade.

**Arquivo de referência**: `src/ilcompiler/interpreter/Interpreter.java` (466 linhas)

---

## ✅ Tarefas

### 1. Criar tipos TypeScript

#### `src/core/types.ts`
```typescript
export type InputType = 'BUTTON' | 'SWITCH' | 'SENSOR'

export interface PLCInputs {
  [key: string]: boolean
}

export interface PLCOutputs {
  [key: string]: boolean
}

export interface MemoryVariable {
  id: string
  currentValue: boolean
  endTimer: boolean
  counter: number
  maxTimer: number
  timerType: 'ON' | 'OFF' | ''
  counterType: 'UP' | 'DOWN' | ''
}

export interface PLCState {
  inputs: PLCInputs
  outputs: PLCOutputs
  memoryVariables: Map<string, MemoryVariable>
  accumulator: boolean | null
}

export interface ParsedInstruction {
  operator: string
  variables: string[]
}
```

### 2. Implementar funções auxiliares

#### `src/core/utils.ts`
```typescript
import { VALID_OPERATORS } from './constants'

export function isValidOperator(operator: string): boolean {
  return VALID_OPERATORS.includes(operator as any)
}

export function isInput(variable: string): boolean {
  return variable.startsWith('I')
}

export function isOutput(variable: string): boolean {
  return variable.startsWith('Q')
}

export function isMemory(variable: string): boolean {
  return variable.startsWith('M') || variable.startsWith('T') || variable.startsWith('C')
}

export function getMemoryType(variable: string): 'M' | 'T' | 'C' | null {
  const firstChar = variable.charAt(0)
  if (firstChar === 'M' || firstChar === 'T' || firstChar === 'C') {
    return firstChar
  }
  return null
}
```

### 3. Implementar parser de linhas

#### `src/core/parser.ts`
```typescript
import { ParsedInstruction } from './types'

export function parseInstruction(line: string): ParsedInstruction | null {
  // Remove espaços extras e quebras de linha
  const cleaned = line.trim()

  if (cleaned === '') {
    return null
  }

  let operator = ''
  let variable = ''
  const variables: string[] = []
  let spaceDetected = false

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]

    // Construir operador
    if (char !== ' ' && char !== '\t' && char !== ',' && !spaceDetected) {
      operator += char
    }

    // Detectar espaço após operador
    if ((char === ' ' || char === '\t') && operator !== '') {
      spaceDetected = true
    }

    // Vírgula separa variáveis múltiplas (ex: TON T1,30)
    if (char === ',' && operator !== '') {
      variables.push(variable)
      variable = ''
    }

    // Construir variável
    if (char !== ' ' && char !== '\t' && char !== ',' && spaceDetected) {
      variable += char
    }
  }

  // Adicionar última variável
  if (variable !== '') {
    variables.push(variable)
  }

  return { operator, variables }
}
```

### 4. Implementar interpretador principal

#### `src/core/interpreter.ts`
```typescript
import { PLCState, PLCInputs, PLCOutputs, MemoryVariable } from './types'
import { parseInstruction } from './parser'
import { isValidOperator, isInput, isOutput, getMemoryType } from './utils'

export function executeCycle(
  lines: string[],
  inputs: PLCInputs,
  outputs: PLCOutputs,
  memoryVariables: Map<string, MemoryVariable>
): PLCOutputs {
  let accumulator: boolean | null = null

  for (const line of lines) {
    const instruction = parseInstruction(line)

    if (!instruction) continue

    const { operator, variables } = instruction

    if (!isValidOperator(operator)) {
      console.error(`Operador inválido: ${operator}`)
      continue
    }

    // Executar instrução
    const result = executeInstruction(
      operator,
      variables,
      inputs,
      outputs,
      memoryVariables,
      accumulator
    )

    accumulator = result.accumulator
    outputs = result.outputs
  }

  return outputs
}

function executeInstruction(
  operator: string,
  variables: string[],
  inputs: PLCInputs,
  outputs: PLCOutputs,
  memoryVariables: Map<string, MemoryVariable>,
  accumulator: boolean | null
): { accumulator: boolean | null; outputs: PLCOutputs } {
  const variable = variables[0]

  // LD - Load
  if (operator === 'LD') {
    if (isInput(variable)) {
      accumulator = inputs[variable] ?? false
    } else if (isOutput(variable)) {
      accumulator = outputs[variable] ?? false
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        accumulator = (type === 'T' || type === 'C') ? mem.endTimer : mem.currentValue
      }
    }
  }

  // LDN - Load Negado
  if (operator === 'LDN') {
    if (isInput(variable)) {
      accumulator = !(inputs[variable] ?? false)
    } else if (isOutput(variable)) {
      accumulator = !(outputs[variable] ?? false)
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        accumulator = (type === 'T' || type === 'C') ? !mem.endTimer : !mem.currentValue
      }
    }
  }

  // ST - Store
  if (operator === 'ST' && accumulator !== null) {
    if (isOutput(variable)) {
      outputs[variable] = accumulator
    } else {
      // Memória
      let mem = memoryVariables.get(variable)
      if (!mem) {
        mem = createMemoryVariable(variable)
        memoryVariables.set(variable, mem)
      }
      mem.currentValue = accumulator

      // Lógica de contador
      const type = getMemoryType(variable)
      if (type === 'C') {
        handleCounter(mem, accumulator)
      }
    }
  }

  // STN - Store Negado
  if (operator === 'STN' && accumulator !== null) {
    if (isOutput(variable)) {
      outputs[variable] = !accumulator
    } else {
      let mem = memoryVariables.get(variable)
      if (!mem) {
        mem = createMemoryVariable(variable)
        memoryVariables.set(variable, mem)
      }
      mem.currentValue = !accumulator

      const type = getMemoryType(variable)
      if (type === 'C') {
        handleCounter(mem, !accumulator)
      }
    }
  }

  // AND
  if (operator === 'AND' && accumulator !== null) {
    if (isInput(variable)) {
      accumulator = accumulator && (inputs[variable] ?? false)
    } else if (isOutput(variable)) {
      accumulator = accumulator && (outputs[variable] ?? false)
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        const value = (type === 'T' || type === 'C') ? mem.endTimer : mem.currentValue
        accumulator = accumulator && value
      }
    }
  }

  // ANDN
  if (operator === 'ANDN' && accumulator !== null) {
    if (isInput(variable)) {
      accumulator = accumulator && !(inputs[variable] ?? false)
    } else if (isOutput(variable)) {
      accumulator = accumulator && !(outputs[variable] ?? false)
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        const value = (type === 'T' || type === 'C') ? mem.endTimer : mem.currentValue
        accumulator = accumulator && !value
      }
    }
  }

  // OR
  if (operator === 'OR' && accumulator !== null) {
    if (isInput(variable)) {
      accumulator = accumulator || (inputs[variable] ?? false)
    } else if (isOutput(variable)) {
      accumulator = accumulator || (outputs[variable] ?? false)
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        const value = (type === 'T' || type === 'C') ? mem.endTimer : mem.currentValue
        accumulator = accumulator || value
      }
    }
  }

  // ORN
  if (operator === 'ORN' && accumulator !== null) {
    if (isInput(variable)) {
      accumulator = accumulator || !(inputs[variable] ?? false)
    } else if (isOutput(variable)) {
      accumulator = accumulator || !(outputs[variable] ?? false)
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        const value = (type === 'T' || type === 'C') ? mem.endTimer : mem.currentValue
        accumulator = accumulator || !value
      }
    }
  }

  // TON/TOFF - Ver TICKET-03
  // CTU/CTD - Ver TICKET-03

  return { accumulator, outputs }
}

function createMemoryVariable(id: string): MemoryVariable {
  return {
    id,
    currentValue: false,
    endTimer: false,
    counter: 0,
    maxTimer: 0,
    timerType: '',
    counterType: '',
  }
}

function handleCounter(mem: MemoryVariable, currentValue: boolean): void {
  if (mem.counterType === 'UP') {
    if (!mem.currentValue && currentValue) {
      mem.counter++
    }
    mem.endTimer = mem.counter >= mem.maxTimer
  } else if (mem.counterType === 'DOWN') {
    if (!mem.currentValue && currentValue) {
      mem.counter--
    }
    mem.endTimer = mem.counter <= mem.maxTimer
  }
}
```

---

## 🎯 Critérios de Aceitação

- [ ] Parser converte linhas de texto em instruções
- [ ] Todos os operadores básicos funcionam (LD, ST, AND, OR)
- [ ] Acumulador gerencia estado corretamente
- [ ] Entradas e saídas são lidas/escritas
- [ ] Memórias booleanas (M) funcionam
- [ ] Testes unitários para cada operador
- [ ] Código TypeScript sem erros

---

## 🧪 Testes

Criar arquivo `src/core/__tests__/interpreter.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { executeCycle } from '../interpreter'

describe('Interpreter', () => {
  it('should execute LD and ST', () => {
    const inputs = { 'I0.0': true }
    const outputs = { 'Q0.0': false }
    const memory = new Map()
    const lines = ['LD I0.0', 'ST Q0.0']

    const result = executeCycle(lines, inputs, outputs, memory)
    expect(result['Q0.0']).toBe(true)
  })

  // Adicionar mais testes...
})
```

---

## 📝 Notas

- Focar primeiro nos operadores básicos (LD, ST, AND, OR)
- Timers e contadores virão no TICKET-03
- Manter lógica idêntica ao Java
- Usar Map para memoryVariables (melhor performance que objeto)

---

## 🔗 Referência

- Arquivo Java: `src/ilcompiler/interpreter/Interpreter.java`
- Linhas principais: 10-466
