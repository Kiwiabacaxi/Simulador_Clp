/**
 * Interpretador IL (Instruction List)
 * Port do Interpreter.java (466 linhas)
 */

import type { PLCInputs, PLCOutputs, MemoryVariable } from './types'
import { parseInstruction } from './parser'
import {
  isValidOperator,
  isInput,
  isOutput,
  getMemoryType,
  createMemoryVariable
} from './utils'

/**
 * Executa um ciclo completo do PLC
 * Baseado em Interpreter.java linha 32-100
 *
 * @param lines Array de linhas de código IL
 * @param inputs Entradas atuais
 * @param outputs Saídas do ciclo anterior
 * @param memoryVariables Variáveis de memória (M, T, C)
 * @returns Saídas atualizadas
 */
export function executeCycle(
  lines: string[],
  inputs: PLCInputs,
  outputs: PLCOutputs,
  memoryVariables: Map<string, MemoryVariable>
): PLCOutputs {
  // Acumulador local (limpa a cada ciclo)
  let accumulator: boolean | null = null

  // Itera todas as linhas
  for (const line of lines) {
    const instruction = parseInstruction(line)

    // Ignora linhas vazias
    if (!instruction) continue

    const { operator, variables } = instruction

    // Valida operador
    if (!isValidOperator(operator)) {
      console.error(`Operador inválido: ${operator}`)
      continue
    }

    // Executa instrução
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

/**
 * Executa uma única instrução
 * Baseado em Interpreter.java linha 178-465
 */
function executeInstruction(
  operator: string,
  variables: string[],
  inputs: PLCInputs,
  outputs: PLCOutputs,
  memoryVariables: Map<string, MemoryVariable>,
  accumulator: boolean | null
): { accumulator: boolean | null; outputs: PLCOutputs } {
  const variable = variables[0]

  // ========== LD - Load ==========
  // Baseado linha 185-193
  if (operator === 'LD') {
    if (isInput(variable)) {
      accumulator = inputs[variable] ?? false
    } else if (isOutput(variable)) {
      accumulator = outputs[variable] ?? false
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        // Para timers e contadores, usa endTimer (DN bit)
        accumulator = (type === 'T' || type === 'C') ? mem.endTimer : mem.currentValue
      } else {
        console.error(`Variável ${variable} não existe`)
        accumulator = false
      }
    }
  }

  // ========== LDN - Load Negado ==========
  // Baseado linha 196-204
  else if (operator === 'LDN') {
    if (isInput(variable)) {
      accumulator = !(inputs[variable] ?? false)
    } else if (isOutput(variable)) {
      accumulator = !(outputs[variable] ?? false)
    } else {
      const mem = memoryVariables.get(variable)
      if (mem) {
        const type = getMemoryType(variable)
        accumulator = (type === 'T' || type === 'C') ? !mem.endTimer : !mem.currentValue
      } else {
        console.error(`Variável ${variable} não existe`)
        accumulator = true
      }
    }
  }

  // Verifica se acumulador está carregado para operações seguintes
  if (accumulator === null && operator !== 'TON' && operator !== 'TOFF' && operator !== 'CTU' && operator !== 'CTD') {
    console.error('Acumulador vazio! Use LD ou LDN primeiro.')
    return { accumulator, outputs }
  }

  // ========== ST - Store ==========
  // Baseado linha 208-227
  if (operator === 'ST' && accumulator !== null) {
    if (isOutput(variable)) {
      outputs = { ...outputs, [variable]: accumulator }
    } else {
      // Memória
      let mem = memoryVariables.get(variable)
      if (!mem) {
        mem = createMemoryVariable(variable)
        memoryVariables.set(variable, mem)
      }

      // Lógica de contador (CTU/CTD) - ANTES de atualizar currentValue
      const type = getMemoryType(variable)
      if (type === 'C') {
        handleCounter(mem, accumulator)
      }

      // Atualiza currentValue depois do contador
      mem.currentValue = accumulator
    }
  }

  // ========== STN - Store Negado ==========
  // Baseado linha 218-227
  else if (operator === 'STN' && accumulator !== null) {
    if (isOutput(variable)) {
      outputs = { ...outputs, [variable]: !accumulator }
    } else {
      let mem = memoryVariables.get(variable)
      if (!mem) {
        mem = createMemoryVariable(variable)
        memoryVariables.set(variable, mem)
      }

      // Lógica de contador (CTU/CTD) - ANTES de atualizar currentValue
      const type = getMemoryType(variable)
      if (type === 'C') {
        handleCounter(mem, !accumulator)
      }

      // Atualiza currentValue depois do contador
      mem.currentValue = !accumulator
    }
  }

  // ========== AND ==========
  // Baseado linha 231-239
  else if (operator === 'AND' && accumulator !== null) {
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

  // ========== ANDN - AND Negado ==========
  // Baseado linha 243-251
  else if (operator === 'ANDN' && accumulator !== null) {
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

  // ========== OR ==========
  // Baseado linha 255-263
  else if (operator === 'OR' && accumulator !== null) {
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

  // ========== ORN - OR Negado ==========
  // Baseado linha 267-275
  else if (operator === 'ORN' && accumulator !== null) {
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

  // ========== TON - Timer ON Delay ==========
  // Baseado linha 327-333
  else if (operator === 'TON') {
    let mem = memoryVariables.get(variable)
    if (!mem) {
      mem = createMemoryVariable(variable)
      memoryVariables.set(variable, mem)
    }
    const type = getMemoryType(variable)
    if (type === 'T') {
      mem.timerType = 'ON'
      mem.maxTimer = parseInt(variables[1], 10)
    } else {
      console.error(`${variable} não é um timer válido`)
    }
  }

  // ========== TOFF - Timer OFF Delay ==========
  // Baseado linha 335-341
  else if (operator === 'TOFF') {
    let mem = memoryVariables.get(variable)
    if (!mem) {
      mem = createMemoryVariable(variable)
      memoryVariables.set(variable, mem)
    }
    const type = getMemoryType(variable)
    if (type === 'T') {
      mem.timerType = 'OFF'
      mem.maxTimer = parseInt(variables[1], 10)
    } else {
      console.error(`${variable} não é um timer válido`)
    }
  }

  // ========== CTU - Counter Up ==========
  // Baseado linha 351-357
  else if (operator === 'CTU') {
    let mem = memoryVariables.get(variable)
    if (!mem) {
      mem = createMemoryVariable(variable)
      memoryVariables.set(variable, mem)
    }
    const type = getMemoryType(variable)
    if (type === 'C') {
      mem.counterType = 'UP'
      mem.maxTimer = parseInt(variables[1], 10) // maxTimer = preset
    } else {
      console.error(`${variable} não é um contador válido`)
    }
  }

  // ========== CTD - Counter Down ==========
  // Baseado linha 343-349
  else if (operator === 'CTD') {
    let mem = memoryVariables.get(variable)
    if (!mem) {
      mem = createMemoryVariable(variable)
      memoryVariables.set(variable, mem)
    }
    const type = getMemoryType(variable)
    if (type === 'C') {
      mem.counterType = 'DOWN'
      mem.maxTimer = parseInt(variables[1], 10)
    } else {
      console.error(`${variable} não é um contador válido`)
    }
  }

  return { accumulator, outputs }
}

/**
 * Gerencia contador (CTU/CTD)
 * Detecta rising edge e incrementa/decrementa
 * Baseado em Interpreter.java linha 296-325
 */
function handleCounter(mem: MemoryVariable, currentValue: boolean): void {
  if (mem.counterType === 'UP') {
    // Rising edge detection: oldValue = false, newValue = true
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
