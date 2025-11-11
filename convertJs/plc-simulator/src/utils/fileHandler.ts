/**
 * File Handler - Gerencia save/load de programas PLC
 * Versão WEB (usa download/upload de arquivos via browser)
 */

import type { MemoryVariable } from '../core'

// Tipos de cena disponíveis
export type SceneType = 'default' | 'batch' | 'gate' | 'traffic-light' | 'conveyor'

// Interface do arquivo salvo
export interface SaveFile {
  version: '1.0'
  metadata: {
    name: string
    description: string
    createdAt: string
    updatedAt?: string
    scene?: SceneType  // Cena recomendada para este programa
    instructions?: string  // Instruções de uso
  }
  code: string
  memory?: Record<string, any>
}

// Versões suportadas
const SUPPORTED_VERSIONS = ['1.0']
const CURRENT_VERSION = '1.0'

/**
 * Valida se o arquivo tem formato correto
 */
export function validateSaveFile(data: any): data is SaveFile {
  // Verifica campos obrigatórios
  if (!data || typeof data !== 'object') {
    throw new Error('Arquivo inválido: não é um objeto JSON')
  }

  if (!data.version) {
    throw new Error('Arquivo inválido: campo "version" ausente')
  }

  if (!SUPPORTED_VERSIONS.includes(data.version)) {
    throw new Error(
      `Versão "${data.version}" não suportada. Versões aceitas: ${SUPPORTED_VERSIONS.join(', ')}`
    )
  }

  if (!data.metadata || typeof data.metadata !== 'object') {
    throw new Error('Arquivo inválido: campo "metadata" ausente ou inválido')
  }

  if (typeof data.code !== 'string') {
    throw new Error('Arquivo inválido: campo "code" ausente ou não é string')
  }

  return true
}

/**
 * Salva programa como arquivo JSON (download)
 */
export function saveProgram(
  code: string,
  memory: Map<string, MemoryVariable>,
  filename?: string
): void {
  try {
    // Serializa memória
    const memoryData: Record<string, any> = {}
    memory.forEach((value: MemoryVariable, key: string) => {
      memoryData[key] = {
        id: value.id,
        currentValue: value.currentValue,
        endTimer: value.endTimer,
        counter: value.counter,
        maxTimer: value.maxTimer,
        timerType: value.timerType,
      }
    })

    const data: SaveFile = {
      version: CURRENT_VERSION,
      metadata: {
        name: filename || 'Programa PLC',
        description: 'Programa exportado do Simulador CLP',
        createdAt: new Date().toISOString(),
      },
      code,
      memory: memoryData,
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${filename || 'plc-program'}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('💾 Arquivo salvo:', a.download)
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error)
    throw new Error(
      `Falha ao salvar arquivo: ${error instanceof Error ? error.message : 'erro desconhecido'}`
    )
  }
}

/**
 * Carrega programa de arquivo JSON (upload)
 */
export async function loadProgram(file: File): Promise<SaveFile> {
  try {
    // Verifica se é JSON
    if (!file.name.endsWith('.json')) {
      throw new Error('Arquivo deve ter extensão .json')
    }

    // Lê conteúdo
    const text = await file.text()
    const data = JSON.parse(text)

    // Valida estrutura
    validateSaveFile(data)

    console.log('📂 Arquivo carregado:', file.name)
    console.log('   Versão:', data.version)
    console.log('   Nome:', data.metadata.name)
    console.log('   Criado em:', new Date(data.metadata.createdAt).toLocaleString())

    return data
  } catch (error) {
    console.error('Erro ao carregar arquivo:', error)

    if (error instanceof SyntaxError) {
      throw new Error('Arquivo JSON mal formatado. Verifique a sintaxe.')
    }

    throw error
  }
}

/**
 * Abre dialog de seleção de arquivo
 */
export function openFileDialog(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      resolve(file || null)
    }

    input.oncancel = () => {
      resolve(null)
    }

    input.click()
  })
}

/**
 * Carrega programa via dialog de arquivo
 */
export async function loadProgramDialog(): Promise<SaveFile | null> {
  const file = await openFileDialog()

  if (!file) {
    console.log('📂 Carregamento cancelado')
    return null
  }

  return loadProgram(file)
}

/**
 * Salva última sessão no LocalStorage (auto-save)
 */
export function saveToLocalStorage(code: string, memory: Map<string, MemoryVariable>): void {
  try {
    const memoryData: Record<string, any> = {}
    memory.forEach((value: MemoryVariable, key: string) => {
      memoryData[key] = {
        id: value.id,
        currentValue: value.currentValue,
        endTimer: value.endTimer,
        counter: value.counter,
        maxTimer: value.maxTimer,
        timerType: value.timerType,
      }
    })

    const sessionData = {
      code,
      memory: memoryData,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem('plc-simulator-session', JSON.stringify(sessionData))
    console.log('💾 Sessão auto-salva no LocalStorage')
  } catch (error) {
    console.warn('Falha ao salvar no LocalStorage:', error)
  }
}

/**
 * Carrega última sessão do LocalStorage
 */
export function loadFromLocalStorage(): { code: string; memory: Record<string, any> } | null {
  try {
    const data = localStorage.getItem('plc-simulator-session')
    if (!data) return null

    const parsed = JSON.parse(data)
    console.log('📂 Sessão carregada do LocalStorage')
    console.log('   Timestamp:', new Date(parsed.timestamp).toLocaleString())

    return {
      code: parsed.code || '',
      memory: parsed.memory || {},
    }
  } catch (error) {
    console.warn('Falha ao carregar do LocalStorage:', error)
    return null
  }
}

/**
 * Limpa sessão do LocalStorage
 */
export function clearLocalStorage(): void {
  localStorage.removeItem('plc-simulator-session')
  console.log('🗑️ Sessão do LocalStorage removida')
}
