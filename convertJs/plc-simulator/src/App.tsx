import { executeCycle, generateDefaultInputs, generateDefaultOutputs } from './core'

function App() {
  // Teste simples do interpretador
  const testInterpreter = () => {
    const inputs = generateDefaultInputs()
    const outputs = generateDefaultOutputs()
    const memory = new Map()

    // Define I0.0 como true
    inputs['I0.0'] = true

    // Código simples: LD I0.0, ST Q0.0
    const code = 'LD I0.0\nST Q0.0'
    const lines = code.split('\n')

    const result = executeCycle(lines, inputs, outputs, memory)

    console.log('Inputs:', inputs)
    console.log('Outputs:', result)
    console.log('Q0.0 should be true:', result['Q0.0'] === true ? '✅' : '❌')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🤖 Simulador CLP - TypeScript</h1>

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
          <li>✅ Operadores implementados: LD, LDN, ST, STN, AND, ANDN, OR, ORN, TON, TOFF, CTU, CTD</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>Teste Rápido:</h4>
          <button
            onClick={testInterpreter}
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Testar Interpretador (ver console)
          </button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Abre o console do navegador (F12) para ver o resultado
          </p>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px' }}>
        <h3>🔜 Próximo: TICKET-03 - Timers e Contadores</h3>
        <p>Implementar lógica de timers (TON/TOFF) com setInterval</p>
      </div>
    </div>
  )
}

export default App
