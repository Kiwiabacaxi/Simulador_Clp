/**
 * Funções utilitárias para o interpretador
 * Baseado em Interpreter.java
 */

import { VALID_OPERATORS } from './constants'
import type { MemoryVariable } from './types'

/**
 * Verifica se um operador é válido
 * Baseado em Interpreter.java linha 103-112
 */
export function isValidOperator(operator: string): boolean {
  return VALID_OPERATORS.includes(operator as any)
}

/**
 * Verifica se uma variável é uma entrada (I)
 */
export function isInput(variable: string): boolean {
  return variable.startsWith('I')
}

/**
 * Verifica se uma variável é uma saída (Q)
 */
export function isOutput(variable: string): boolean {
  return variable.startsWith('Q')
}

/**
 * Verifica se uma variável é uma memória (M, T, C)
 */
export function isMemory(variable: string): boolean {
  const firstChar = variable.charAt(0)
  return firstChar === 'M' || firstChar === 'T' || firstChar === 'C'
}

/**
 * Obtém o tipo de memória (M, T, ou C)
 * Baseado em Interpreter.java linha 114-141
 */
export function getMemoryType(variable: string): 'M' | 'T' | 'C' | null {
  const firstChar = variable.charAt(0)

  if (firstChar === 'M' || firstChar === 'T' || firstChar === 'C') {
    // Extrair número para validar
    const numPart = variable.substring(1)
    const num = parseInt(numPart, 10)

    if (!isNaN(num) && num >= 0) {
      return firstChar as 'M' | 'T' | 'C'
    }
  }

  return null
}

/**
 * Cria uma nova variável de memória
 * Baseado em MemoryVariable.java linha 19-27
 */
export function createMemoryVariable(id: string): MemoryVariable {
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

/**
 * Valida formato de variável (I0.0, Q1.5, M1, T1, C1)
 */
export function isValidVariableFormat(variable: string): boolean {
  // I0.0 a I7.7
  if (/^I[0-7]\.[0-7]$/.test(variable)) return true
  // Q0.0 a Q7.7
  if (/^Q[0-7]\.[0-7]$/.test(variable)) return true
  // M1 a M999
  if (/^M\d+$/.test(variable)) return true
  // T1 a T99
  if (/^T\d+$/.test(variable)) return true
  // C1 a C99
  if (/^C\d+$/.test(variable)) return true
  // Números para preset
  if (/^\d+$/.test(variable)) return true

  return false
}

/**
 * Gera entradas padrão (I0.0 a I1.7)
 */
export function generateDefaultInputs(): Record<string, boolean> {
  const inputs: Record<string, boolean> = {}

  for (let byte = 0; byte <= 1; byte++) {
    for (let bit = 0; bit <= 7; bit++) {
      inputs[`I${byte}.${bit}`] = false
    }
  }

  return inputs
}

/**
 * Gera saídas padrão (Q0.0 a Q1.7)
 */
export function generateDefaultOutputs(): Record<string, boolean> {
  const outputs: Record<string, boolean> = {}

  for (let byte = 0; byte <= 1; byte++) {
    for (let bit = 0; bit <= 7; bit++) {
      outputs[`Q${byte}.${bit}`] = false
    }
  }

  return outputs
}
