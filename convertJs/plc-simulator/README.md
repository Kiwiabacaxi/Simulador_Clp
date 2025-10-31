# 🤖 PLC Simulator - Web App

**Status**: ✅ Core Logic Completo (TICKET-01 ✅ + TICKET-02 ✅)

---

## 🚀 Quick Start

```bash
# Instalar dependências (já feito)
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 📁 Estrutura do Projeto

```
plc-simulator/
├── src/
│   ├── core/           # Lógica do interpretador IL
│   │   └── constants.ts
│   ├── components/     # Componentes React
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilitários
│   ├── App.tsx         # Componente raiz
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
│
├── electron/           # Electron main process (futuro)
├── public/             # Assets estáticos
├── index.html          # HTML template
├── vite.config.ts      # Configuração Vite
├── tsconfig.json       # Configuração TypeScript
└── package.json        # Dependências e scripts
```

---

## ✅ TICKET-01 Concluído

### O que foi feito:

- ✅ Projeto Node.js inicializado
- ✅ React 19.2 instalado
- ✅ TypeScript 5.3 configurado
- ✅ Vite 7.1 configurado
- ✅ Estrutura de pastas criada
- ✅ Arquivos base criados
- ✅ Build testado e funcionando

### Arquivos criados:

- `package.json` - Configuração do projeto
- `tsconfig.json` - TypeScript config (strict mode)
- `vite.config.ts` - Vite config com React plugin
- `index.html` - HTML template
- `src/main.tsx` - React entry point
- `src/App.tsx` - Componente principal
- `src/index.css` - Estilos globais
- `src/core/constants.ts` - Constantes do PLC
- `.gitignore` - Arquivos ignorados

### ✅ TICKET-02 Concluído

- ✅ Tipos TypeScript criados (types.ts - 67 linhas)
- ✅ Funções utilitárias (utils.ts - 121 linhas)
- ✅ Parser de instruções (parser.ts - 88 linhas)
- ✅ Interpretador completo (interpreter.ts - 364 linhas)
- ✅ **Total: 671 linhas de código TypeScript**
- ✅ Todos operadores implementados: LD, LDN, ST, STN, AND, ANDN, OR, ORN, TON, TOFF, CTU, CTD

---

## 🎯 Próximos Passos

**TICKET-03**: Timers e Contadores
- Implementar timerManager.ts com setInterval
- Hook useTimerUpdate para gerenciar timers no ciclo
- Rising edge detection para contadores

---

## 🧪 Testado

```bash
$ npm run build
✓ 29 modules transformed.
✓ built in 696ms
```

**Status**: ✅ Sem erros de compilação!

---

## 📦 Dependências

### Production
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React DOM renderer

### Development
- `vite@7.1.12` - Build tool
- `@vitejs/plugin-react@4.3.5` - Vite plugin
- `typescript@5.7.3` - Language
- `@types/react@19.0.7` - React types
- `@types/react-dom@19.0.3` - React DOM types
- `@types/node@22.10.7` - Node types

---

## 🌐 Acessar

Quando rodar `npm run dev`, acesse:
**http://localhost:5173**

---

**Data**: 2025-10-31
**Ticket**: TICKET-01 ✅
**Próximo**: TICKET-02 (Core Logic)
