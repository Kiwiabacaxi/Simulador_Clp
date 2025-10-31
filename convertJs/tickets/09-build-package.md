# TICKET-09: Build & Package (Electron)

**Status**: 🔴 TODO
**Prioridade**: 🔴 ALTA
**Estimativa**: 1 dia
**Dependências**: TICKET-08

---

## 📋 Objetivo

Configurar electron-builder para gerar instaladores Windows/macOS/Linux.

---

## ✅ Tarefas

### 1. Configuração electron-builder

```json
// package.json
{
  "name": "plc-simulator",
  "version": "1.0.0",
  "main": "electron/main.js",
  "build": {
    "appId": "com.iftm.plc-simulator",
    "productName": "Simulador CLP",
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "directories": {
      "buildResources": "build"
    },
    "win": {
      "target": ["nsis"],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "build/icon.icns",
      "category": "public.app-category.education"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png",
      "category": "Education"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true
    }
  },
  "scripts": {
    "build:win": "npm run build && electron-builder --win",
    "build:mac": "npm run build && electron-builder --mac",
    "build:linux": "npm run build && electron-builder --linux",
    "build:all": "npm run build && electron-builder -mwl"
  }
}
```

### 2. Criar ícones

- Criar `build/icon.png` (512x512)
- Gerar `build/icon.ico` (Windows)
- Gerar `build/icon.icns` (macOS)

Usar ferramenta online: https://www.icoconverter.com/

### 3. Scripts de build

```bash
# Build para Windows (no Windows ou cross-compile)
npm run build:win

# Build para macOS (apenas no macOS)
npm run build:mac

# Build para Linux
npm run build:linux
```

### 4. Testar instaladores

- [ ] Windows: Instalar .exe, verificar funcionamento
- [ ] macOS: Instalar .dmg, verificar funcionamento
- [ ] Linux: Instalar .AppImage, verificar funcionamento

---

## 🎯 Critérios de Aceitação

- [ ] Instalador Windows (.exe) funciona
- [ ] Instalador macOS (.dmg) funciona
- [ ] Instalador Linux (.AppImage) funciona
- [ ] Ícone customizado aparece
- [ ] Nome correto "Simulador CLP"
- [ ] Versão 1.0.0 configurada
- [ ] Arquivos de build otimizados

---

## 📝 Notas

- Instalador Windows requerido pelo professor
- macOS e Linux são extras
- Code signing opcional (caro para estudantes)

---

## 🔗 Links Úteis

- [electron-builder docs](https://www.electron.build/)
- [Icon converter](https://www.icoconverter.com/)
