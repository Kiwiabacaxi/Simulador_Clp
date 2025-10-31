/**
 * Tipos TypeScript para o Simulador CLP
 * Baseado nos tipos Java originais
 */

/**
 * Tipo de entrada física
 */
export type InputType = 'BUTTON' | 'SWITCH' | 'SENSOR'

/**
 * Mapa de entradas digitais (I0.0, I0.1, etc)
 */
export interface PLCInputs {
  [key: string]: boolean
}

/**
 * Mapa de saídas digitais (Q0.0, Q0.1, etc)
 */
export interface PLCOutputs {
  [key: string]: boolean
}

/**
 * Variável de memória (M, T, C)
 * Baseado em MemoryVariable.java
 */
export interface MemoryVariable {
  id: string                    // M1, T1, C1, etc
  currentValue: boolean         // Valor atual da variável
  endTimer: boolean             // Flag DN (Done) para timers/contadores
  counter: number               // Acumulador (Accum)
  maxTimer: number              // Preset value
  timerType: 'ON' | 'OFF' | ''  // TON ou TOFF
  counterType: 'UP' | 'DOWN' | '' // CTU ou CTD
  timerHandle?: NodeJS.Timeout  // Handle do setInterval
}

/**
 * Estado completo do PLC
 */
export interface PLCState {
  inputs: PLCInputs
  outputs: PLCOutputs
  memoryVariables: Map<string, MemoryVariable>
  accumulator: boolean | null   // Acumulador do interpretador
}

/**
 * Instrução parseada (operador + variáveis)
 */
export interface ParsedInstruction {
  operator: string
  variables: string[]
}

/**
 * Modo de execução do PLC
 */
export enum ExecutionMode {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

/**
 * Formato de arquivo JSON para save/load
 */
export interface SaveFile {
  version: '1.0'
  metadata: {
    name: string
    description: string
    createdAt: string
    author?: string
  }
  code: string
  inputs?: PLCInputs
  outputs?: PLCOutputs
}
