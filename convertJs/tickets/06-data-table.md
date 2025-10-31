# TICKET-06: UI - Data Table ✅

**Status**: ✅ CONCLUÍDO
**Prioridade**: 🟡 MÉDIA
**Estimativa**: 1 dia
**Dependências**: TICKET-04
**Concluído em**: 2025-10-31

---

## 📋 Objetivo

Criar tabela de variáveis em tempo real similar ao Data Table do LogixPro.

---

## ✅ Tarefas

```typescript
interface DataTableProps {
  inputs: PLCInputs
  outputs: PLCOutputs
  memoryVariables: Map<string, MemoryVariable>
}

export function DataTable({ inputs, outputs, memoryVariables }: DataTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Variável</th>
          <th>Tipo</th>
          <th>Valor</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        {/* Renderizar todas as variáveis */}
      </tbody>
    </table>
  )
}
```

---

## 🎯 Critérios de Aceitação

- [x] Mostra todas as variáveis (I, Q, M, T, C)
- [x] Atualiza em tempo real
- [x] Filtro por tipo
- [x] Busca por nome
- [x] Estatísticas no header
- [x] Indicadores visuais (cores por tipo)
- [x] Info de timers/contadores (counter/preset)

---

## 🔗 Referência

- `src/screens/ListaDeVariaveisPg.java` (140 linhas)
