/**
 * Operadores válidos do Instruction List (IL)
 * Baseado em Interpreter.java linha 17-30
 */
export const VALID_OPERATORS = [
  'LD',    // Load - Carrega valor para acumulador
  'LDN',   // Load Negado
  'ST',    // Store - Armazena acumulador
  'STN',   // Store Negado
  'AND',   // AND lógico
  'ANDN',  // AND Negado
  'OR',    // OR lógico
  'ORN',   // OR Negado
  'TON',   // Timer ON Delay
  'TOFF',  // Timer OFF Delay
  'CTD',   // Counter Down
  'CTU',   // Counter Up
] as const

/**
 * Tipo para operadores (união literal dos valores válidos)
 */
export type Operator = typeof VALID_OPERATORS[number]

/**
 * Delay padrão do ciclo PLC em milissegundos
 * Baseado em HomePageController.java
 */
export const CYCLE_DELAY_MS = 100

/**
 * Tick do timer em milissegundos
 * Cada incremento do contador = 100ms
 */
export const TIMER_TICK_MS = 100
