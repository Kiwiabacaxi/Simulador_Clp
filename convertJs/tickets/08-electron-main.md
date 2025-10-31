# TICKET-08: Electron - Main Process

**Status**: 🔴 TODO
**Prioridade**: 🔴 ALTA
**Estimativa**: 1-2 dias
**Dependências**: TICKET-04, TICKET-07

---

## 📋 Objetivo

Configurar Electron para executável desktop com menu nativo e diálogos.

---

## ✅ Tarefas

### 1. Main Process

```typescript
// electron/main.ts
import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs/promises'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  createMenu()
})

function createMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Salvar',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu-save'),
        },
        {
          label: 'Carregar',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'JSON', extensions: ['json'] }],
            })
            if (!result.canceled) {
              const content = await fs.readFile(result.filePaths[0], 'utf-8')
              mainWindow?.webContents.send('file-loaded', content)
            }
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Sair' },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => mainWindow?.webContents.send('show-about'),
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC Handlers
ipcMain.handle('save-file', async (_, data: string, filename: string) => {
  const result = await dialog.showSaveDialog({
    defaultPath: filename,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  })

  if (!result.canceled && result.filePath) {
    await fs.writeFile(result.filePath, data, 'utf-8')
    return true
  }
  return false
})
```

### 2. Preload Script

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (data: string, filename: string) =>
    ipcRenderer.invoke('save-file', data, filename),
  onMenuSave: (callback: () => void) =>
    ipcRenderer.on('menu-save', callback),
  onFileLoaded: (callback: (content: string) => void) =>
    ipcRenderer.on('file-loaded', (_, content) => callback(content)),
})
```

### 3. Type Definitions

```typescript
// src/types/electron.d.ts
export interface ElectronAPI {
  saveFile: (data: string, filename: string) => Promise<boolean>
  onMenuSave: (callback: () => void) => void
  onFileLoaded: (callback: (content: string) => void) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
```

---

## 🎯 Critérios de Aceitação

- [ ] Electron abre janela
- [ ] Menu nativo funciona
- [ ] Salvar arquivo via dialog
- [ ] Carregar arquivo via dialog
- [ ] Atalhos de teclado funcionam
- [ ] IPC entre main e renderer

---

## 🔗 Referência

- [Electron IPC](https://www.electronjs.org/docs/latest/tutorial/ipc)
