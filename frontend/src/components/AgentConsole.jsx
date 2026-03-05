// frontend/src/components/AgentConsole.jsx
import { useEffect } from "react";

const TAG_CLASS = { AI: "ca", OK: "co", WARN: "cw", ERR: "ce", INFO: "ci" };

export default function AgentConsole({ logs, analyzing, thinking, novaOut, consoleRef }) {
  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [logs, consoleRef]);

  return (
    <div className="apanel">
      <div className="ph">
        <div className="pt">Agent Execution Log</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: analyzing ? "var(--amber)" : "var(--orange)" }}>
          {analyzing ? "LIVE" : "nova-2-lite-v1"}
        </div>
      </div>
      <div className="console" ref={consoleRef}>
        {logs.map((l, i) => (
          <div key={i} className="cl">
            <span className="ts">{l.ts}</span>
            <span className={TAG_CLASS[l.tag] || "ci"}>{"[" + l.tag + "] "}</span>
            <span className="cm">{l.msg}</span>
          </div>
        ))}
        {analyzing && !thinking && (
          <div className="cl">
            <span className="ts">--:--:--</span>
            <span className="ca">{"[NOVA] "}</span>
            <span className="cm">processing </span>
            <span className="cursor" />
          </div>
        )}
      </div>
      {thinking && (
        <div className="thinking-bar">
          <span>o</span> Nova 2 Lite reasoning
          <div className="td"><span>.</span><span>.</span><span>.</span></div>
        </div>
      )}
      {novaOut && (
        <div className="nova-out">
          <span className="nova-lbl">NOVA 2 LITE REASONING:</span>
          {novaOut}
        </div>
      )}
    </div>
  );
}
