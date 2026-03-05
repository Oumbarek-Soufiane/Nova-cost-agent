// frontend/src/components/Sidebar.jsx
export default function Sidebar({ nav, setNav, alerts, recos, backendOk, totalSaved }) {
  const navItems = [
    { id: "overview", ic: "O", label: "Overview" },
    { id: "alerts",   ic: "!", label: "Alerts",          badge: alerts.length },
    { id: "recos",    ic: ">", label: "Recommendations", badge: recos.length  },
    { id: "services", ic: "=", label: "Services" },
  ];
  const integrations = [
    { id: "mcp",   ic: "#", label: "MCP Tools",   badge: "9",  info: true },
    { id: "setup", ic: "S", label: "Setup Guide", badge: backendOk === true ? "ok" : backendOk === false ? "!" : "?", info: backendOk !== false },
  ];
  return (
    <div className="side">
      <div className="slbl">Navigation</div>
      {navItems.map((n) => (
        <div key={n.id} className={"nav" + (nav === n.id ? " on" : "")} onClick={() => setNav(n.id)}>
          <span className="nic">{n.ic}</span>
          {n.label}
          {n.badge != null && <span className="nbg">{n.badge}</span>}
        </div>
      ))}
      <div className="slbl" style={{ marginTop: 10 }}>Integrations</div>
      {integrations.map((n) => (
        <div key={n.id} className={"nav" + (nav === n.id ? " on" : "")} onClick={() => setNav(n.id)}>
          <span className="nic">{n.ic}</span>
          {n.label}
          {n.badge && <span className={"nbg" + (n.info ? " info" : "")}>{n.badge}</span>}
        </div>
      ))}
      {totalSaved > 0 && (
        <div className="save-box">
          <div className="save-lbl">Session Savings</div>
          <div className="save-val">${totalSaved.toLocaleString()}</div>
          <div className="save-sub">realised via MCP</div>
        </div>
      )}
    </div>
  );
}
