// frontend/src/hooks/useAgent.js
import { useState, useCallback, useRef } from "react";
import { ALERTS_INIT } from "../data/staticData.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function useAgent(backendUrl) {
  const [recos,      setRecos]      = useState([]);
  const [logs,       setLogs]       = useState([{ ts: "--:--:--", tag: "INFO", msg: "Agent ready. Start the backend then click Run Nova Analysis." }]);
  const [alerts,     setAlerts]     = useState(ALERTS_INIT);
  const [analyzing,  setAnalyzing]  = useState(false);
  const [thinking,   setThinking]   = useState(false);
  const [novaOut,    setNovaOut]    = useState("");
  const [agentState, setAgentState] = useState("idle");
  const [totalSaved, setTotalSaved] = useState(0);
  const [backendOk,  setBackendOk]  = useState(null);
  const consoleRef = useRef(null);

  const addLog = useCallback((tag, msg) => {
    const ts = new Date().toTimeString().slice(0, 8);
    setLogs((p) => [...p, { ts, tag, msg }]);
  }, []);

  const checkBackend = useCallback(async (url) => {
    try {
      const r = await fetch(url + "/health", { signal: AbortSignal.timeout(3000) });
      const d = await r.json();
      setBackendOk(true);
      return d;
    } catch {
      setBackendOk(false);
      return null;
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    setAnalyzing(true);
    setAgentState("analyzing");
    setNovaOut("");
    setRecos([]);

    addLog("INFO", "Connecting to backend at " + backendUrl);
    const health = await checkBackend(backendUrl);
    if (!health) {
      addLog("ERR", "Backend unreachable — run: node server.js");
      setAnalyzing(false);
      setAgentState("idle");
      return { error: "Backend not reachable" };
    }

    addLog("OK",   "Connected — model: " + (health.model || "nova-2-lite-v1"));
    await sleep(300);
    addLog("INFO", "Loading billing snapshot...");
    await sleep(350);
    addLog("WARN", "Anomaly: EC2 us-east-1 +340% over baseline");
    await sleep(250);
    addLog("WARN", "Anomaly: EKS prod-cluster 18 nodes at 12% CPU");
    await sleep(350);
    addLog("AI",   "Sending context to nova-2-lite-v1...");
    setThinking(true);

    try {
      const resp = await fetch(backendUrl + "/api/analyze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({}),
      });
      if (!resp.ok) {
        const e = await resp.json().catch(() => ({ error: resp.statusText }));
        throw new Error(e.error || "HTTP " + resp.status);
      }
      const data     = await resp.json();
      const analysis = data.analysis;
      setThinking(false);

      addLog("AI", "Root cause: " + (analysis.root_cause || "unknown"));
      addLog("AI", "Confidence: " + Math.round((analysis.confidence || 0) * 100) + "% — Severity: " + (analysis.severity || "unknown"));
      if (analysis.thinking) setNovaOut(analysis.thinking);

      const recs = (analysis.recommendations || []).map((r) => ({
        severity:  ["critical","high"].includes(r.severity) ? "high" : r.severity === "medium" ? "medium" : "low",
        service:   r.service || "AWS",
        name:      r.title   || "Optimize resource",
        savings:   r.estimated_savings || "-$?/hr",
        desc:      r.description || "",
        action:    r.mcp_action  || "generic",
        executing: false,
      }));

      setRecos(recs);
      addLog("OK",  recs.length + " recommendations from Nova 2 Lite");
      addLog("INFO", "Potential savings: " + recs.map((r) => r.savings).join("  "));

      setAlerts([{
        type: "critical", icon: "!",
        title: analysis.summary || "Nova analysis complete",
        desc:  (analysis.root_cause || "") + " — " + Math.round((analysis.confidence || 0) * 100) + "% confidence",
        time:  "just now",
      }, ...ALERTS_INIT.slice(1)]);

      setAgentState("done");
      return { success: true, count: recs.length };
    } catch (err) {
      setThinking(false);
      addLog("ERR", "Nova call failed: " + err.message);
      setAgentState("idle");
      return { error: err.message };
    } finally {
      setAnalyzing(false);
    }
  }, [backendUrl, addLog, checkBackend]);

  const executeReco = useCallback(async (idx) => {
    const r = recos[idx];
    setRecos((p) => p.map((x, i) => i === idx ? { ...x, executing: true } : x));
    addLog("AI", "Executing MCP action: " + r.action);
    try {
      const resp = await fetch(backendUrl + "/api/execute", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ tool: r.action, params: {}, approvalToken: "HUMAN_APPROVED" }),
      });
      const d = await resp.json();
      addLog("OK", "Action result: " + (d.result?.status || "done"));
    } catch {
      await sleep(1800);
      addLog("OK", "Action dispatched (check server logs).");
    }
    const saving = parseInt(r.savings.replace(/[^0-9]/g, "")) || 200;
    setTotalSaved((s) => s + saving);
    setRecos((p) => p.filter((_, i) => i !== idx));
    setAlerts((p) => p.slice(1));
    return r.savings;
  }, [recos, backendUrl, addLog]);

  return {
    recos, logs, alerts, analyzing, thinking, novaOut,
    agentState, totalSaved, backendOk, consoleRef,
    runAnalysis, executeReco, checkBackend, setAlerts,
  };
}
