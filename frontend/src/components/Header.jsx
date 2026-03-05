// frontend/src/components/Header.jsx
import { useState, useEffect } from "react";

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span className="tc">{t.toUTCString().slice(17, 25)} UTC</span>;
}

export default function Header({ agentState }) {
  const dotCls  = agentState === "analyzing" ? "a" : "g";
  const dotText = agentState === "analyzing" ? "ANALYZING" : agentState === "done" ? "DONE" : "ONLINE";
  return (
    <div className="hdr">
      <div className="hdr-l">
        <div className="hex">N</div>
        <div>
          <div className="logo">NOVA COST AGENT</div>
          <div className="logo-sub">Powered by Nova 2 Lite via nova.amazon.com</div>
        </div>
      </div>
      <div className="hdr-r">
        <div className="pill">
          <div className={"dot " + dotCls} />
          {dotText}
        </div>
        <div className="nova-badge">nova-2-lite-v1</div>
        <Clock />
      </div>
    </div>
  );
}
