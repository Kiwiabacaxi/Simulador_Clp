/**
 * Editor de Código IL
 * Baseado em HomePg.java TextArea
 */

import './CodeEditor.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function CodeEditor({ value, onChange, disabled }: CodeEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Converte para maiúsculas automaticamente (padrão IL)
    onChange(e.target.value.toUpperCase())
  }

  return (
    <div className="code-editor">
      <div className="editor-header">
        <h3>📝 Código IL (Instruction List)</h3>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="code-textarea"
        spellCheck={false}
        placeholder="Digite seu código aqui...

Exemplo:
LD I0.0
ST Q0.0

TON T1,10
LD I0.1
ST T1
LD T1
ST Q0.1"
      />
    </div>
  )
}
