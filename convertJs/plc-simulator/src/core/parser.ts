/**
 * Parser de instruções IL (Instruction List)
 * Baseado em Interpreter.java linha 32-93
 */

import type { ParsedInstruction } from './types'

/**
 * Faz parse de uma linha de código IL
 * Retorna operador e lista de variáveis
 *
 * Exemplos:
 * - "LD I0.0" → { operator: "LD", variables: ["I0.0"] }
 * - "TON T1,30" → { operator: "TON", variables: ["T1", "30"] }
 * - "   " → null (linha vazia)
 *
 * @param line Linha de código IL
 * @returns Instrução parseada ou null se linha vazia
 */
export function parseInstruction(line: string): ParsedInstruction | null {
  // Remove espaços extras e quebras de linha
  const cleaned = line.trim()

  // Ignora linhas vazias
  if (cleaned === '') {
    return null
  }

  let operator = ''
  let variable = ''
  const variables: string[] = []
  let spaceDetected = false

  // Itera caracteres da linha
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]

    // Construir operador (antes do espaço)
    if (char !== ' ' && char !== '\t' && char !== ',' && !spaceDetected) {
      operator += char
    }

    // Detectar espaço após operador
    if ((char === ' ' || char === '\t') && operator !== '') {
      spaceDetected = true
    }

    // Vírgula separa variáveis múltiplas (ex: TON T1,30)
    if (char === ',' && operator !== '') {
      if (variable !== '') {
        variables.push(variable)
        variable = ''
      }
    }

    // Construir variável (depois do espaço)
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

/**
 * Faz parse de múltiplas linhas
 *
 * @param code Código IL completo
 * @returns Array de instruções parseadas (ignora linhas vazias)
 */
export function parseCode(code: string): ParsedInstruction[] {
  const lines = code.split('\n')
  const instructions: ParsedInstruction[] = []

  for (const line of lines) {
    const instruction = parseInstruction(line)
    if (instruction) {
      instructions.push(instruction)
    }
  }

  return instructions
}
