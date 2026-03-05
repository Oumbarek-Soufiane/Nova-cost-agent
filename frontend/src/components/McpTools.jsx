// frontend/src/components/McpTools.jsx
export default function McpTools({ tools }) {
  return (
    <div className="panel">
      <div className="ph">
        <div className="pt">MCP Tool Registry</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)" }}>
          {tools.filter((t) => t.status === "connected").length}/{tools.length} connected
        </div>
      </div>
      <div className="mcpg">
        {tools.map((t, i) => (
          <div key={i} className="mcpi">
            <div className="mcpn">{t.name}</div>
            <div className="mcps">
              <div className={"md " + t.status} />
              <span style={{ color: t.status === "connected" ? "var(--green)" : "var(--amber)" }}>{t.status}</span>
            </div>
            <div className="mcc">{t.calls} calls today</div>
          </div>
        ))}
      </div>
    </div>
  );
}
