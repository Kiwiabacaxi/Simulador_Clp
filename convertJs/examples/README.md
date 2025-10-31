# 📁 Exemplos de Código IL

Esta pasta contém exemplos prontos para testar o Simulador CLP.

## 🚀 Como Usar

1. Abra o simulador em **http://localhost:5174**
2. Clique em **📂 Carregar**
3. Selecione um dos arquivos JSON desta pasta
4. Clique em **▶ Start** para iniciar a simulação
5. Interaja com as entradas (botões I0.0, I0.1, etc.)

---

## 📚 Lista de Exemplos

### 01 - Básico: Entradas → Saídas
**Dificuldade:** 🟢 Iniciante  
**Arquivo:** `01-basico-entradas-saidas.json`

Exemplo simples onde cada entrada controla uma saída diretamente.

**Conceitos:** LD (Load), ST (Store)

---

### 02 - Lógica AND e OR
**Dificuldade:** 🟢 Iniciante  
**Arquivo:** `02-logica-AND-OR.json`

Demonstra operadores lógicos AND e OR.

**Conceitos:** AND, OR, múltiplas condições

---

### 03 - Timer TON
**Dificuldade:** 🟡 Intermediário  
**Arquivo:** `03-timer-TON.json`

Timer que ativa a saída após 3 segundos.

**Conceitos:** TON, delays, temporização

---

### 04 - Timer TOFF
**Dificuldade:** 🟡 Intermediário  
**Arquivo:** `04-timer-TOFF.json`

Timer que desliga a saída após 2 segundos.

**Conceitos:** TOFF, delay no desligamento

---

### 05 - Contador CTU
**Dificuldade:** 🟡 Intermediário  
**Arquivo:** `05-contador-CTU.json`

Contador que ativa após 5 pulsos.

**Conceitos:** CTU, rising edge, contagem

---

### 06 - Semáforo
**Dificuldade:** 🟡 Intermediário  
**Arquivo:** `06-semaforo.json`

Simula um semáforo com 3 LEDs (vermelho, amarelo, verde).

**Conceitos:** Múltiplos timers, sequência automática

---

### 07 - Latch (Auto-Retenção)
**Dificuldade:** 🟡 Intermediário  
**Arquivo:** `07-latch-auto-retencao.json`

Circuito liga/desliga com memória de estado.

**Conceitos:** OR com feedback, auto-retenção

---

### 08 - Timer + Contador
**Dificuldade:** 🔴 Avançado  
**Arquivo:** `08-timer-contador-completo.json`

Combina timer e contador em sequência.

**Conceitos:** Combinação de timer e contador

---

### 09 - Pisca-Pisca
**Dificuldade:** 🔴 Avançado  
**Arquivo:** `09-pisca-pisca.json`

LED que pisca automaticamente (1s on, 1s off).

**Conceitos:** TON + TOFF em loop, oscilador

---

### 10 - Portão Automático
**Dificuldade:** 🔴 Avançado  
**Arquivo:** `10-portao-automatico.json`

Sistema completo de portão com sensor de obstáculo.

**Conceitos:** Sistema completo, segurança, múltiplas entradas

---

## 🎯 Operadores IL Disponíveis

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| LD | Load (carrega valor) | LD I0.0 |
| LDN | Load negado | LDN I0.1 |
| ST | Store (armazena) | ST Q0.0 |
| STN | Store negado | STN Q0.1 |
| AND | E lógico | AND I0.2 |
| ANDN | E lógico negado | ANDN I0.3 |
| OR | OU lógico | OR I0.4 |
| ORN | OU lógico negado | ORN I0.5 |
| TON | Timer ON delay | TON T1,30 |
| TOFF | Timer OFF delay | TOFF T2,20 |
| CTU | Counter UP | CTU C1,5 |
| CTD | Counter DOWN | CTD C2,10 |

---

## 📌 Dicas

- **Timer preset:** Valor em décimos de segundo (30 = 3 segundos)
- **Rising edge:** Transição OFF → ON detecta pulso
- **Memórias:** Use M1, M2, etc. para estados intermediários
- **Refresh:** Reseta todos os timers e contadores

---

**Data:** 2025-10-31  
**Versão:** 1.0  
**Simulador:** PLC Simulator TypeScript
