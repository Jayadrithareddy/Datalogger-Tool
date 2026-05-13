import { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Settings, 
  Thermometer, 
  Battery, 
  Search, 
  Play, 
  Square, 
  Download, 
  FileText, 
  RefreshCw, 
  ChevronDown, 
  Info, 
  CheckCircle,
  AlertTriangle,
  FileClock
} from 'lucide-react';
import './index.css';

type ConnectionState = 'DISCONNECTED' | 'CONNECTED' | 'SYNCING' | 'READY' | 'LOGGING' | 'RETRIEVING';

export default function App() {
  const [appState, setAppState] = useState<ConnectionState>('DISCONNECTED');
  const [comPort, setComPort] = useState('COM3');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParams, setSelectedParams] = useState<Set<string>>(new Set(['battery_voltage', 'engine_speed', 'coolant_temp']));
  const [retrievalProgress, setRetrievalProgress] = useState(0);
  const [logDuration, setLogDuration] = useState(0);
  const [packetsReceived, setPacketsReceived] = useState(0);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Mock data for telemetry
  const telemetryData = {
    rpm: appState === 'LOGGING' ? 1500 + Math.floor(Math.random() * 50) : 0,
    battery: appState === 'LOGGING' ? 24.2 + (Math.random() * 0.2) : 0,
    coolant: appState === 'LOGGING' ? 78 + Math.floor(Math.random() * 2) : 0,
    fuel: 65,
  };

  useEffect(() => {
    let interval: number;
    if (appState === 'LOGGING') {
      interval = window.setInterval(() => {
        setLogDuration(prev => prev + 1);
        setPacketsReceived(prev => prev + Math.floor(Math.random() * 10) + 5);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleConnect = () => {
    setAppState('SYNCING');
    setTimeout(() => {
      setAppState('READY');
      showNotification('success', 'Connected and synced successfully');
    }, 2000);
  };

  const handleDisconnect = () => {
    setAppState('DISCONNECTED');
  };

  const handleStartLog = () => {
    setAppState('LOGGING');
    setLogDuration(0);
    setPacketsReceived(0);
    showNotification('success', 'Logging Started Successfully');
  };

  const handleStopLog = () => {
    setAppState('READY');
    showNotification('success', 'Logging Stopped. Ready for retrieval.');
  };

  const handleRetrieve = () => {
    setAppState('RETRIEVING');
    setRetrievalProgress(0);
    
    const interval = setInterval(() => {
      setRetrievalProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAppState('READY');
          showNotification('success', 'Data Retrieved Successfully');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleParam = (id: string) => {
    const newSet = new Set(selectedParams);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedParams(newSet);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="brand">
          <Activity className="brand-accent" />
          KRM Datalogger <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>v2.2.0</span>
        </div>
        
        <div className="connection-bar">
          <select 
            className="search-input" 
            style={{ width: '120px', padding: '6px 10px' }}
            value={comPort}
            onChange={(e) => setComPort(e.target.value)}
          >
            <option value="COM1">COM1</option>
            <option value="COM3">COM3</option>
            <option value="COM4">COM4</option>
          </select>
          
          <button className="btn" title="Refresh Ports">
            <RefreshCw size={16} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', minWidth: '180px' }}>
            <div className={`status-indicator ${appState !== 'DISCONNECTED' ? (appState === 'SYNCING' ? 'syncing' : 'connected') : ''}`} />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              {appState === 'DISCONNECTED' ? 'Disconnected' : 
               appState === 'SYNCING' ? 'Syncing...' : 
               'Connected to STM32 Device'}
            </span>
          </div>

          {appState === 'DISCONNECTED' ? (
            <button className="btn btn-primary" onClick={handleConnect}>Connect</button>
          ) : (
            <button className="btn btn-danger" onClick={handleDisconnect}>Disconnect</button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* LEFT PANEL */}
        <aside className="panel-left card">
          <div className="card-title">
            Select Parameters ({selectedParams.size}/28)
          </div>
          
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filter parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="presets" style={{ marginTop: '4px' }}>
            <span className="preset-chip active">Engine Health</span>
            <span className="preset-chip">Full Diagnostics</span>
            <span className="preset-chip">Electrical</span>
          </div>

          <div style={{ marginTop: '12px', overflowY: 'auto', paddingRight: '4px' }}>
            {/* Category: Engine */}
            <div className="category-group">
              <div className="category-header">
                <Settings className="category-icon" size={16} />
                <span>Engine</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>6 params</span>
                <ChevronDown size={16} />
              </div>
              <div className="parameter-list">
                <label className={`parameter-item ${searchQuery && 'Total Engine Hours'.toLowerCase().includes(searchQuery.toLowerCase()) ? 'highlighted' : ''}`}>
                  <div className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" checked={selectedParams.has('engine_hours')} onChange={() => toggleParam('engine_hours')} />
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>Total Engine Hours</span>
                </label>
                <label className="parameter-item">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" checked={selectedParams.has('engine_speed')} onChange={() => toggleParam('engine_speed')} />
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>Average Engine Speed</span>
                </label>
                <label className="parameter-item">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" checked={selectedParams.has('coolant_temp')} onChange={() => toggleParam('coolant_temp')} />
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>Engine Coolant Temperature</span>
                  <span className="parameter-info-icon" title="Shows real-time coolant temp"><Info size={14} /></span>
                </label>
              </div>
            </div>

            {/* Category: Alternator */}
            <div className="category-group">
              <div className="category-header">
                <Zap className="category-icon" size={16} />
                <span>Alternator</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>4 params</span>
                <ChevronDown size={16} />
              </div>
              <div className="parameter-list">
                <label className="parameter-item">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" checked={selectedParams.has('alt_freq')} onChange={() => toggleParam('alt_freq')} />
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>Alternating Average Frequency</span>
                </label>
                <label className="parameter-item">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" checked={selectedParams.has('alt_current')} onChange={() => toggleParam('alt_current')} />
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>Alternating Average Current</span>
                </label>
              </div>
            </div>
            
            {/* Category: Battery */}
            <div className="category-group">
              <div className="category-header">
                <Battery className="category-icon" size={16} />
                <span>Battery</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>2 params</span>
                <ChevronDown size={16} />
              </div>
              <div className="parameter-list">
                <label className="parameter-item">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" checked={selectedParams.has('battery_voltage')} onChange={() => toggleParam('battery_voltage')} />
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>Battery Voltage</span>
                  <span className="parameter-info-icon" title="Shows real-time battery health voltage"><Info size={14} /></span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER PANEL */}
        <section className="panel-center">
          {/* State Machine Visualization */}
          <div className="state-tracker card">
            <div className={`state-step ${appState !== 'DISCONNECTED' ? 'active' : ''}`}>
              <div className="step-icon"><Zap size={14} /></div>
              <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Connected</span>
            </div>
            <div className={`state-step ${['SYNCING', 'READY', 'LOGGING', 'RETRIEVING'].includes(appState) ? 'active' : ''}`}>
              <div className="step-icon"><RefreshCw size={14} className={appState === 'SYNCING' ? 'spin' : ''} /></div>
              <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Syncing</span>
            </div>
            <div className={`state-step ${['READY', 'LOGGING', 'RETRIEVING'].includes(appState) ? 'active' : ''}`}>
              <div className="step-icon"><CheckCircle size={14} /></div>
              <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Ready</span>
            </div>
            <div className={`state-step ${appState === 'LOGGING' ? 'active' : ''}`}>
              <div className="step-icon"><Activity size={14} /></div>
              <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Logging</span>
            </div>
          </div>

          {/* Telemetry */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Live Telemetry Preview</span>
              {appState === 'LOGGING' && (
                <div className="waveform-container active">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              )}
            </div>
            
            {appState === 'DISCONNECTED' ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Connect device to view telemetry
              </div>
            ) : (
              <div className="telemetry-grid">
                <div className="telemetry-card">
                  <Settings size={24} color="var(--text-muted)" style={{ position: 'absolute', top: 12, right: 12, opacity: 0.2 }} />
                  <span className="telemetry-label">Engine Speed</span>
                  <div className="telemetry-value">
                    {telemetryData.rpm} <span className="telemetry-unit">RPM</span>
                  </div>
                </div>
                
                <div className="telemetry-card">
                  <Battery size={24} color="var(--text-muted)" style={{ position: 'absolute', top: 12, right: 12, opacity: 0.2 }} />
                  <span className="telemetry-label">Battery</span>
                  <div className="telemetry-value">
                    {telemetryData.battery.toFixed(1)} <span className="telemetry-unit">V</span>
                  </div>
                </div>
                
                <div className="telemetry-card">
                  <Thermometer size={24} color="var(--text-muted)" style={{ position: 'absolute', top: 12, right: 12, opacity: 0.2 }} />
                  <span className="telemetry-label">Coolant Temp</span>
                  <div className="telemetry-value">
                    {telemetryData.coolant} <span className="telemetry-unit">°C</span>
                  </div>
                </div>

                <div className="telemetry-card">
                  <Zap size={24} color="var(--text-muted)" style={{ position: 'absolute', top: 12, right: 12, opacity: 0.2 }} />
                  <span className="telemetry-label">Fuel Level</span>
                  <div className="telemetry-value">
                    {telemetryData.fuel} <span className="telemetry-unit">%</span>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              {notification && (
                <div className={`notification ${notification.type}`}>
                  {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  {notification.message}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="panel-right">
          <div className="card control-group">
            <div className="card-title">Controls</div>
            <button 
              className={`btn ${appState === 'LOGGING' ? 'btn-primary active' : 'btn-primary'}`} 
              disabled={appState !== 'READY' && appState !== 'LOGGING'}
              onClick={handleStartLog}
              title={appState === 'DISCONNECTED' ? 'Connect device first' : ''}
            >
              <Play size={16} /> Start Log
            </button>
            
            <button 
              className="btn btn-danger" 
              disabled={appState !== 'LOGGING'}
              onClick={handleStopLog}
            >
              <Square size={16} /> Stop Log
            </button>
            
            <button 
              className="btn" 
              disabled={appState !== 'READY'}
              onClick={handleRetrieve}
            >
              <Download size={16} /> Retrieve Data
            </button>
            
            <button 
              className="btn" 
              disabled={appState !== 'READY'}
            >
              <FileText size={16} /> Export CSV
            </button>

            {appState === 'RETRIEVING' && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Retrieving Logs...</span>
                  <span>{retrievalProgress}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: `${retrievalProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Logging Status</div>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">State</span>
                <span className="status-value" style={{ color: appState === 'LOGGING' ? 'var(--primary)' : 'inherit' }}>
                  {appState}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Port</span>
                <span className="status-value">{comPort}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Parameters</span>
                <span className="status-value">{selectedParams.size}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Duration</span>
                <span className="status-value">{formatTime(logDuration)}</span>
              </div>
              <div className="status-item" style={{ gridColumn: '1 / -1' }}>
                <span className="status-label">Packets Received</span>
                <span className="status-value">{packetsReceived}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-stats">
          <span>Firmware: v1.4.2</span>
          <span>Baud Rate: 115200</span>
          <span>Packet Loss: 0.00%</span>
        </div>
        
        <div className="export-history">
          <span style={{ color: 'var(--text-main)' }}>Recent Exports:</span>
          <div className="history-item">
            <FileClock size={14} /> log_12May_10AM.csv
          </div>
          <div className="history-item">
            <FileClock size={14} /> engine_test.csv
          </div>
        </div>
      </footer>
    </div>
  );
}
