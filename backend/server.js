// backend/server.js
import "dotenv/config";
import express from "express";
import cors    from "cors";
import { callNova, streamNova, NOVA_MODEL } from "./novaClient.js";
import { getBillingData, getMetrics }       from "./mockData.js";

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a senior AWS FinOps engineer and autonomous cost optimization agent.
Analyze billing anomalies, identify root causes, and produce specific infrastructure recommendations.
Respond ONLY with valid JSON — no markdown, no backticks, no text outside the JSON object.

Required structure:
{
  "thinking": "step-by-step reasoning 3-4 sentences",
  "root_cause": "specific root cause",
  "confidence": 0.94,
  "severity": "critical",
  "summary": "one-line executive summary",
  "recommendations": [
    {
      "id": "rec_001",
      "service": "EC2",
      "title": "short action title",
      "description": "detailed explanation with specific AWS resources and regions",
      "estimated_savings": "-$1,240/hr",
      "risk": "low",
      "safe_to_auto_execute": true,
      "mcp_action": "ec2.stop_instances",
      "severity": "high"
    }
  ]
}`;

// Health
app.get("/health", (_, res) => res.json({ status: "ok", model: NOVA_MODEL }));

// Full analysis
app.post("/api/analyze", async (req, res) => {
  console.log("[NOVA] Analysis started");
  try {
    const billing = getBillingData();
    const metrics = getMetrics();
    const userMsg = "Analyze this AWS cost anomaly and give 2-3 specific recommendations:\n\n" +
      "BILLING:\n" + JSON.stringify(billing, null, 2) + "\n\n" +
      "ANOMALIES:\n" + JSON.stringify(metrics, null, 2);

    const analysis = await callNova(SYSTEM_PROMPT, userMsg);
    console.log("[NOVA] root_cause:", analysis.root_cause);
    res.json({ success: true, model: NOVA_MODEL, analysis });
  } catch (err) {
    console.error("[ERROR]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// SSE streaming
app.get("/api/analyze/stream", async (req, res) => {
  res.setHeader("Content-Type",  "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection",    "keep-alive");
  try {
    await streamNova(res, "Analyze these AWS billing anomalies step by step: " + JSON.stringify(getBillingData()));
  } catch (err) {
    res.write("data: " + JSON.stringify({ error: err.message }) + "\n\n");
  }
  res.end();
});

// Execute MCP tool (human-gated)
app.post("/api/execute", async (req, res) => {
  const { tool, params, approvalToken } = req.body;
  if (approvalToken !== "HUMAN_APPROVED")
    return res.status(403).json({ error: "Requires approvalToken: HUMAN_APPROVED" });

  const supported = ["ec2.stop_instances", "ec2.terminate_instances", "eks.update_nodegroup", "asg.set_desired"];
  if (!supported.includes(tool))
    return res.status(400).json({ error: "Unknown tool: " + tool });

  console.log("[MCP]", tool, params);
  // TODO: replace with real AWS SDK calls
  res.json({ success: true, tool, result: { status: "executed" }, timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("\n  Nova Cost Agent — " + NOVA_MODEL);
  console.log("  http://localhost:" + PORT + "\n");
});
