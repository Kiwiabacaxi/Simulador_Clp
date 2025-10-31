/**
 * Gerenciador de Timers (TON/TOFF)
 * Baseado em MemoryVariable.java linha 28-40
 */

import type { MemoryVariable } from './types'

/**
 * Intervalo de tick dos timers (100ms)
 * Cada incremento do counter = 100ms
 */
const TIMER_TICK_MS = 100

/**
 * Inicia um timer (TON ou TOFF)
 *
 * Para TON (Timer ON Delay):
 * - Timer conta quando currentValue = true
 * - endTimer ativa quando counter >= maxTimer
 *
 * Para TOFF (Timer OFF Delay):
 * - Timer conta quando currentValue = false
 * - endTimer desativa quando counter >= maxTimer
 *
 * Baseado em MemoryVariable.java linha 28-40
 *
 * @param memory Variável de memória do timer
 */
export function startTimer(memory: MemoryVariable): void {
  // Para timer anterior se existir
  if (memory.timerHandle) {
    clearInterval(memory.timerHandle)
  }

  // Reseta contador
  memory.counter = 0

  // Define estado inicial do endTimer
  memory.endTimer = memory.timerType === 'OFF'

  // Cria intervalo que incrementa counter a cada 100ms
  memory.timerHandle = setInterval(() => {
    if (memory.counter < memory.maxTimer) {
      memory.counter++
    }

    // Quando atinge o preset
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

/**
 * Para um timer
 *
 * @param memory Variável de memória do timer
 */
export function stopTimer(memory: MemoryVariable): void {
  if (memory.timerHandle) {
    clearInterval(memory.timerHandle)
    memory.timerHandle = undefined
  }
}

/**
 * Reseta um timer para estado inicial
 *
 * @param memory Variável de memória do timer
 */
export function resetTimer(memory: MemoryVariable): void {
  stopTimer(memory)
  memory.counter = 0
  memory.endTimer = memory.timerType === 'OFF'
}

/**
 * Atualiza estado dos timers baseado em currentValue
 * Deve ser chamado após cada ciclo do PLC
 *
 * Baseado em HomePageController.java linha 148-176
 *
 * @param memoryVariables Mapa de variáveis de memória
 * @param isRunning Se o PLC está rodando
 */
export function updateTimers(
  memoryVariables: Map<string, MemoryVariable>,
  isRunning: boolean
): void {
  if (!isRunning) {
    // Para todos os timers quando PLC para
    memoryVariables.forEach((mem) => {
      if (mem.timerType !== '') {
        stopTimer(mem)
      }
    })
    return
  }

  // Atualiza cada timer baseado no tipo e currentValue
  memoryVariables.forEach((mem) => {
    if (mem.timerType === '') return

    if (mem.timerType === 'ON') {
      // TON: Timer deve rodar quando currentValue = true
      if (mem.currentValue) {
        // Inicia timer se não estiver rodando
        if (!mem.timerHandle) {
          startTimer(mem)
        }
      } else {
        // Para e reseta quando currentValue = false
        stopTimer(mem)
        mem.counter = 0
        mem.endTimer = false
      }
    }

    if (mem.timerType === 'OFF') {
      // TOFF: Timer deve rodar quando currentValue = false
      if (mem.currentValue) {
        // Para timer e força endTimer = true
        stopTimer(mem)
        mem.counter = 0
        mem.endTimer = true
      } else {
        // Inicia timer quando currentValue = false
        if (!mem.timerHandle) {
          startTimer(mem)
        }
      }
    }
  })
}

/**
 * Para todos os timers (cleanup)
 *
 * @param memoryVariables Mapa de variáveis de memória
 */
export function stopAllTimers(memoryVariables: Map<string, MemoryVariable>): void {
  memoryVariables.forEach((mem) => {
    if (mem.timerHandle) {
      stopTimer(mem)
    }
  })
}
