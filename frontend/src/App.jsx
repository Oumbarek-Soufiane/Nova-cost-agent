// frontend/src/App.jsx
import { useState, useCallback } from "react";
import { useAgent }         from "./hooks/useAgent.js";
import { HOURS, SERVICES, MCP_LIST } from "./data/staticData.js";
import Header          from "./components/Header.jsx";
import Sidebar         from "./components/Sidebar.jsx";
import Chart           from "./components/Chart.jsx";
import AlertList       from "./components/AlertList.jsx";
import AgentConsole    from "./components/AgentConsole.jsx";
import Recommendations from "./components/Recommendations.jsx";
import ServicesTable   from "./components/ServicesTable.jsx";
import McpTools        from "./components/McpTools.jsx";
import SetupGuide      from "./components/SetupGuide.jsx";
import Toast           from "./components/Toast.jsx";

export default function App() {
  const [nav,        setNav]        = useState("overview");
  const [backendUrl, setBackendUrl] = useState("http://localhost:3001");
  const [toasts,     setToasts]     = useState([]);

  const agent = useAgent(backendUrl);

  const addToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  }, []);

  const handleRun = async () => {
    const result = await agent.runAnalysis();
    if (result.error) addToast("Error: " + result.error, "error");
    else addToast("Nova done — " + result.count + " recommendations ready", "success");
  };

  const handleExecute = async (idx) => {
    addToast("Dispatching MCP action...", "warning");
    const savings = await agent.executeReco(idx);
    addToast("Done — " + savings + " saved", "success");
  };

  return (
    <div className="app">
      <Header agentState={agent.agentState} />

      <div className="layout">
        <Sidebar
          nav={nav} setNav={setNav}
          alerts={agent.alerts} recos={agent.recos}
          backendOk={agent.backendOk} totalSaved={agent.totalSaved}
        />

        <div className="content">
          {/* Connect bar */}
          <div className="cbar">
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            
            </div>
            <button className="btn-run" onClick={handleRun} disabled={agent.analyzing}>
              {agent.analyzing ? "Analyzing..." : "Run Nova Analysis"}
            </button>
          </div>

          {nav === "setup" && <SetupGuide backendOk={agent.backendOk} />}

          {nav !== "setup" && (
            <>
              {/* Stats */}
              <div className="stats">
                {[
                  { lbl: "Hourly Spend",   val: "$3,865", sub: "+247% baseline",   cls: "r", sc: "up" },
                  { lbl: "Nova Actions",   val: "47",     sub: "12 auto-executed", cls: "b", sc: ""   },
                  { lbl: "Savings Found",  val: "$6,240", sub: "per day potential",cls: "g", sc: "dn" },
                  { lbl: "Anomalies",      val: String(agent.alerts.filter((a) => a.type === "critical").length), sub: agent.alerts.length + " total", cls: "a", sc: "" },
                ].map((s, i) => (
                  <div key={i} className={"sc " + s.cls}>
                    <div className="sc-lbl">{s.lbl}</div>
                    <div className="sc-val">{s.val}</div>
                    <div className={"sc-sub " + s.sc}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Chart + Alerts */}
              <div className="two">
                <div className="panel">
                  <div className="ph">
                    <div className="pt">AWS Billing — 24h</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--red)" }}>2 spikes</div>
                  </div>
                  <div className="pb"><Chart data={HOURS} /></div>
                </div>
                <div className="panel">
                  <div className="ph">
                    <div className="pt">Live Alerts</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--t3)" }}>{agent.alerts.length} active</div>
                  </div>
                  <div className="pb"><AlertList alerts={agent.alerts} /></div>
                </div>
              </div>

              {/* Agent console + Recommendations */}
              <div className="arow">
                <AgentConsole
                  logs={agent.logs} analyzing={agent.analyzing}
                  thinking={agent.thinking} novaOut={agent.novaOut}
                  consoleRef={agent.consoleRef}
                />
                <Recommendations
                  recos={agent.recos} analyzing={agent.analyzing}
                  onExecute={handleExecute}
                  onDefer={(name) => addToast("Deferred: " + name, "info")}
                  onDismiss={(i) => { agent.recos.splice(i, 1); addToast("Dismissed", "info"); }}
                />
              </div>

              <ServicesTable services={SERVICES} />
              <McpTools tools={MCP_LIST} />
            </>
          )}
        </div>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
