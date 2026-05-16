import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Play, 
  Square, 
  Download, 
  FileText, 
  RefreshCw,
  Sun,
  Moon,
  Activity,
  Zap,
  BarChart2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './index.css';

type ConnectionState = 'DISCONNECTED' | 'CONNECTED' | 'SYNCING' | 'READY' | 'LOGGING' | 'RETRIEVING';

export default function App() {
  const [appState, setAppState] = useState<ConnectionState>('DISCONNECTED');
  const [comPort, setComPort] = useState('COM4');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParams, setSelectedParams] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<{id: number, type: 'success' | 'error' | 'info', message: string}[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({ alternator: true, engine: true });
  
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Parameters list
  const alternatorParams = [
    { id: 'alt_freq', label: 'Alternating Average Frequency' },
    { id: 'alt_pf', label: 'Alternating Average PF' },
    { id: 'alt_load', label: 'Alternating Load Percent Active' },
    { id: 'alt_current', label: 'Alternating Average Current' },
  ];

  const engineParams = [
    { id: 'eng_hours', label: 'Total Engine Hours' },
    { id: 'eng_fuel', label: 'GCU Fuel Level' },
    { id: 'eng_temp', label: 'Engine Coolant Temperature' },
    { id: 'eng_speed', label: 'Average Engine Speed' },
    { id: 'eng_oil', label: 'Oil Pressure Value' },
    { id: 'eng_batt', label: 'Battery Voltage' },
  ];

  const totalParams = 28;

  const toggleParam = (id: string) => {
    const newSet = new Set(selectedParams);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedParams(newSet);
  };

  const selectAllInCategory = (categoryParams: {id: string}[], event: React.MouseEvent) => {
    event.stopPropagation();
    const newSet = new Set(selectedParams);
    const allSelected = categoryParams.every(p => newSet.has(p.id));
    
    if (allSelected) {
      categoryParams.forEach(p => newSet.delete(p.id));
    } else {
      categoryParams.forEach(p => newSet.add(p.id));
    }
    setSelectedParams(newSet);
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Connection flow
  const handleConnect = () => {
    if (appState !== 'DISCONNECTED') {
      setAppState('DISCONNECTED');
      return;
    }
    
    setAppState('SYNCING');
    setTimeout(() => {
      setAppState('READY');
      showNotification('success', 'Connected and synced successfully');
    }, 1500);
  };

  const handleStartLog = () => {
    setAppState('LOGGING');
    showNotification('info', 'Logging Started Successfully');
  };

  const handleStopLog = () => {
    setAppState('READY');
    showNotification('info', 'Logging Stopped. Ready for retrieval.');
  };

  const handleRetrieve = () => {
    setAppState('RETRIEVING');
    showNotification('info', 'Retrieving Data...');
    setTimeout(() => {
      setAppState('READY');
      showNotification('info', 'Data Retrieved Successfully');
    }, 2000);
  };

  const handleExport = () => {
    showNotification('info', 'Exporting to CSV File...');
  };

  const toggleAccordion = (key: 'alternator' | 'engine') => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filterParams = (params: {id: string, label: string}[]) => {
    if (!searchQuery) return params;
    return params.filter(p => p.label.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredAlternator = filterParams(alternatorParams);
  const filteredEngine = filterParams(engineParams);
  
  const hasNoResults = searchQuery && filteredAlternator.length === 0 && filteredEngine.length === 0;


  // Count active selections for summary
  const engineSelected = engineParams.filter(p => selectedParams.has(p.id)).length;
  const alternatorSelected = alternatorParams.filter(p => selectedParams.has(p.id)).length;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="brand-logo">
            <div className="brand-name">
              <span className="brand-k">k</span>
              <span className="brand-text">irloskar</span>
            </div>
            <div className="brand-sub">electrical & electronics</div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="header-title-container">
            <div className="header-separator"></div>
            <h1 className="header-title">Datalogger Tool</h1>
          </div>
        </div>
        
        <div className="header-right">
          <div className="version-pill">v2.1.0</div>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        
        {/* Left Column - Parameters */}
        <div className="left-column">
          {/* Notifications scoped to Parameter Configuration card */}
          <div className="left-column-inner">
            <div className="config-header">
              <div className="pt-2">
                <BarChart2 size={22} className="text-accent-green" />
              </div>
              <div className="config-title-container">
                <div className="config-title">
                  Parameter Configuration
                </div>
              </div>
            </div>

            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Filter parameters..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {hasNoResults ? (
              <div className="empty-state">
                <AlertCircle className="empty-state-icon" />
                <div className="empty-state-title">No parameters found</div>
                <div className="empty-state-subtitle">Try adjusting your search query</div>
              </div>
            ) : (
              <div className="parameters-list">
                {/* Alternator Category */}
                {(filteredAlternator.length > 0 || !searchQuery) && (
                  <div className={`accordion ${openAccordions.alternator ? 'is-open' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleAccordion('alternator')}>
                      <div className="accordion-title">
                        <Activity className="icon-alternator" size={20} />
                        <span>Alternator</span>
                        <div className="param-chip">{alternatorParams.length} Parameters</div>
                      </div>
                      <div className="accordion-actions">
                        <button className="btn-all" onClick={(e) => selectAllInCategory(alternatorParams, e)}>
                          ALL
                        </button>
                        <ChevronDown size={18} className={`caret ${openAccordions.alternator ? 'open' : ''}`} />
                      </div>
                    </div>
                    
                    <div className={`accordion-content-wrapper ${openAccordions.alternator ? 'is-open' : ''}`}>
                      <div className="accordion-content">
                        {filteredAlternator.map(param => (
                          <label key={param.id} className={`param-row ${selectedParams.has(param.id) ? 'selected' : ''}`}>
                            <div className="checkbox-container">
                              <input 
                                type="checkbox" 
                                checked={selectedParams.has(param.id)}
                                onChange={() => toggleParam(param.id)}
                              />
                              <div className="checkmark">
                                <svg className="checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span className="param-label">{param.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Engine Category */}
                {(filteredEngine.length > 0 || !searchQuery) && (
                  <div className={`accordion ${openAccordions.engine ? 'is-open' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleAccordion('engine')}>
                      <div className="accordion-title">
                        <Zap className="icon-engine" size={20} />
                        <span>Engine</span>
                        <div className="param-chip">{engineParams.length} Parameters</div>
                      </div>
                      <div className="accordion-actions">
                        <button className="btn-all" onClick={(e) => selectAllInCategory(engineParams, e)}>
                          ALL
                        </button>
                        <ChevronDown size={18} className={`caret ${openAccordions.engine ? 'open' : ''}`} />
                      </div>
                    </div>
                    
                    <div className={`accordion-content-wrapper ${openAccordions.engine ? 'is-open' : ''}`}>
                      <div className="accordion-content">
                        {filteredEngine.map(param => (
                          <label key={param.id} className={`param-row ${selectedParams.has(param.id) ? 'selected' : ''}`}>
                            <div className="checkbox-container">
                              <input 
                                type="checkbox" 
                                checked={selectedParams.has(param.id)}
                                onChange={() => toggleParam(param.id)}
                              />
                              <div className="checkmark">
                                <svg className="checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span className="param-label">{param.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="bottom-action-bar">
            <div className="selection-summary">
              <div className="summary-count">
                <span className="text-accent-green">{selectedParams.size}</span> / {totalParams} Selected
              </div>
              
              {selectedParams.size > 0 && (
                <div className="summary-details">
                  {engineSelected > 0 && (
                    <div className="summary-chip">
                      <Zap size={14} className="icon-engine" /> 
                      Engine: {engineSelected}
                    </div>
                  )}
                  {alternatorSelected > 0 && (
                    <div className="summary-chip">
                      <Activity size={14} className="icon-alternator" /> 
                      Alternator: {alternatorSelected}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bottom-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedParams(new Set())}
                disabled={selectedParams.size === 0}
              >
                Deselect All
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => showNotification('success', 'Selection Applied')}
                disabled={selectedParams.size === 0}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Controls & Status */}
        <div className="right-column">
          
          {/* Connection */}
          <div className="card control-panel">
            <div className="section-label">CONNECTION</div>
            <div className="com-row">
              <select 
                className="com-select" 
                value={comPort} 
                onChange={(e) => setComPort(e.target.value)}
                disabled={appState !== 'DISCONNECTED'}
              >
                <option value="COM3">COM3</option>
                <option value="COM4">COM4</option>
              </select>
              <button className="btn-icon" onClick={handleConnect} title={appState === 'DISCONNECTED' ? "Connect" : "Disconnect"}>
                <RefreshCw size={20} className={appState === 'SYNCING' ? 'spin' : ''} />
              </button>
            </div>

            {appState === 'DISCONNECTED' ? (
              <>
                <div className="alert alert-disconnected cursor-pointer" onClick={handleConnect}>
                  <div className="alert-dot dot-red"></div>
                  USB Disconnected
                </div>
                <div className="alert alert-error">
                  <AlertCircle size={16} /> Error: port unavailable
                </div>
              </>
            ) : (
              <div className="alert alert-success cursor-pointer" onClick={handleConnect}>
                <div className="alert-dot dot-green"></div>
                {appState === 'SYNCING' ? 'Syncing...' : 'USB Connected'}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="card control-panel">
            <div className="section-label">CONTROLS</div>
            <div className="controls-stack">
              <button 
                className="btn-control btn-start"
                onClick={handleStartLog}
                disabled={appState !== 'READY' && appState !== 'LOGGING'}
              >
                <Play size={18} fill="currentColor" /> Start Log
              </button>
              
              <button 
                className="btn-control btn-stop"
                onClick={handleStopLog}
                disabled={appState !== 'LOGGING'}
              >
                <Square size={18} fill="currentColor" /> Stop Log
              </button>
              
              <button 
                className="btn-control"
                onClick={handleRetrieve}
                disabled={appState === 'DISCONNECTED'}
              >
                <Download size={18} /> Retrieve Data
              </button>
              
              <button 
                className="btn-control"
                onClick={handleExport}
                disabled={appState === 'DISCONNECTED'}
              >
                <FileText size={18} /> Export CSV
              </button>
            </div>
          </div>

          {/* Notifications / Messages Area */}
          <div className="messages-area">
            {notifications.length > 0 ? (
              <div className="notification-list">
                {notifications.map(note => (
                  <div key={note.id} className={`alert alert-${note.type} animate-slide-in`}>
                    {note.type === 'success' && <CheckCircle2 size={18} />}
                    {note.type === 'error' && <AlertCircle size={18} />}
                    {note.type === 'info' && <Activity size={18} />}
                    {note.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message-state">
                <div className="status-placeholder">
                  <div className="alert-dot status-dot-placeholder"></div>
                  <span>System Messages</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
