/**
 * Menu de Arquivo (Salvar/Carregar)
 * Baseado em HomePageController.java save/load
 */

import './FileMenu.css'

interface FileMenuProps {
  onSave: () => void
  onLoad: (file: File) => void
  disabled?: boolean
}

export function FileMenu({ onSave, onLoad, disabled }: FileMenuProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onLoad(file)
      // Limpa o input para permitir carregar o mesmo arquivo novamente
      e.target.value = ''
    }
  }

  return (
    <div className="file-menu">
      <button
        onClick={onSave}
        disabled={disabled}
        className="file-btn save"
        aria-label="Salvar arquivo"
        title="Salvar código como JSON"
      >
        <span className="btn-icon">💾</span>
        <span className="btn-text">Salvar</span>
      </button>

      <label className={`file-btn load ${disabled ? 'disabled' : ''}`}>
        <span className="btn-icon">📂</span>
        <span className="btn-text">Carregar</span>
        <input
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          disabled={disabled}
          style={{ display: 'none' }}
          aria-label="Carregar arquivo"
          title="Carregar código de arquivo JSON"
        />
      </label>
    </div>
  )
}
