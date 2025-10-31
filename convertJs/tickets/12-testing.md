# TICKET-12: Testes & Refinamentos

**Status**: 🔴 TODO
**Prioridade**: 🟢 BAIXA
**Estimativa**: 2-3 dias
**Dependências**: TICKET-02 a TICKET-11

---

## 📋 Objetivo

Criar testes unitários e E2E, validações de sintaxe e refinamentos finais.

---

## ✅ Tarefas

### 1. Testes Unitários (Vitest)

```typescript
// src/core/__tests__/interpreter.test.ts
import { describe, it, expect } from 'vitest'
import { executeCycle } from '../interpreter'

describe('PLC Interpreter', () => {
  describe('Basic Operations', () => {
    it('LD and ST should work', () => {
      // Test implementation
    })

    it('AND operation should work', () => {
      // Test implementation
    })

    it('OR operation should work', () => {
      // Test implementation
    })

    it('negated operations should work', () => {
      // Test implementation
    })
  })

  describe('Memory Variables', () => {
    it('should create memory variable', () => {
      // Test implementation
    })

    it('should read memory variable', () => {
      // Test implementation
    })
  })

  describe('Timers', () => {
    it('TON should activate after delay', async () => {
      // Test implementation
    })

    it('TOFF should deactivate after delay', async () => {
      // Test implementation
    })
  })

  describe('Counters', () => {
    it('CTU should count up', () => {
      // Test implementation
    })

    it('CTD should count down', () => {
      // Test implementation
    })
  })
})
```

### 2. Testes E2E (Playwright)

```typescript
// e2e/plc-simulator.spec.ts
import { test, expect } from '@playwright/test'

test.describe('PLC Simulator', () => {
  test('should load application', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Simulador CLP')
  })

  test('should execute simple program', async ({ page }) => {
    await page.goto('/')

    // Digite código
    await page.fill('textarea', 'LD I0.0\nST Q0.0')

    // Clique Start
    await page.click('button:has-text("Start")')

    // Clique entrada I0.0
    await page.click('[data-input="I0.0"]')

    // Verifique saída Q0.0
    await expect(page.locator('[data-output="Q0.0"]')).toHaveClass(/active/)
  })

  test('should save and load program', async ({ page }) => {
    // Test implementation
  })
})
```

### 3. Validação de Sintaxe

```typescript
// src/core/validator.ts

export interface ValidationError {
  line: number
  message: string
  type: 'error' | 'warning'
}

export function validateCode(code: string): ValidationError[] {
  const errors: ValidationError[] = []
  const lines = code.split('\n')

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (trimmed === '') return

    const instruction = parseInstruction(trimmed)
    if (!instruction) {
      errors.push({
        line: index + 1,
        message: 'Sintaxe inválida',
        type: 'error',
      })
      return
    }

    const { operator, variables } = instruction

    // Validar operador
    if (!isValidOperator(operator)) {
      errors.push({
        line: index + 1,
        message: `Operador '${operator}' não existe`,
        type: 'error',
      })
    }

    // Validar variáveis
    if (variables.length === 0) {
      errors.push({
        line: index + 1,
        message: 'Operador requer pelo menos uma variável',
        type: 'error',
      })
    }

    // Validar formato de variável (I0.0, Q1.5, M1, T1, C1)
    variables.forEach((v) => {
      if (!isValidVariableFormat(v)) {
        errors.push({
          line: index + 1,
          message: `Variável '${v}' tem formato inválido`,
          type: 'error',
        })
      }
    })
  })

  return errors
}

function isValidVariableFormat(variable: string): boolean {
  // I0.0 a I7.7
  if (/^I[0-7]\.[0-7]$/.test(variable)) return true
  // Q0.0 a Q7.7
  if (/^Q[0-7]\.[0-7]$/.test(variable)) return true
  // M1 a M999
  if (/^M\d+$/.test(variable)) return true
  // T1 a T99
  if (/^T\d+$/.test(variable)) return true
  // C1 a C99
  if (/^C\d+$/.test(variable)) return true
  // Números para preset
  if (/^\d+$/.test(variable)) return true

  return false
}
```

### 4. CodeEditor com validação em tempo real

```typescript
// src/components/CodeEditor.tsx (atualizado)
import { useState, useEffect } from 'react'
import { validateCode, ValidationError } from '../core/validator'

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const [errors, setErrors] = useState<ValidationError[]>([])

  useEffect(() => {
    const validationErrors = validateCode(value)
    setErrors(validationErrors)
  }, [value])

  return (
    <div className="code-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className={errors.length > 0 ? 'has-errors' : ''}
      />
      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((error, i) => (
            <div key={i} className={`error ${error.type}`}>
              Linha {error.line}: {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 5. Refinamentos

- [ ] Performance: debounce no código
- [ ] UX: Loading states
- [ ] Mensagens de erro em português
- [ ] Ajuda contextual (tooltip)
- [ ] Atalhos de teclado
- [ ] Dark mode (opcional)

---

## 🎯 Critérios de Aceitação

- [ ] Testes unitários cobrem 80%+ do core
- [ ] Testes E2E cobrem fluxos principais
- [ ] Validação de sintaxe funciona
- [ ] Erros mostrados na interface
- [ ] Performance otimizada
- [ ] Bugs conhecidos corrigidos

---

## 📝 Notas

- Usar `vitest` para testes rápidos
- Playwright para E2E
- CI pode rodar testes automaticamente

---

## 🔗 Links Úteis

- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
