# Changelog

Todas as mudanças notáveis do projeto serão documentadas aqui.

---

## [Unreleased]

### ✅ 2025-10-31 - Scene System Refactoring

**Implementado:**
- ✅ Scene system refactoring
  - Transformou painéis em "Scenes" contextuais
  - SceneType: 'default' | 'batch' | 'gate' | 'traffic-light' | 'conveyor'
  - Auto-selection de cenas baseada em metadata dos exemplos
- ✅ GateScene component (GateScene.tsx + CSS - 330 linhas)
  - Portão automático com animação SVG
  - Posição animada 0-100% com requestAnimationFrame
  - Sensores automáticos: FC Open (I1.0), FC Closed (I1.1)
  - Controles: ABRIR (I0.0), FECHAR (I0.1), PARAR (I0.2)
  - Motores: Q0.0 (abrindo), Q0.1 (fechando)
- ✅ TrafficLightScene component (TrafficLightScene.tsx + CSS - 518 linhas)
  - Semáforo com 2 vias (Norte-Sul, Leste-Oeste)
  - COMPLETAMENTE REESCRITO com melhor escala
  - Bulbos 80px com radial-gradient para efeito realista
  - Animações pulse para luzes ativas
  - Glow effects com box-shadow
  - Grid layout 3 colunas: 250px | 1fr | 250px
  - Controles: LIGAR SISTEMA (I0.0), MODO NOTURNO (I0.1)
  - Saídas: Q0.0-Q0.2 (Via N-S), Q1.0-Q1.2 (Via L-O)
- ✅ SceneSelector refactored (SceneSelector.tsx + CSS)
  - Agora suporta 4 cenas: default, batch, gate, traffic-light
  - Cada cena com ícone e descrição
- ✅ fileHandler.ts extended
  - SaveFile interface agora inclui scene?: SceneType
  - SaveFile interface agora inclui instructions?: string
- ✅ App.tsx auto-selection logic
  - Carrega cena automaticamente de metadata.scene
  - Mostra instruções no console quando disponível
- ✅ All 10 example JSONs updated
  - Todos os 10 exemplos agora têm metadata.scene
  - Todos os 10 exemplos agora têm metadata.instructions
  - 06-semaforo.json → scene: "traffic-light"
  - 10-portao-automatico.json → scene: "gate"
  - Demais exemplos → scene: "default"

**Funcionalidades:**
- ✅ Cenas auto-selecionam quando exemplos são carregados
- ✅ Instruções aparecem no console para guiar o usuário
- ✅ Animações suaves (60 FPS) para portão e semáforo
- ✅ Sensores automáticos baseados em posição/estado
- ✅ Layout responsivo em todas as cenas
- ✅ CSS radial-gradient para luzes realistas

**Total Scene System:** ~1,348 linhas (GateScene + TrafficLightScene + updates)

---

### ✅ 2025-10-31 - TICKET-05: Simulation Panels

**Implementado:**
- ✅ SceneSelector component (SceneSelector.tsx + CSS - 100 linhas)
  - Seletor de cenas (Painel Padrão / Simulação Batch)
  - Botões visuais com ícones
  - Desabilitado durante execução
- ✅ DefaultScenePanel (DefaultScenePanel.tsx + CSS - 250 linhas)
  - Painel visual com imagens PNG
  - 8 entradas (I0.0-I0.7) - switches clicáveis
  - 8 saídas (Q0.0-Q0.7) - LEDs on/off
  - Grid responsivo 2 colunas
  - Animações de hover e pulse
- ✅ BatchSimulationPanel (BatchSimulationPanel.tsx + CSS - 480 linhas)
  - Simulação de tanque com SVG
  - Animação de nível de líquido (0-100%)
  - Botões START (I0.0) e STOP (I0.1)
  - Bombas: Pump1 (Q0.1), Pump3 (Q0.3)
  - Mixer (Q0.2)
  - Sensores: HI (I1.0 - 80%), LO (I1.1 - 20%)
  - LEDs de status: RUN (Q1.0), IDLE (Q1.1), FULL (Q1.2)
  - Taxa de enchimento: 2%/s, esvaziamento: 1.5%/s
  - Background image do Java original
- ✅ Assets PNG copiados (21 arquivos)
  - chave_aberta/fechada.png
  - led_ligado/desligado.png
  - batch_bg.png
  - botoes, switches, etc.

**Funcionalidades:**
- ✅ Alternância entre cenas (Default/Batch)
- ✅ Animação suave do tanque (requestAnimationFrame)
- ✅ Sensores de nível automáticos (HI/LO)
- ✅ Controles interativos por cena
- ✅ Responsive design para mobile
- ✅ Integrado com PLC cycle

**Total TICKET-05:** ~830 linhas (3 componentes + 3 CSS)

---

### ✅ 2025-10-31 - TICKET-07: File Handler (Save/Load)

**Implementado:**
- ✅ fileHandler.ts utility (fileHandler.ts - 220 linhas)
  - saveProgram() - Download de JSON com código e memória
  - loadProgram() - Upload e validação de JSON
  - validateSaveFile() - Validação de versão e estrutura
  - saveToLocalStorage() - Auto-save da sessão
  - loadFromLocalStorage() - Restaurar última sessão
- ✅ ExamplesMenu component (ExamplesMenu.tsx + CSS - 180 linhas)
  - Dropdown modal com 10 exemplos
  - Busca de arquivos via fetch() de public/examples/
  - UI com animações e cores
- ✅ Refatoração do App.tsx
  - handleSave() usa fileHandler.saveProgram()
  - handleLoad() usa fileHandler.loadProgram()
  - ExamplesMenu integrado no header
- ✅ 10 exemplos copiados para public/examples/
  - 01-basico-entradas-saidas.json
  - 02-logica-AND-OR.json
  - 03-timer-TON.json
  - 04-timer-TOFF.json
  - 05-contador-CTU.json
  - 06-semaforo.json
  - 07-latch-auto-retencao.json
  - 08-timer-contador-completo.json
  - 09-pisca-pisca.json
  - 10-portao-automatico.json

**Funcionalidades:**
- ✅ Save/Load JSON via browser (download/upload)
- ✅ Validação de versão e formato do arquivo
- ✅ Tratamento robusto de erros
- ✅ Auto-save no LocalStorage (futuro)
- ✅ Menu de exemplos com modal
- ✅ Carrega exemplos via HTTP fetch

**Total TICKET-07:** ~400 linhas (fileHandler + ExamplesMenu + estilos)

---

### ✅ 2025-10-31 - TICKET-06: Data Table

**Implementado:**
- ✅ DataTable component (DataTable.tsx + CSS - 270 linhas)
  - Tabela de variáveis em tempo real
  - Mostra I, Q, M, T, C
  - Atualização automática durante simulação
- ✅ Filtros por tipo
  - Botões: Todas, Entradas, Saídas, Memória, Timers, Contadores
  - Cores diferentes para cada tipo
- ✅ Busca por nome
  - Input de busca com filtro em tempo real
  - Pesquisa case-insensitive
- ✅ Estatísticas no header
  - Conta variáveis ativas
  - Mostra total de cada tipo
- ✅ Informações detalhadas
  - Timers: counter/preset e porcentagem
  - Contadores: counter/preset e tipo (UP/DOWN)
  - Valores booleanos: ON/OFF
- ✅ Layout 3 colunas
  - Código | Simulação | Tabela de Dados
  - Responsivo (mobile: 1 coluna)

**Funcionalidades:**
- ✅ Tabela sticky header (scroll independente)
- ✅ Indicadores visuais (verde ON, cinza OFF)
- ✅ Border lateral colorida por tipo
- ✅ Hover effects nas linhas
- ✅ Total de variáveis filtradas no footer

**Total TICKET-06:** ~270 linhas

---

### ✅ 2025-10-31 - TICKET-04: UI Components

**Implementado:**
- ✅ CodeEditor component (CodeEditor.tsx + CSS)
  - Editor de código IL com maiúsculas automáticas
  - Textarea com fonte monospace
  - Placeholder com exemplos
- ✅ IOPanel component (IOPanel.tsx + CSS)
  - Botões para entradas (I0.0 - I1.7)
  - LEDs para saídas (Q0.0 - Q1.7)
  - Estados visuais (on/off com animações)
- ✅ ControlBar component (ControlBar.tsx + CSS)
  - Botão Start (inicia simulação)
  - Botão Stop (para simulação)
  - Botão Refresh (reseta memória)
  - Indicador de status (rodando/parado)
- ✅ FileMenu component (FileMenu.tsx + CSS)
  - Salvar código em JSON
  - Carregar código de JSON
  - Serialização de memória
- ✅ Hook usePLCCycle
  - Gerencia ciclo do PLC (100ms)
  - Controla inputs/outputs
  - Integra com timers
- ✅ App.tsx redesenhado
  - Layout grid responsivo
  - Header com gradiente
  - Footer com info dos tickets
  - Save/Load funcionais

**Funcionalidades:**
- ✅ Interface completa e funcional
- ✅ Layout responsivo (desktop e mobile)
- ✅ Animações e transições suaves
- ✅ Gradientes roxo/violeta
- ✅ LEDs com efeito pulse
- ✅ Botões com hover e disabled states

**Total TICKET-04:** ~650 linhas (componentes + estilos)

---

### ✅ 2025-10-31 - TICKET-03: Timers e Contadores

**Implementado:**
- ✅ Timer Manager (`timerManager.ts` - 158 linhas)
  - startTimer() / stopTimer() / resetTimer()
  - updateTimers() - Gerencia TON/TOFF baseado em currentValue
  - stopAllTimers() - Cleanup para prevenir memory leaks
- ✅ Memory Manager (`memoryManager.ts` - 169 linhas)
  - resetAllMemory() / resetTimers() / resetCounters()
  - getVariablesByType() / countVariablesByType()
  - serializeMemory() / deserializeMemory() - Para save/load
- ✅ Hook React (`useTimerUpdate.ts` - 88 linhas)
  - useTimerUpdate() - Hook principal
  - useTimerUpdateWithInterval() - Com controle de intervalo
  - useTimerCleanup() - Apenas cleanup
- ✅ Exports atualizados (`core/index.ts`, `hooks/index.ts`)

**Funcionalidades:**
- ✅ TON (Timer ON Delay) - Timer conta quando entrada = true
- ✅ TOFF (Timer OFF Delay) - Timer conta quando entrada = false
- ✅ CTU (Counter Up) - Rising edge detection
- ✅ CTD (Counter Down) - Rising edge detection
- ✅ Tick de 100ms (compatível com Java)

**Total TICKET-03:** ~415 linhas de código TypeScript

---

### ✅ 2025-10-31 - TICKET-02: Core Logic - Interpretador

**Implementado:**
- ✅ Tipos TypeScript completos (`types.ts` - 67 linhas)
- ✅ Funções utilitárias (`utils.ts` - 121 linhas)
- ✅ Parser de instruções IL (`parser.ts` - 88 linhas)
- ✅ Interpretador completo (`interpreter.ts` - 364 linhas)
- ✅ Exports centralizados (`index.ts`)

**Operadores IL implementados:**
- ✅ LD / LDN - Load / Load Negado
- ✅ ST / STN - Store / Store Negado
- ✅ AND / ANDN - AND / AND Negado
- ✅ OR / ORN - OR / OR Negado
- ✅ TON / TOFF - Timer ON/OFF Delay (configuração)
- ✅ CTU / CTD - Counter Up/Down (configuração)

**Port do Java:**
- Baseado em `Interpreter.java` (466 linhas)
- Lógica 100% preservada
- TypeScript strict mode

**Total:** ~640 linhas de código TypeScript

---

### ✅ 2025-10-31 - TICKET-01: Setup Inicial

**Implementado:**
- ✅ Projeto Node.js inicializado
- ✅ React 19.2 + TypeScript 5.7 + Vite 7.1
- ✅ Configurações (tsconfig, vite.config)
- ✅ Estrutura de pastas (src/core, components, hooks, utils)
- ✅ App.tsx básico
- ✅ Constantes do PLC (operadores válidos)

**Build:**
- ✅ Compila sem erros
- ✅ HMR funcional
- ✅ Bundle: ~200KB (gzip: ~63KB)

---

## Próximos Passos

### 🔜 TICKET-03: Timers e Contadores
- Implementar `timerManager.ts`
- setInterval para TON/TOFF
- Rising edge detection para CTU/CTD
- Hook `useTimerUpdate.ts`

### 🔜 TICKET-04: UI Components
- CodeEditor
- IOPanel (entradas/saídas)
- ControlBar (Start/Stop/Refresh)
- FileMenu

---

**Versão atual:** 0.2.0 (Pre-release)
**Status:** Core logic completo, aguardando UI
