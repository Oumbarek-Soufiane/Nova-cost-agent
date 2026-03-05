// frontend/src/components/SetupGuide.jsx
import { SETUP_STEPS } from "../data/staticData.js";

export default function SetupGuide({ backendOk }) {
  return (
    <div className="panel">
      <div className="ph">
        <div className="pt">Setup Guide — nova-2-lite-v1</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: backendOk === true ? "var(--green)" : backendOk === false ? "var(--red)" : "var(--t3)" }}>
          {backendOk === true ? "connected" : backendOk === false ? "unreachable" : "not checked"}
        </div>
      </div>
      <div className="setup-grid">
        {SETUP_STEPS.map((s, i) => (
          <div key={i} className="step-card">
            <div className="step-num">{s.num}</div>
            <div className="step-title">{s.title}</div>
            <div className="step-body">{s.body}</div>
            {s.code && (
              <code className="code">
                {s.code.map((line, j) => (
                  <span key={j} className={line.cmd ? "code-cmd" : "code-cmt"} style={{ display: "block" }}>
                    {line.text}
                  </span>
                ))}
              </code>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
