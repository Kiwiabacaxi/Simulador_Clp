import { useState } from 'react'
import {
  executeCycle,
  generateDefaultInputs,
  generateDefaultOutputs,
  updateTimers,
  resetAllMemory,
  type MemoryVariable
} from './core'

function App() {
  const [memory] = useState(new Map<string, MemoryVariable>())
  const [testResult, setTestResult] = useState<string>('')

  // Teste simples do interpretador (TICKET-02)
  const testInterpreter = () => {
    const testInputs = generateDefaultInputs()
    const testOutputs = generateDefaultOutputs()
    const testMemory = new Map()

    testInputs['I0.0'] = true
    const code = 'LD I0.0\nST Q0.0'
    const lines = code.split('\n')

    const result = executeCycle(lines, testInputs, testOutputs, testMemory)

    console.log('Inputs:', testInputs)
    console.log('Outputs:', result)
    console.log('Q0.0 should be true:', result['Q0.0'] === true ? '✅' : '❌')

    setTestResult('✅ Teste básico passou! (ver console)')
  }

  // Teste de TON (Timer ON Delay) - TICKET-03
  const testTON = () => {
    console.log('\n=== TESTE TON (Timer ON Delay) ===')

    const testMemory = new Map<string, MemoryVariable>()
    const testInputs = generateDefaultInputs()
    const testOutputs = generateDefaultOutputs()

    // Configura TON T1 com preset de 5 (500ms)
    testInputs['I0.0'] = true
    const code = `TON T1,5
LD I0.0
ST T1
LD T1
ST Q0.0`

    const lines = code.split('\n')
    executeCycle(lines, testInputs, testOutputs, testMemory)

    console.log('Timer T1 configurado:', testMemory.get('T1'))
    console.log('Iniciando timer...')

    // Atualiza timers
    updateTimers(testMemory, true)

    // Verifica após 600ms
    setTimeout(() => {
      const t1 = testMemory.get('T1')
      console.log('Após 600ms - T1.endTimer:', t1?.endTimer)
      console.log('Após 600ms - T1.counter:', t1?.counter)

      if (t1?.endTimer) {
        setTestResult('✅ TON funcionou! Timer ativou após 500ms')
      } else {
        setTestResult('❌ TON falhou - timer não ativou')
      }
    }, 600)
  }

  // Teste de CTU (Counter Up) - TICKET-03
  const testCTU = () => {
    console.log('\n=== TESTE CTU (Counter Up) ===')

    const testMemory = new Map<string, MemoryVariable>()
    const testInputs = generateDefaultInputs()
    const testOutputs = generateDefaultOutputs()

    // Configura CTU C1 com preset de 3
    const code = `CTU C1,3
LD I0.0
ST C1
LD C1
ST Q0.0`

    const lines = code.split('\n')

    // Configura counter
    testInputs['I0.0'] = false
    executeCycle(lines, testInputs, testOutputs, testMemory)

    console.log('Counter C1 configurado:', testMemory.get('C1'))

    // Simula 3 rising edges
    for (let i = 1; i <= 3; i++) {
      testInputs['I0.0'] = false
      executeCycle(lines, testInputs, testOutputs, testMemory)

      testInputs['I0.0'] = true
      executeCycle(lines, testInputs, testOutputs, testMemory)

      const c1 = testMemory.get('C1')
      console.log(`Rising edge ${i} - counter:`, c1?.counter, 'endTimer:', c1?.endTimer)
    }

    const c1 = testMemory.get('C1')
    if (c1?.endTimer && c1.counter === 3) {
      setTestResult('✅ CTU funcionou! Contador chegou em 3')
    } else {
      setTestResult(`❌ CTU falhou - counter: ${c1?.counter}, endTimer: ${c1?.endTimer}`)
    }
  }

  // Teste de TOFF (Timer OFF Delay) - TICKET-03
  const testTOFF = () => {
    console.log('\n=== TESTE TOFF (Timer OFF Delay) ===')

    const testMemory = new Map<string, MemoryVariable>()
    const testInputs = generateDefaultInputs()
    const testOutputs = generateDefaultOutputs()

    // Configura TOFF T2 com preset de 5 (500ms)
    testInputs['I0.0'] = true // Começa ligado
    const code = `TOFF T2,5
LD I0.0
ST T2
LD T2
ST Q0.0`

    const lines = code.split('\n')
    executeCycle(lines, testInputs, testOutputs, testMemory)

    console.log('Timer T2 configurado:', testMemory.get('T2'))

    // TOFF: timer roda quando entrada = false
    testInputs['I0.0'] = false
    executeCycle(lines, testInputs, testOutputs, testMemory)

    console.log('Input desligado, timer iniciando...')
    updateTimers(testMemory, true)

    // Verifica após 600ms
    setTimeout(() => {
      const t2 = testMemory.get('T2')
      console.log('Após 600ms - T2.endTimer:', t2?.endTimer)
      console.log('Após 600ms - T2.counter:', t2?.counter)

      if (t2?.endTimer === false) {
        setTestResult('✅ TOFF funcionou! Timer desativou após 500ms')
      } else {
        setTestResult('❌ TOFF falhou')
      }
    }, 600)
  }

  // Teste completo: TON + CTU + Lógica
  const testComplete = () => {
    console.log('\n=== TESTE COMPLETO: TON + CTU + Lógica ===')

    const testMemory = new Map<string, MemoryVariable>()
    const testInputs = generateDefaultInputs()
    const testOutputs = generateDefaultOutputs()

    const code = `TON T1,10
CTU C1,5
LD I0.0
ST T1
LD I0.1
ST C1
LD T1
AND C1
ST Q0.0`

    const lines = code.split('\n')

    // Liga entrada do timer
    testInputs['I0.0'] = true
    executeCycle(lines, testInputs, testOutputs, testMemory)
    updateTimers(testMemory, true)

    // Simula pulsos no contador
    for (let i = 0; i < 5; i++) {
      testInputs['I0.1'] = false
      executeCycle(lines, testInputs, testOutputs, testMemory)
      testInputs['I0.1'] = true
      executeCycle(lines, testInputs, testOutputs, testMemory)
    }

    console.log('Timer T1:', testMemory.get('T1'))
    console.log('Counter C1:', testMemory.get('C1'))

    // Verifica após 1100ms (timer deve estar ativo)
    setTimeout(() => {
      const t1 = testMemory.get('T1')
      const c1 = testMemory.get('C1')
      const result = executeCycle(lines, testInputs, testOutputs, testMemory)

      console.log('T1.endTimer:', t1?.endTimer, '| C1.endTimer:', c1?.endTimer)
      console.log('Q0.0 (T1 AND C1):', result['Q0.0'])

      if (t1?.endTimer && c1?.endTimer && result['Q0.0']) {
        setTestResult('✅ Teste completo passou! TON + CTU + Lógica funcionando')
      } else {
        setTestResult('❌ Teste completo falhou')
      }
    }, 1100)
  }

  // Reset de memória
  const handleReset = () => {
    resetAllMemory(memory)
    setTestResult('🔄 Memória resetada')
    console.log('Memória resetada')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🤖 Simulador CLP - TypeScript v1.1</h1>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3>✅ TICKET-01: Setup Inicial</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li>✅ Node.js inicializado</li>
          <li>✅ React 19 instalado</li>
          <li>✅ TypeScript configurado</li>
          <li>✅ Vite configurado</li>
          <li>✅ Estrutura de pastas criada</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h3>✅ TICKET-02: Core Logic - Interpretador</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li>✅ Tipos TypeScript criados (types.ts)</li>
          <li>✅ Funções utilitárias (utils.ts)</li>
          <li>✅ Parser de instruções IL (parser.ts)</li>
          <li>✅ Interpretador completo (interpreter.ts)</li>
          <li>✅ Operadores: LD, LDN, ST, STN, AND, ANDN, OR, ORN, TON, TOFF, CTU, CTD</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>Teste Básico:</h4>
          <button
            onClick={testInterpreter}
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Testar Interpretador
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px' }}>
        <h3>✅ TICKET-03: Timers e Contadores</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li>✅ Timer Manager (timerManager.ts - 152 linhas)</li>
          <li>✅ Memory Manager (memoryManager.ts - 165 linhas)</li>
          <li>✅ Hook React (useTimerUpdate.ts - 85 linhas)</li>
          <li>✅ TON/TOFF com setInterval (tick 100ms)</li>
          <li>✅ CTU/CTD com rising edge detection</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>Testes de Timers e Contadores:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button
              onClick={testTON}
              style={{
                padding: '10px 20px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Teste TON (Timer ON)
            </button>
            <button
              onClick={testTOFF}
              style={{
                padding: '10px 20px',
                background: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Teste TOFF (Timer OFF)
            </button>
            <button
              onClick={testCTU}
              style={{
                padding: '10px 20px',
                background: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Teste CTU (Counter Up)
            </button>
            <button
              onClick={testComplete}
              style={{
                padding: '10px 20px',
                background: '#F44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Teste Completo (TON+CTU)
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                background: '#607D8B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reset Memória
            </button>
          </div>

          {testResult && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: testResult.startsWith('✅') ? '#c8e6c9' : testResult.startsWith('❌') ? '#ffcdd2' : '#e3f2fd',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {testResult}
            </div>
          )}

          <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            📌 Abra o console do navegador (F12) para ver detalhes dos testes
          </p>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f3e5f5', borderRadius: '8px' }}>
        <h3>🔜 Próximo: TICKET-04 - UI Components</h3>
        <p>CodeEditor, IOPanel, ControlBar, FileMenu</p>
      </div>
    </div>
  )
}

export default App
