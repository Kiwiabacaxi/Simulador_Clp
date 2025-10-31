/**
 * Gerenciador de Memória (M, T, C)
 * Funções para limpar, resetar e gerenciar variáveis de memória
 * Baseado em HomePageController.java linha 178-211
 */

import type { MemoryVariable } from './types'
import { stopTimer } from './timerManager'

/**
 * Limpa todos os timers ativos
 * Importante para evitar memory leaks
 *
 * Baseado em HomePageController.java linha 178-184
 *
 * @param memoryVariables Mapa de variáveis de memória
 */
export function cleanupAllTimers(memoryVariables: Map<string, MemoryVariable>): void {
  memoryVariables.forEach((mem) => {
    if (mem.timerHandle) {
      stopTimer(mem)
    }
  })
}

/**
 * Reseta todas as variáveis de memória para estado inicial
 * Usado quando o botão Refresh é clicado
 *
 * Baseado em HomePageController.java linha 186-211
 *
 * @param memoryVariables Mapa de variáveis de memória
 */
export function resetAllMemory(memoryVariables: Map<string, MemoryVariable>): void {
  memoryVariables.forEach((mem) => {
    // Reseta valores
    mem.currentValue = false
    mem.counter = 0
    mem.endTimer = mem.timerType === 'OFF' // TOFF começa com endTimer = true

    // Para timers
    stopTimer(mem)
  })
}

/**
 * Reseta apenas os timers
 *
 * Baseado em HomePageController.java linha 186-192
 *
 * @param memoryVariables Mapa de variáveis de memória
 */
export function resetTimers(memoryVariables: Map<string, MemoryVariable>): void {
  memoryVariables.forEach((mem) => {
    if (mem.timerType !== '') {
      mem.counter = 0
      mem.endTimer = mem.timerType === 'OFF'
      stopTimer(mem)
    }
  })
}

/**
 * Reseta apenas os contadores
 *
 * @param memoryVariables Mapa de variáveis de memória
 */
export function resetCounters(memoryVariables: Map<string, MemoryVariable>): void {
  memoryVariables.forEach((mem) => {
    if (mem.counterType !== '') {
      mem.counter = 0
      mem.endTimer = false
    }
  })
}

/**
 * Obtém todas as variáveis de um tipo específico
 *
 * @param memoryVariables Mapa de variáveis
 * @param type Tipo: 'M', 'T', ou 'C'
 * @returns Array de variáveis filtradas
 */
export function getVariablesByType(
  memoryVariables: Map<string, MemoryVariable>,
  type: 'M' | 'T' | 'C'
): MemoryVariable[] {
  const variables: MemoryVariable[] = []

  memoryVariables.forEach((mem) => {
    if (mem.id.startsWith(type)) {
      variables.push(mem)
    }
  })

  return variables.sort((a, b) => {
    // Ordena por número (M1, M2, M10 => ordem correta)
    const numA = parseInt(a.id.substring(1), 10)
    const numB = parseInt(b.id.substring(1), 10)
    return numA - numB
  })
}

/**
 * Conta quantas variáveis existem de cada tipo
 *
 * @param memoryVariables Mapa de variáveis
 * @returns Objeto com contadores
 */
export function countVariablesByType(
  memoryVariables: Map<string, MemoryVariable>
): { M: number; T: number; C: number } {
  const count = { M: 0, T: 0, C: 0 }

  memoryVariables.forEach((mem) => {
    const type = mem.id.charAt(0)
    if (type === 'M' || type === 'T' || type === 'C') {
      count[type]++
    }
  })

  return count
}

/**
 * Serializa variáveis de memória para JSON
 * Útil para debug e save/load
 *
 * @param memoryVariables Mapa de variáveis
 * @returns Array de objetos serializáveis
 */
export function serializeMemory(
  memoryVariables: Map<string, MemoryVariable>
): Array<Omit<MemoryVariable, 'timerHandle'>> {
  const serialized: Array<Omit<MemoryVariable, 'timerHandle'>> = []

  memoryVariables.forEach((mem) => {
    // Remove timerHandle (não serializável)
    const { timerHandle, ...rest } = mem
    serialized.push(rest)
  })

  return serialized
}

/**
 * Desserializa variáveis de memória de JSON
 *
 * @param data Array de variáveis serializadas
 * @returns Mapa de variáveis
 */
export function deserializeMemory(
  data: Array<Omit<MemoryVariable, 'timerHandle'>>
): Map<string, MemoryVariable> {
  const memory = new Map<string, MemoryVariable>()

  data.forEach((item) => {
    memory.set(item.id, {
      ...item,
      timerHandle: undefined, // Timers serão reiniciados quando necessário
    })
  })

  return memory
}
