# TICKET-06: UI - Data Table

**Status**: 🔴 TODO
**Prioridade**: 🟡 MÉDIA
**Estimativa**: 1 dia
**Dependências**: TICKET-04

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

- [ ] Mostra todas as variáveis (I, Q, M, T, C)
- [ ] Atualiza em tempo real
- [ ] Filtro por tipo
- [ ] Busca por nome

---

## 🔗 Referência

- `src/screens/ListaDeVariaveisPg.java` (140 linhas)
