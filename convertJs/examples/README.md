# 📚 Exemplos de Programas IL

Estes são exemplos de programas em **Instruction List (IL)** para o Simulador CLP, convertidos do formato original `.txt` para `.json`.

---

## 📄 Arquivos

### 1. [example1-simple.json](./example1-simple.json)
**Nível**: Iniciante
**Conceitos**: LD, ST, AND, OR, ANDN, ORN, LDN

**Descrição**: Programa básico demonstrando operações lógicas fundamentais. Usa entradas (I), saídas (Q) e operações booleanas.

**Entradas usadas**: I0.0, I0.1, I1.0, I1.1
**Saídas usadas**: Q0.1, Q0.3, Q0.5, Q1.0, Q1.1, Q1.2

---

### 2. [example2-timer.json](./example2-timer.json)
**Nível**: Intermediário
**Conceitos**: TON (Timer ON Delay), Timers encadeados

**Descrição**: Programa com temporizadores. Demonstra como usar `TON` para criar delays programáveis. Timer T1 ativa após 30 * 100ms = 3 segundos, e T2 após 50 * 100ms = 5 segundos.

**Entradas usadas**: I0.0, I0.1, I1.0, I1.1
**Saídas usadas**: Q0.1, Q0.2, Q0.3, Q0.5, Q1.0, Q1.1, Q1.2
**Timers usados**: T1 (preset: 30), T2 (preset: 50)

---

### 3. [example3-counter.json](./example3-counter.json)
**Nível**: Avançado
**Conceitos**: CTU (Count Up), Timers + Contadores

**Descrição**: Programa completo com contador e temporizadores. O contador C1 conta até 3 eventos (rising edges) e os timers controlam sequências temporais.

**Entradas usadas**: I0.0, I0.1, I1.0, I1.1
**Saídas usadas**: Q0.1, Q0.2, Q0.3, Q0.5, Q1.0, Q1.1, Q1.2
**Timers usados**: T1 (preset: 30), T2 (preset: 50)
**Contadores usados**: C1 (preset: 3)

---

## 🔧 Como Usar

### No Simulador TypeScript:

```typescript
import example1 from './examples/example1-simple.json'

// Carregar no editor
setCode(example1.code)

// Ou programaticamente
const saveFile: SaveFile = example1
loadProgram(saveFile)
```

### Formato do JSON:

```json
{
  "version": "1.0",
  "metadata": {
    "name": "Nome do programa",
    "description": "Descrição breve",
    "createdAt": "2025-10-31T00:00:00.000Z",
    "author": "Autor"
  },
  "code": "LD I0.0\nST Q0.0\n..."
}
```

---

## 📖 Referência Rápida

### Operadores

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| **LD** | Load (carrega valor para acumulador) | `LD I0.0` |
| **LDN** | Load Negado | `LDN I0.1` |
| **ST** | Store (armazena acumulador) | `ST Q0.0` |
| **STN** | Store Negado | `STN Q0.1` |
| **AND** | AND lógico | `AND I0.2` |
| **ANDN** | AND Negado | `ANDN I1.0` |
| **OR** | OR lógico | `OR Q0.5` |
| **ORN** | OR Negado | `ORN I0.3` |
| **TON** | Timer ON Delay | `TON T1,30` |
| **TOFF** | Timer OFF Delay | `TOFF T2,50` |
| **CTU** | Counter Up | `CTU C1,5` |
| **CTD** | Counter Down | `CTD C2,10` |

### Variáveis

| Tipo | Formato | Exemplo | Descrição |
|------|---------|---------|-----------|
| **Entrada** | I[byte].[bit] | I0.0 a I7.7 | Entradas físicas |
| **Saída** | Q[byte].[bit] | Q0.0 a Q7.7 | Saídas físicas |
| **Memória** | M[número] | M1, M2... | Memória booleana |
| **Timer** | T[número] | T1, T2... | Temporizador |
| **Contador** | C[número] | C1, C2... | Contador |

---

## 🎓 Aprendendo IL

### Exemplo Mínimo:

```
LD I0.0    ; Carrega entrada I0.0 para acumulador
ST Q0.0    ; Armazena acumulador na saída Q0.0
```

**Resultado**: Q0.0 = I0.0 (copia entrada para saída)

### Com Lógica AND:

```
LD I0.0    ; Acumulador = I0.0
AND I0.1   ; Acumulador = I0.0 AND I0.1
ST Q0.0    ; Q0.0 = (I0.0 AND I0.1)
```

**Resultado**: Q0.0 só ativa se I0.0 E I0.1 estiverem ativos

### Com Timer:

```
TON T1,10  ; Configurar timer T1 com preset 10 (1 segundo)
LD I0.0    ; Carrega entrada
ST T1      ; Ativa timer quando I0.0 = true
LD T1      ; Carrega estado do timer (DN bit)
ST Q0.0    ; Q0.0 = estado do timer
```

**Resultado**: Q0.0 ativa 1 segundo após I0.0 ser ativado

---

## 🔗 Links Úteis

- [Documentação do Projeto](../../README.md)
- [Arquitetura](../docs/ARCHITECTURE.md)
- [Tutorial de IL (PDF)](../../docs/)

---

**Converta seus próprios programas**: Use o formato JSON acima como template!
