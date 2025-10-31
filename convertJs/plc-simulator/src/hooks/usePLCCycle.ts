/**
 * Hook para gerenciar o ciclo completo do PLC
 * Baseado em HomePageController.java
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  executeCycle,
  generateDefaultInputs,
  generateDefaultOutputs,
  updateTimers,
  resetAllMemory,
  type PLCInputs,
  type PLCOutputs,
  type MemoryVariable,
  CYCLE_DELAY_MS
} from '../core'

export function usePLCCycle(code: string) {
  const [inputs, setInputs] = useState<PLCInputs>(generateDefaultInputs())
  const [outputs, setOutputs] = useState<PLCOutputs>(generateDefaultOutputs())
  const [memory] = useState(() => new Map<string, MemoryVariable>())
  const [isRunning, setIsRunning] = useState(false)

  // Ref para armazenar o interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Atualiza uma entrada
  const updateInput = useCallback((key: string, value: boolean) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  // Executa um ciclo do PLC
  const runCycle = useCallback(() => {
    if (!code.trim()) {
      return
    }

    try {
      const lines = code.split('\n')
      const newOutputs = executeCycle(lines, inputs, outputs, memory)
      setOutputs(newOutputs)

      // Atualiza timers
      updateTimers(memory, true)
    } catch (error) {
      console.error('Erro ao executar ciclo:', error)
    }
  }, [code, inputs, outputs, memory])

  // Inicia a execução
  const start = useCallback(() => {
    if (isRunning) return

    console.log('▶ PLC Iniciado')
    setIsRunning(true)

    // Executa primeiro ciclo imediatamente
    runCycle()

    // Cria intervalo para ciclos subsequentes
    intervalRef.current = setInterval(() => {
      runCycle()
    }, CYCLE_DELAY_MS)
  }, [isRunning, runCycle])

  // Para a execução
  const stop = useCallback(() => {
    if (!isRunning) return

    console.log('⏸ PLC Parado')
    setIsRunning(false)

    // Limpa intervalo
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Para todos os timers
    updateTimers(memory, false)
  }, [isRunning, memory])

  // Reseta toda a memória
  const refresh = useCallback(() => {
    console.log('🔄 Memória Resetada')

    // Para execução se estiver rodando
    if (isRunning) {
      stop()
    }

    // Reseta tudo
    resetAllMemory(memory)
    setInputs(generateDefaultInputs())
    setOutputs(generateDefaultOutputs())
  }, [isRunning, memory, stop])

  // Cleanup quando componente desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // Para todos os timers
      updateTimers(memory, false)
    }
  }, [memory])

  return {
    inputs,
    outputs,
    memory,
    isRunning,
    updateInput,
    start,
    stop,
    refresh,
  }
}
