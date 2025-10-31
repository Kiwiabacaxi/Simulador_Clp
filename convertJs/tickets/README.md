# 🎫 Tickets de Desenvolvimento

## 📊 Visão Geral

Este diretório contém todos os tickets (tarefas) para a migração do Simulador CLP de Java para TypeScript/React/Electron.

**Total**: 12 tickets
**Tempo estimado**: 14-18 dias
**Status**: 🔴 Planejamento concluído, aguardando execução

---

## 📋 Lista de Tickets

### 🔴 Fase 1: Setup & Core Logic (4-5 dias)

| # | Ticket | Prioridade | Estimativa | Status |
|---|--------|-----------|------------|---------|
| 01 | [Setup Inicial](./01-setup.md) | 🔥 CRÍTICO | 1 dia | 🔴 TODO |
| 02 | [Core Logic - Interpretador](./02-core-logic.md) | 🔥 CRÍTICO | 2-3 dias | 🔴 TODO |
| 03 | [Core Logic - Timers/Contadores](./03-timers-counters.md) | 🔥 ALTA | 1-2 dias | 🔴 TODO |

**Objetivo**: Ter o interpretador IL completo e funcional, sem UI.

---

### 🟡 Fase 2: Interface Web (4-5 dias)

| # | Ticket | Prioridade | Estimativa | Status |
|---|--------|-----------|------------|---------|
| 04 | [UI - Componentes Base](./04-ui-components.md) | 🔴 ALTA | 2-3 dias | 🔴 TODO |
| 05 | [UI - Painéis de Simulação](./05-simulation-panels.md) | 🟡 MÉDIA | 2 dias | 🔴 TODO |
| 06 | [UI - Data Table](./06-data-table.md) | 🟡 MÉDIA | 1 dia | 🔴 TODO |
| 07 | [File Handler](./07-file-handler.md) | 🔴 ALTA | 1 dia | 🔴 TODO |

**Objetivo**: Interface React completa e funcional no navegador.

---

### 🟢 Fase 3: Desktop (2-3 dias)

| # | Ticket | Prioridade | Estimativa | Status |
|---|--------|-----------|------------|---------|
| 08 | [Electron - Main Process](./08-electron-main.md) | 🔴 ALTA | 1-2 dias | 🔴 TODO |
| 09 | [Build & Package](./09-build-package.md) | 🔴 ALTA | 1 dia | 🔴 TODO |

**Objetivo**: Executável desktop (.exe, .dmg, .AppImage) funcionando.

---

### 🔵 Fase 4: Deploy & Extras (2-3 dias)

| # | Ticket | Prioridade | Estimativa | Status |
|---|--------|-----------|------------|---------|
| 10 | [GitHub Pages](./10-github-pages.md) | 🟡 MÉDIA | 1 dia | 🔴 TODO |
| 11 | [Internacionalização](./11-i18n.md) | 🟢 BAIXA | 1 dia | 🔴 TODO |
| 12 | [Testes & Refinamentos](./12-testing.md) | 🟢 BAIXA | 2-3 dias | 🔴 TODO |

**Objetivo**: Deploy web + extras (i18n, testes).

---

## 🎯 Ordem de Execução Recomendada

### Sequencial (Solo)

1. **TICKET-01** → Setup
2. **TICKET-02** → Interpretador
3. **TICKET-03** → Timers/Contadores
4. **TICKET-04** → UI Base
5. **TICKET-07** → File Handler
6. **TICKET-06** → Data Table
7. **TICKET-05** → Painéis de Simulação
8. **TICKET-08** → Electron
9. **TICKET-09** → Build
10. **TICKET-10** → GitHub Pages
11. **TICKET-11** → i18n
12. **TICKET-12** → Testes

### Paralelo (Equipe)

**Dev 1 (Core)**:
- TICKET-01 → TICKET-02 → TICKET-03

**Dev 2 (Frontend)**:
- Aguardar TICKET-02 → TICKET-04 → TICKET-05 → TICKET-06

**Dev 3 (Infra)**:
- TICKET-07 → TICKET-08 → TICKET-09 → TICKET-10

**Dev 4 (QA)**:
- TICKET-12 (em paralelo com outros)

---

## 📈 Progresso

```
Fase 1 (Core):      [░░░░░░░░░░] 0%
Fase 2 (Frontend):  [░░░░░░░░░░] 0%
Fase 3 (Desktop):   [░░░░░░░░░░] 0%
Fase 4 (Deploy):    [░░░░░░░░░░] 0%

Total:              [░░░░░░░░░░] 0%
```

---

## ✅ Como Usar Este Diretório

### Para começar um ticket:

1. Leia o arquivo `.md` do ticket
2. Entenda os objetivos e critérios de aceitação
3. Implemente conforme especificado
4. Teste localmente
5. Marque como concluído no ROADMAP

### Estrutura de cada ticket:

- **Status**: TODO / IN PROGRESS / DONE
- **Prioridade**: Crítico / Alta / Média / Baixa
- **Estimativa**: Tempo esperado
- **Dependências**: Quais tickets devem estar prontos antes
- **Objetivo**: O que será feito
- **Tarefas**: Checklist detalhado
- **Critérios de Aceitação**: Como saber que está pronto
- **Notas**: Dicas e observações
- **Referência**: Código Java correspondente

---

## 🚨 Dependências Críticas

```
TICKET-01 (Setup)
    ↓
TICKET-02 (Interpretador)
    ↓
    ├─→ TICKET-03 (Timers)
    └─→ TICKET-04 (UI)
            ↓
            ├─→ TICKET-05 (Painéis)
            ├─→ TICKET-06 (Data Table)
            └─→ TICKET-07 (File Handler)
                    ↓
                    └─→ TICKET-08 (Electron)
                            ↓
                            ├─→ TICKET-09 (Build)
                            └─→ TICKET-10 (GitHub Pages)

TICKET-11 (i18n) - Independente
TICKET-12 (Testes) - Independente
```

---

## 📝 Convenções

### Branch naming:
```
feature/ticket-01-setup
feature/ticket-02-core-logic
fix/ticket-12-test-flaky
```

### Commit messages:
```
[TICKET-01] Adiciona configuração inicial do Vite
[TICKET-02] Implementa parser de instruções IL
[TICKET-04] Cria componente CodeEditor
```

### Pull Requests:
```
Title: [TICKET-XX] Breve descrição
Body:
- Implementa [o que foi feito]
- Testes: [sim/não]
- Critérios de aceitação: [x/y completos]
```

---

## 🎓 Para Estudantes

Se você está aprendendo:

**Comece por**:
- TICKET-01: Aprenda setup moderno
- TICKET-02: Entenda lógica de compiladores
- TICKET-04: Pratique React hooks

**Nível intermediário**:
- TICKET-03: Timers e async
- TICKET-07: File system APIs
- TICKET-08: Electron IPC

**Nível avançado**:
- TICKET-05: Canvas/SVG
- TICKET-09: Build systems
- TICKET-12: Testing strategies

---

## 📞 Dúvidas?

- Leia o [ROADMAP.md](../ROADMAP.md)
- Consulte [ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- Compare com código Java original em `/src`

---

**Boa sorte!** 🚀
