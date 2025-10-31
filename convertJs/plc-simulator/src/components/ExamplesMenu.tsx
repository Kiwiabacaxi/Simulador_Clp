/**
 * Examples Menu - Carrega exemplos pré-definidos
 */

import { useState } from 'react'
import './ExamplesMenu.css'

export interface Example {
  id: string
  name: string
  description: string
  file: string
}

// Lista de exemplos disponíveis
const EXAMPLES: Example[] = [
  {
    id: '01',
    name: 'Básico - Entradas e Saídas',
    description: 'Exemplo simples de mapeamento I/O',
    file: '01-basico-entradas-saidas.json',
  },
  {
    id: '02',
    name: 'Lógica AND e OR',
    description: 'Demonstra operadores lógicos',
    file: '02-logica-AND-OR.json',
  },
  {
    id: '03',
    name: 'Timer TON',
    description: 'Timer ON Delay (3 segundos)',
    file: '03-timer-TON.json',
  },
  {
    id: '04',
    name: 'Timer TOFF',
    description: 'Timer OFF Delay (2 segundos)',
    file: '04-timer-TOFF.json',
  },
  {
    id: '05',
    name: 'Contador CTU',
    description: 'Counter Up (5 pulsos)',
    file: '05-contador-CTU.json',
  },
  {
    id: '06',
    name: 'Semáforo',
    description: 'Sistema de semáforo com timers',
    file: '06-semaforo.json',
  },
  {
    id: '07',
    name: 'Latch (Auto-retenção)',
    description: 'Circuito de auto-retenção',
    file: '07-latch-auto-retencao.json',
  },
  {
    id: '08',
    name: 'Timer + Contador Completo',
    description: 'Combinação de timer e contador',
    file: '08-timer-contador-completo.json',
  },
  {
    id: '09',
    name: 'Pisca-Pisca',
    description: 'LED piscando (TON + TOFF)',
    file: '09-pisca-pisca.json',
  },
  {
    id: '10',
    name: 'Portão Automático',
    description: 'Sistema completo de portão',
    file: '10-portao-automatico.json',
  },
]

interface ExamplesMenuProps {
  onLoadExample: (file: File) => void
  disabled?: boolean
}

export function ExamplesMenu({ onLoadExample, disabled = false }: ExamplesMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExampleClick = async (example: Example) => {
    try {
      // Busca o arquivo da pasta examples
      const response = await fetch(`/examples/${example.file}`)

      if (!response.ok) {
        throw new Error(`Falha ao carregar exemplo: ${response.statusText}`)
      }

      const text = await response.text()
      const blob = new Blob([text], { type: 'application/json' })
      const file = new File([blob], example.file, { type: 'application/json' })

      console.log(`📚 Carregando exemplo: ${example.name}`)
      onLoadExample(file)
      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao carregar exemplo:', error)
      alert(`Erro ao carregar exemplo: ${error instanceof Error ? error.message : 'erro desconhecido'}`)
    }
  }

  return (
    <div className="examples-menu">
      <button
        className="examples-button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        title="Carregar exemplo"
      >
        📚 Exemplos
      </button>

      {isOpen && (
        <div className="examples-dropdown">
          <div className="examples-header">
            <h3>Exemplos Disponíveis</h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="examples-list">
            {EXAMPLES.map((example) => (
              <div
                key={example.id}
                className="example-item"
                onClick={() => handleExampleClick(example)}
              >
                <div className="example-number">{example.id}</div>
                <div className="example-content">
                  <div className="example-name">{example.name}</div>
                  <div className="example-description">{example.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="examples-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
