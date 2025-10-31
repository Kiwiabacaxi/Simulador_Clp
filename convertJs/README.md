# 🚀 Simulador CLP - TypeScript/React/Electron

**Migração do projeto Java para Stack Web Moderna**

[![Status](https://img.shields.io/badge/Status-Planning-yellow)]()
[![License](https://img.shields.io/badge/License-Academic-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)]()
[![React](https://img.shields.io/badge/React-18-61dafb)]()
[![Electron](https://img.shields.io/badge/Electron-28-47848f)]()

---

## 📋 Índice

- [Sobre](#sobre)
- [Status do Projeto](#status-do-projeto)
- [Estrutura](#estrutura)
- [Como Começar](#como-começar)
- [Documentação](#documentação)
- [Contribuindo](#contribuindo)

---

## 🎯 Sobre

Este projeto é uma **migração completa** do [Simulador CLP](../) de **Java/Swing** para **TypeScript/React/Electron**, mantendo 100% da funcionalidade original.

### Objetivos:

1. ✅ **Executável desktop** para Windows/macOS/Linux (Electron)
2. ✅ **Versão web** para GitHub Pages
3. ✅ **Interface moderna** e responsiva (React)
4. ✅ **Código tipado** e seguro (TypeScript)
5. ✅ **Mesma lógica** do projeto Java

### Por quê?

- 🎓 **Requisito acadêmico**: Professor solicitou versão desktop + web
- 🚀 **Stack moderna**: React é padrão da indústria
- 🌐 **Acessibilidade**: Versão web roda em qualquer navegador
- 📦 **Portabilidade**: Um código, múltiplas plataformas

---

## 📊 Status do Projeto

**Fase Atual**: 🟡 Planejamento Concluído

### Progresso Geral:

```
Setup & Planejamento:  [████████████████████] 100% ✅
Core Logic (Código):   [░░░░░░░░░░░░░░░░░░░░]   0%
Interface (UI):        [░░░░░░░░░░░░░░░░░░░░]   0%
Desktop (Electron):    [░░░░░░░░░░░░░░░░░░░░]   0%
Deploy (Web):          [░░░░░░░░░░░░░░░░░░░░]   0%

TOTAL:                 [████░░░░░░░░░░░░░░░░]  20%
```

### Próximos Passos:

- [ ] **TICKET-01**: Setup inicial (Node.js, Vite, TypeScript)
- [ ] **TICKET-02**: Port do interpretador IL
- [ ] **TICKET-03**: Implementar timers e contadores

📅 **Início previsto**: A definir
⏱️ **Duração estimada**: 14-18 dias
🎯 **Meta**: Versão 1.0.0 funcional

---

## 📁 Estrutura

```
/convertJs/
├── README.md              # Este arquivo
├── ROADMAP.md             # Plano geral e status
│
├── tickets/               # 📋 12 tickets de desenvolvimento
│   ├── README.md          #    Índice e guia
│   ├── 01-setup.md
│   ├── 02-core-logic.md
│   └── ...
│
├── docs/                  # 📚 Documentação técnica
│   └── ARCHITECTURE.md    #    Decisões de design
│
├── examples/              # 📝 Programas IL em JSON
│   ├── example1-simple.json
│   ├── example2-timer.json
│   └── example3-counter.json
│
└── plc-simulator/         # 💻 Código fonte (futuro)
    ├── src/               #    Core + UI
    ├── electron/          #    Electron main
    ├── public/            #    Assets
    └── package.json
```

---

## 🚀 Como Começar

### Pré-requisitos:

- **Node.js** 20+ ([Download](https://nodejs.org))
- **Git** ([Download](https://git-scm.com))
- **Editor**: VS Code recomendado ([Download](https://code.visualstudio.com))

### Passos:

```bash
# 1. Clone o repositório (se ainda não clonou)
git clone https://github.com/seu-usuario/Simulador_Clp.git
cd Simulador_Clp/convertJs

# 2. Aguardar TICKET-01 ser implementado
# (Estrutura do projeto Node.js ainda será criada)

# 3. Quando pronto, instalar dependências:
cd plc-simulator
npm install

# 4. Rodar em modo desenvolvimento:
npm run dev

# 5. Build para produção:
npm run build
```

---

## 📚 Documentação

### Leitura Obrigatória:

1. **[ROADMAP.md](./ROADMAP.md)** - Visão geral, fases e progresso
2. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Decisões técnicas e design
3. **[Tickets README](./tickets/README.md)** - Guia dos tickets

### Tickets de Desenvolvimento:

| Fase | Tickets | Descrição |
|------|---------|-----------|
| **1. Core** | 01-03 | Setup, interpretador, timers |
| **2. Frontend** | 04-07 | UI React, file handler |
| **3. Desktop** | 08-09 | Electron, build |
| **4. Extras** | 10-12 | Deploy, i18n, testes |

**Ver todos**: [tickets/](./tickets/)

### Exemplos:

- [Exemplo 1 - Simples](./examples/example1-simple.json): Lógica básica
- [Exemplo 2 - Timer](./examples/example2-timer.json): Temporizadores TON
- [Exemplo 3 - Contador](./examples/example3-counter.json): Contadores CTU

---

## 🛠️ Stack Tecnológica

| Área | Tecnologia | Versão |
|------|-----------|--------|
| **Linguagem** | TypeScript | 5.3+ |
| **Frontend** | React | 18.2+ |
| **Build** | Vite | 5.0+ |
| **Desktop** | Electron | 28.0+ |
| **Testes** | Vitest + Playwright | Latest |
| **Package** | npm/pnpm | Latest |

---

## 🤝 Contribuindo

### Para Estudantes/Desenvolvedores:

1. **Escolha um ticket**: Veja [tickets/README.md](./tickets/README.md)
2. **Crie uma branch**: `git checkout -b feature/ticket-XX`
3. **Implemente**: Siga as especificações do ticket
4. **Teste**: Garanta que funciona
5. **Commit**: `git commit -m "[TICKET-XX] Descrição"`
6. **Push**: `git push origin feature/ticket-XX`
7. **PR**: Abra Pull Request referenciando o ticket

### Padrões:

- **Código**: ESLint + Prettier
- **Commits**: Conventional Commits
- **TypeScript**: Strict mode
- **Testes**: Cobertura mínima 80%

---

## 📜 Licença

**Projeto Acadêmico** - IFTM - Instituto Federal do Triângulo Mineiro

Baseado no projeto original:
https://github.com/IasminPieraco/Trabalho-Final-CLP

---

## 👥 Equipe

**Projeto Original (Java)**:
- Alunos IFTM 2024/02
- Professor: Robson Rodrigues

**Migração TypeScript**:
- [Seu Nome Aqui]

---

## 📞 Contato

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/Simulador_Clp/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/Simulador_Clp/discussions)
- **Email**: [seu-email@instituicao.edu.br]

---

## 🎓 Referências

- [Projeto Java Original](../)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Electron Documentation](https://electronjs.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🏆 Agradecimentos

- **IFTM** - Instituto Federal do Triângulo Mineiro
- **Professor Robson Rodrigues** - Orientação
- **Alunos 2024/02** - Projeto base Java
- **Comunidade Open Source** - Ferramentas incríveis

---

**Status**: 🟡 Em Planejamento
**Última Atualização**: 2025-10-31
**Versão**: 0.1.0 (Pre-release)

🚀 **Bora codar!**
