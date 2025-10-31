/**
 * Hook React para gerenciar atualização de timers
 * Baseado em HomePageController.java linha 148-176
 */

import { useEffect } from 'react'
import type { MemoryVariable } from '../core/types'
import { updateTimers, stopAllTimers } from '../core/timerManager'

/**
 * Hook que atualiza timers baseado no estado de execução do PLC
 * Deve ser chamado no componente principal que gerencia o ciclo do PLC
 *
 * @param memoryVariables Mapa de variáveis de memória
 * @param isRunning Se o PLC está executando
 */
export function useTimerUpdate(
  memoryVariables: Map<string, MemoryVariable>,
  isRunning: boolean
): void {
  useEffect(() => {
    // Atualiza timers sempre que isRunning ou memoryVariables mudar
    updateTimers(memoryVariables, isRunning)

    // Cleanup: para todos os timers quando componente desmontar
    return () => {
      stopAllTimers(memoryVariables)
    }
  }, [memoryVariables, isRunning])
}

/**
 * Hook alternativo que permite controle manual do ciclo de atualização
 * Útil para testes e debug
 *
 * @param memoryVariables Mapa de variáveis de memória
 * @param isRunning Se o PLC está executando
 * @param cycleDelay Delay entre atualizações (padrão: 100ms)
 * @returns Função para forçar atualização manual
 */
export function useTimerUpdateWithInterval(
  memoryVariables: Map<string, MemoryVariable>,
  isRunning: boolean,
  cycleDelay: number = 100
): () => void {
  useEffect(() => {
    let intervalHandle: NodeJS.Timeout | undefined

    if (isRunning) {
      // Cria intervalo que atualiza timers a cada ciclo
      intervalHandle = setInterval(() => {
        updateTimers(memoryVariables, isRunning)
      }, cycleDelay)
    }

    // Cleanup
    return () => {
      if (intervalHandle) {
        clearInterval(intervalHandle)
      }
      stopAllTimers(memoryVariables)
    }
  }, [memoryVariables, isRunning, cycleDelay])

  // Retorna função para forçar atualização manual
  return () => {
    updateTimers(memoryVariables, isRunning)
  }
}

/**
 * Hook que gerencia limpeza de timers no unmount
 * Útil para componentes que só precisam garantir cleanup
 *
 * @param memoryVariables Mapa de variáveis de memória
 */
export function useTimerCleanup(
  memoryVariables: Map<string, MemoryVariable>
): void {
  useEffect(() => {
    return () => {
      stopAllTimers(memoryVariables)
    }
  }, [memoryVariables])
}
