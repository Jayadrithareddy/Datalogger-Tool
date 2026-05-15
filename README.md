# KRM Datalogger Dashboard UI

A modern, industrial-grade React dashboard for real-time telemetry monitoring, data logging, and hardware communication. The UI is built entirely with Vanilla CSS and React, designed specifically for interacting with embedded systems (e.g., STM32 devices) over serial connections.

## 🚀 Overview

The KRM Datalogger Tool provides an intelligent and highly responsive interface designed to replace static embedded tools with a dynamic, SCADA-like monitoring experience. It includes real-time telemetry rendering, dynamic parameter selection, and state-machine-driven controls.

## ✨ Key Features & UI Improvements

Based on extensive UI/UX design updates, this application implements the following 14 major improvements:

1. **Enhanced Connection Visibility**
   - High-contrast COM port selector.
   - Glowing connection status indicators (`Connected`, `Syncing`, `Disconnected`).
   - Dedicated refresh button for scanning hardware ports.

2. **Real-Time State Machine Tracker**
   - Live horizontal workflow visualization highlighting current operational states: `Connected → Syncing → Ready → Logging`.

3. **Intelligent Parameter Selection**
   - Categorized parameter selection using intuitive icons (`Engine`, `Alternator`, `Battery`).
   - "Select Recommended" presets (e.g., Engine Health, Electrical, Full Diagnostics).
   - Live search with instant text highlighting.
   - Informative tooltips on complex parameters.

4. **Dynamic Logging Controls**
   - Animated **Start Log** button with a neon green pulse when active.
   - Intelligent button states (disabled when not applicable).
   - Animated progress bars displaying exactly how much data has been retrieved from the hardware.

5. **Live Logging Status Card**
   - Instantly view the current operational state, selected parameter count, active COM port, precise log duration, and total data packets received during a session.

6. **Live Telemetry Preview**
   - Bold, industrial-grade mini cards showing real-time mock telemetry:
     - **RPM**
     - **Battery Voltage (V)**
     - **Coolant Temp (°C)**
     - **Fuel Level (%)**
   - Animated visual waveforms that trigger exclusively while logging is active.

7. **Professional Visual Hierarchy**
   - Structured styling with high contrast headings, subtle card elevations, and clean dividers to differentiate workspaces without clutter.

8. **Enhanced User Feedback**
   - Integrated floating toast notifications for Success and Error messages (e.g., *"Logging Started Successfully"*).
   - Hover tooltips on disabled elements to guide the user (e.g., *"Connect device first"*).

9. **Export History & Session Info**
   - Footer panel showing recent CSV exports, current firmware version, connection baud rate, and packet loss statistics.

10. **Responsive 3-Panel Layout**
    - **Header:** Connection Bar + Status
    - **Left Sidebar:** Parameter Selection & Search
    - **Center Stage:** Live Telemetry & Workflow State Tracker
    - **Right Sidebar:** Direct Controls & Logging Status
    - **Footer:** Session Diagnostics & Export History

## 🧠 Application State Machine

The application relies on a strict internal state machine to dictate which UI controls are active. 

* `DISCONNECTED` - Base state. Requires hardware connection.
* `CONNECTED` - Port opened successfully.
* `SYNCING` - Exchanging handshakes/configuration with the hardware.
* `READY` - Hardware configured and idling. Ready to start logging or retrieve historical data.
* `LOGGING` - Actively receiving and parsing real-time telemetry packets.
* `RETRIEVING` - Pulling stored data chunks into memory (shows progress bar).

## 🛠 Technical Stack

* **Core Framework:** React 18 + Vite
* **Language:** TypeScript (`.tsx`)
* **Styling:** Pure Vanilla CSS (`index.css`)
* **Icons:** Lucide-React

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm

### Installation
1. Clone the repository or navigate to the project directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Running Locally
To spin up the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in your browser. The page will reload when you make code changes.

### Building for Production
To build the application for a production environment:
```bash
npm run build
```
This generates the optimized bundle in the `dist` folder.

## 📂 Project Structure

```text
├── src/
│   ├── App.tsx          # Main Application Component & State Logic
│   ├── index.css        # Global Styles, Design Tokens & Layout CSS
│   ├── App.css          # Additional localized styles
│   └── main.tsx         # React DOM Entry Point
├── package.json         # Dependencies & Scripts
├── tsconfig.json        # TypeScript Configuration
└── README.md            # This documentation file
```

---
*Built to deliver premium, reliable diagnostics for hardware monitoring systems.*