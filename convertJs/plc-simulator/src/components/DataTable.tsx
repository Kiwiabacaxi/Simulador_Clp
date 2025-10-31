/**
 * Tabela de Variáveis em Tempo Real
 * Baseado em ListaDeVariaveisPg.java
 */

import { useState, useMemo } from 'react'
import type { PLCInputs, PLCOutputs, MemoryVariable } from '../core/types'
import './DataTable.css'

interface DataTableProps {
  inputs: PLCInputs
  outputs: PLCOutputs
  memoryVariables: Map<string, MemoryVariable>
}

type VariableType = 'ALL' | 'I' | 'Q' | 'M' | 'T' | 'C'

interface TableRow {
  id: string
  type: VariableType
  value: boolean | number
  info?: string
}

export function DataTable({ inputs, outputs, memoryVariables }: DataTableProps) {
  const [filter, setFilter] = useState<VariableType>('ALL')
  const [search, setSearch] = useState('')

  // Converte todas as variáveis para linhas da tabela
  const allRows = useMemo(() => {
    const rows: TableRow[] = []

    // Inputs
    Object.entries(inputs).forEach(([key, value]) => {
      rows.push({
        id: key,
        type: 'I',
        value,
        info: value ? 'ON' : 'OFF'
      })
    })

    // Outputs
    Object.entries(outputs).forEach(([key, value]) => {
      rows.push({
        id: key,
        type: 'Q',
        value,
        info: value ? 'ON' : 'OFF'
      })
    })

    // Memory Variables (M, T, C)
    memoryVariables.forEach((mem) => {
      const firstChar = mem.id.charAt(0) as VariableType

      if (firstChar === 'M') {
        rows.push({
          id: mem.id,
          type: 'M',
          value: mem.currentValue,
          info: mem.currentValue ? 'ON' : 'OFF'
        })
      } else if (firstChar === 'T') {
        const progress = mem.maxTimer > 0
          ? Math.round((mem.counter / mem.maxTimer) * 100)
          : 0
        rows.push({
          id: mem.id,
          type: 'T',
          value: mem.endTimer,
          info: `${mem.counter}/${mem.maxTimer} (${progress}%) ${mem.timerType}`
        })
      } else if (firstChar === 'C') {
        rows.push({
          id: mem.id,
          type: 'C',
          value: mem.endTimer,
          info: `${mem.counter}/${mem.maxTimer} ${mem.counterType}`
        })
      }
    })

    // Ordena por tipo e depois por ID
    return rows.sort((a, b) => {
      if (a.type !== b.type) {
        const order = ['I', 'Q', 'M', 'T', 'C']
        return order.indexOf(a.type) - order.indexOf(b.type)
      }
      return a.id.localeCompare(b.id, undefined, { numeric: true })
    })
  }, [inputs, outputs, memoryVariables])

  // Filtra linhas
  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      // Filtro por tipo
      if (filter !== 'ALL' && row.type !== filter) {
        return false
      }

      // Busca por nome
      if (search && !row.id.toLowerCase().includes(search.toLowerCase())) {
        return false
      }

      return true
    })
  }, [allRows, filter, search])

  // Estatísticas
  const stats = useMemo(() => {
    const inputsOn = Object.values(inputs).filter(Boolean).length
    const outputsOn = Object.values(outputs).filter(Boolean).length
    const memoryCount = Array.from(memoryVariables.values()).filter(
      (m) => m.id.startsWith('M')
    ).length
    const timersCount = Array.from(memoryVariables.values()).filter(
      (m) => m.id.startsWith('T')
    ).length
    const countersCount = Array.from(memoryVariables.values()).filter(
      (m) => m.id.startsWith('C')
    ).length

    return {
      inputs: `${inputsOn}/${Object.keys(inputs).length}`,
      outputs: `${outputsOn}/${Object.keys(outputs).length}`,
      memory: memoryCount,
      timers: timersCount,
      counters: countersCount
    }
  }, [inputs, outputs, memoryVariables])

  return (
    <div className="data-table-container">
      <div className="data-table-header">
        <h3>📊 Tabela de Variáveis</h3>
        <div className="table-stats">
          <span className="stat">I: {stats.inputs}</span>
          <span className="stat">Q: {stats.outputs}</span>
          <span className="stat">M: {stats.memory}</span>
          <span className="stat">T: {stats.timers}</span>
          <span className="stat">C: {stats.counters}</span>
        </div>
      </div>

      <div className="data-table-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Todas
          </button>
          <button
            className={`filter-btn ${filter === 'I' ? 'active' : ''}`}
            onClick={() => setFilter('I')}
          >
            Entradas
          </button>
          <button
            className={`filter-btn ${filter === 'Q' ? 'active' : ''}`}
            onClick={() => setFilter('Q')}
          >
            Saídas
          </button>
          <button
            className={`filter-btn ${filter === 'M' ? 'active' : ''}`}
            onClick={() => setFilter('M')}
          >
            Memória
          </button>
          <button
            className={`filter-btn ${filter === 'T' ? 'active' : ''}`}
            onClick={() => setFilter('T')}
          >
            Timers
          </button>
          <button
            className={`filter-btn ${filter === 'C' ? 'active' : ''}`}
            onClick={() => setFilter('C')}
          >
            Contadores
          </button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar variável..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Variável</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Informação</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-data">
                  {search ? 'Nenhuma variável encontrada' : 'Nenhuma variável'}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id} className={`row-type-${row.type}`}>
                  <td className="var-id">{row.id}</td>
                  <td className="var-type">
                    <span className={`type-badge type-${row.type}`}>
                      {row.type === 'I' && 'Input'}
                      {row.type === 'Q' && 'Output'}
                      {row.type === 'M' && 'Memory'}
                      {row.type === 'T' && 'Timer'}
                      {row.type === 'C' && 'Counter'}
                    </span>
                  </td>
                  <td className="var-value">
                    <span className={`value-indicator ${typeof row.value === 'boolean' && row.value ? 'on' : 'off'}`}>
                      {typeof row.value === 'boolean'
                        ? (row.value ? '1' : '0')
                        : row.value
                      }
                    </span>
                  </td>
                  <td className="var-info">{row.info}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="data-table-footer">
        <span>Total: {filteredRows.length} variáveis</span>
      </div>
    </div>
  )
}
