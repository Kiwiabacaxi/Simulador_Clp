# 🚀 Roadmap: Migração Java → TypeScript/React/Electron

## 📊 Status Geral: 🔴 Em Desenvolvimento

**Última atualização**: 2025-10-31

---

## 🎯 Objetivo

Migrar o **Simulador de CLP** de Java/Swing para TypeScript/React, mantendo:
- ✅ Toda a lógica e funcionalidade do interpretador IL
- ✅ Interface moderna e responsiva
- ✅ Executável desktop multiplataforma (Electron)
- ✅ Versão web para GitHub Pages

---

## 🏗️ Stack Tecnológica

| Área | Tecnologia | Justificativa |
|------|-----------|---------------|
| **Linguagem** | TypeScript | Segurança de tipos, melhor para lógica complexa |
| **Frontend** | React 18 + Vite | Performance, DX moderna, build rápido |
| **Desktop** | Electron 28 | Cross-platform, mesma base de código |
| **Build Tool** | Vite 5 | Extremamente rápido, HMR instantâneo |
| **Package Manager** | npm/pnpm | Padrão da indústria |
| **Testes** | Vitest + Playwright | Unit tests + E2E |
| **Deploy** | GitHub Pages + Actions | CI/CD automatizado, hosting gratuito |

---

## 📋 Fases do Projeto

### Fase 1: Setup & Core Logic (4-5 dias) 🔴 IN PROGRESS
- [x] Estrutura de pastas criada
- [ ] Projeto Node.js inicializado
- [ ] Interpretador portado (interpreter.ts)
- [ ] Sistema de memória (memoryVariable.ts)
- [ ] Timers e contadores funcionando
- [ ] Testes unitários básicos

### Fase 2: Interface Web (4-5 dias) ⚪ TODO
- [ ] Componente CodeEditor
- [ ] Painel de I/O (entradas/saídas)
- [ ] Controles de execução (Start/Stop/Refresh)
- [ ] Data Table para variáveis
- [ ] Sistema de arquivo (save/load JSON)

### Fase 3: Desktop (2-3 dias) ⚪ TODO
- [ ] Electron main process
- [ ] Menu nativo
- [ ] Diálogos de arquivo
- [ ] Empacotamento Windows/macOS/Linux

### Fase 4: Deploy & Extras (2-3 dias) ⚪ TODO
- [ ] GitHub Pages setup
- [ ] CI/CD com GitHub Actions
- [ ] Internacionalização (i18n)
- [ ] Testes E2E

---

## 📦 Deliverables

| Item | Desktop | Web | Status |
|------|---------|-----|--------|
| Interpretador IL completo | ✅ | ✅ | ⚪ TODO |
| Editor de código | ✅ | ✅ | ⚪ TODO |
| Painel I/O interativo | ✅ | ✅ | ⚪ TODO |
| Timers TON/TOFF | ✅ | ✅ | ⚪ TODO |
| Contadores CTU/CTD | ✅ | ✅ | ⚪ TODO |
| Data Table | ✅ | ✅ | ⚪ TODO |
| Salvamento JSON | ✅ | 🔶 (LocalStorage) | ⚪ TODO |
| Múltiplas cenas | ✅ | ✅ | ⚪ TODO |
| Instalador Windows | ✅ | N/A | ⚪ TODO |
| Instalador macOS | ✅ | N/A | ⚪ TODO |
| Instalador Linux | ✅ | N/A | ⚪ TODO |
| Deploy GitHub Pages | N/A | ✅ | ⚪ TODO |

---

## 🎫 Tickets

Acesse a pasta `/tickets` para ver os tickets detalhados:

1. [TICKET-01: Setup Inicial](./tickets/01-setup.md)
2. [TICKET-02: Core Logic - Interpretador](./tickets/02-core-logic.md)
3. [TICKET-03: Core Logic - Timers/Contadores](./tickets/03-timers-counters.md)
4. [TICKET-04: UI - Componentes Base](./tickets/04-ui-components.md)
5. [TICKET-05: UI - Painéis de Simulação](./tickets/05-simulation-panels.md)
6. [TICKET-06: UI - Data Table](./tickets/06-data-table.md)
7. [TICKET-07: File Handler](./tickets/07-file-handler.md)
8. [TICKET-08: Electron Main](./tickets/08-electron-main.md)
9. [TICKET-09: Build & Package](./tickets/09-build-package.md)
10. [TICKET-10: GitHub Pages](./tickets/10-github-pages.md)
11. [TICKET-11: Internacionalização](./tickets/11-i18n.md)
12. [TICKET-12: Testes & Refinamentos](./tickets/12-testing.md)

---

## 📈 Progresso

```
[████░░░░░░░░░░░░░░░░] 10%

Concluído: 0/12 tickets
Em progresso: 1/12 tickets
A fazer: 11/12 tickets
```

---

## 🔗 Links Úteis

- [Projeto Java Original](../)
- [Documentação de Arquitetura](./docs/ARCHITECTURE.md)
- [Vite Docs](https://vitejs.dev)
- [Electron Docs](https://electronjs.org)
- [React Docs](https://react.dev)

---

## 👥 Equipe

- **Desenvolvedor Principal**: [Seu Nome]
- **Projeto Original**: Alunos IFTM 2024/02
- **Professor**: Robson Rodrigues

---

## 📝 Notas

- Este projeto está **temporariamente** na pasta `/convertJs` do repositório Java
- Quando estiver maduro, ganhará repositório próprio
- Mantenha commits atômicos e bem documentados
- Teste cada feature antes de marcar ticket como concluído
