/**
 * Main Window Component
 * Main application layout
 * Converted from src/screens/HomePg.java
 */

import { useEffect } from 'react';
import { PLCStateProvider } from '../../context/PLCStateContext';
import { useExecutionCycle } from '../../hooks/useExecutionCycle';
import { useTheme } from '../../hooks/useTheme';
import '../../i18n/config';
import '../../styles/themes.css';
import '../../styles/globals.css';
import './MainWindow.css';

/**
 * Inner component that uses context
 */
function MainWindowContent() {
  const { theme } = useTheme();
  const executionCycle = useExecutionCycle();

  // Initialize i18n and theme on mount
  useEffect(() => {
    console.log('PLC Simulator initialized');
    console.log('Theme:', theme);
    console.log('Execution cycle:', executionCycle.mode);
  }, [theme, executionCycle.mode]);

  return (
    <div className="main-window">
      {/* Top Bar - Menu and Controls */}
      <div className="main-window__top-bar">
        <div className="main-window__menu">
          {/* Menu will go here */}
          <div className="placeholder">Menu Bar</div>
        </div>
        <div className="main-window__controls">
          {/* Control buttons will go here */}
          <div className="placeholder">Control Panel</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-window__content">
        {/* Left Side - Code Editor */}
        <div className="main-window__editor">
          <div className="placeholder">Code Editor</div>
        </div>

        {/* Right Side - Scene and Status */}
        <div className="main-window__right">
          {/* Scene Area */}
          <div className="main-window__scene">
            <div className="placeholder">Scene (I/O or Batch Simulation)</div>
          </div>

          {/* Status Panel */}
          <div className="main-window__status">
            <div className="placeholder">Status (Timers/Counters)</div>
          </div>
        </div>
      </div>

      {/* Footer - Optional status bar */}
      <div className="main-window__footer">
        <span>Mode: {executionCycle.mode}</span>
        <span>Theme: {theme}</span>
      </div>
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
