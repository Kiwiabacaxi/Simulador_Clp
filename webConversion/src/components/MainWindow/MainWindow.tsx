/**
 * Main Window Component
 * Main application layout
 * Converted from src/screens/HomePg.java
 */

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PLCStateProvider, usePLCState } from '../../context/PLCStateContext';
import { useExecutionCycle } from '../../hooks/useExecutionCycle';
import { useTheme } from '../../hooks/useTheme';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useToastContext } from '../../context/ToastContext';
import { FileIOService } from '../../services/fileIO';
import { SceneType } from '../../types/plc';
import { MenuBar } from '../MenuBar/MenuBar';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import { SceneContainer } from '../SceneContainer/SceneContainer';
import { DataTable } from '../DataTable/DataTable';
import { HelpDialog } from '../HelpDialog/HelpDialog';
import { AboutDialog } from '../AboutDialog/AboutDialog';
import { TimerCounterStatus } from '../TimerCounterStatus/TimerCounterStatus';
import { KeyboardShortcuts } from '../KeyboardShortcuts/KeyboardShortcuts';
import { DragDropOverlay } from '../DragDropOverlay/DragDropOverlay';
import '../../i18n/config';
import '../../styles/themes.css';
import '../../styles/globals.css';
import './MainWindow.css';

/**
 * Inner component that uses context
 */
function MainWindowContent() {
  const { t } = useTranslation();
  const { state, dispatch } = usePLCState();
  const { theme } = useTheme();
  const executionCycle = useExecutionCycle();
  const toast = useToastContext();
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);

  // Check if in batch mode to adjust layout
  const isBatchMode = state.currentScene === SceneType.BATCH_SIMULATION;

  // Handle file drop
  const handleFileDrop = useCallback(async (file: File) => {
    try {
      const programText = await FileIOService.loadProgramFromFile(file);
      dispatch({ type: 'SET_PROGRAM_TEXT', programText });
      toast.success(t('messages.programLoaded'));
    } catch (error) {
      console.error('File drop error:', error);
      toast.error(t('messages.error') + ': ' + (error as Error).message);
    }
  }, [dispatch, toast, t]);

  // Enable drag and drop
  const { isDragging } = useDragAndDrop({
    onFileDrop: handleFileDrop,
    acceptedExtensions: ['.txt'],
    enabled: true
  });

  // Initialize i18n and theme on mount
  useEffect(() => {
    console.log('PLC Simulator initialized');
    console.log('Theme:', theme);
    console.log('Execution cycle:', executionCycle.mode);
  }, [theme, executionCycle.mode]);

  return (
    <div className={`main-window ${isBatchMode ? 'main-window--batch' : ''}`}>
      {/* Global Keyboard Shortcuts */}
      <KeyboardShortcuts
        onOpenHelp={() => setShowHelp(true)}
        onOpenAbout={() => setShowAbout(true)}
        onOpenDataTable={() => setShowDataTable(true)}
      />

      {/* Top Bar - Menu and Controls */}
      <div className="main-window__top-bar">
        <MenuBar
          onOpenHelp={() => setShowHelp(true)}
          onOpenAbout={() => setShowAbout(true)}
          onOpenDataTable={() => setShowDataTable(true)}
        />
        <ControlPanel />
      </div>

      {/* Main Content Area */}
      <div className="main-window__content">
        {/* Scene Area - Left in batch mode, Right otherwise */}
        <div className={`main-window__scene ${isBatchMode ? 'main-window__scene--batch' : ''}`}>
          <SceneContainer />
        </div>

        {/* Editor and Status Panel - Right in batch mode, Left otherwise */}
        <div className={`main-window__editor-panel ${isBatchMode ? 'main-window__editor-panel--batch' : ''}`}>
          {/* Code Editor */}
          <div className="main-window__editor">
            <CodeEditor />
          </div>

          {/* Status Panel - Timers/Counters */}
          <div className="main-window__status">
            <TimerCounterStatus />
          </div>
        </div>
      </div>

      {/* Footer - Optional status bar */}
      <div className="main-window__footer">
        <span>Mode: {executionCycle.mode}</span>
        <span>Theme: {theme}</span>
      </div>

      {/* Dialogs */}
      {showDataTable && <DataTable onClose={() => setShowDataTable(false)} />}
      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}
      {showAbout && <AboutDialog onClose={() => setShowAbout(false)} />}

      {/* Drag & Drop Overlay */}
      <DragDropOverlay isVisible={isDragging} />
    </div>
  );
}

/**
 * Main Window with Context Provider
 */
export function MainWindow() {
  return (
    <PLCStateProvider>
      <MainWindowContent />
    </PLCStateProvider>
  );
}
