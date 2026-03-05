# Nova Cost Agent
Agentic AWS Cloud Cost Optimizer powered by **nova-2-lite-v1** (nova.amazon.com)

## Structure
```
nova-cost-agent/
├── backend/
│   ├── server.js       # Express API server
│   ├── novaClient.js   # Nova 2 Lite API wrapper
│   ├── mockData.js     # Demo billing data
│   ├── package.json
│   └── env.example
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx             # Main orchestrator
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── Header.jsx
        │   ├── Sidebar.jsx
        │   ├── Chart.jsx
        │   ├── AlertList.jsx
        │   ├── AgentConsole.jsx
        │   ├── Recommendations.jsx
        │   ├── ServicesTable.jsx
        │   ├── McpTools.jsx
        │   ├── SetupGuide.jsx
        │   └── Toast.jsx
        ├── data/
        │   └── staticData.js
        └── hooks/
            └── useAgent.js
```

## Quick Start

### 1. Backend
```
cd backend
npm install
cp env.example .env     # add your Nova API key
node server.js          # http://localhost:3001
```

### 2. Frontend
```
cd frontend
npm install
npm run dev             # http://localhost:5173
```

### Get Nova API key
Go to https://nova.amazon.com/dev/api
Click the 3-dot menu on your key → View Secret Key
