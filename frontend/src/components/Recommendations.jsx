// frontend/src/components/Recommendations.jsx
export default function Recommendations({ recos, analyzing, onExecute, onDefer, onDismiss }) {
  return (
    <div className="apanel">
      <div className="ph">
        <div className="pt">Nova Recommendations</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--t3)" }}>
          {recos.length > 0 ? recos.length + " pending" : analyzing ? "generating..." : "run analysis first"}
        </div>
      </div>
      <div className="rlist">
        {recos.length === 0 ? (
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--t3)", padding: "28px 0", textAlign: "center" }}>
            {analyzing ? "Nova 2 Lite generating..." : "Click Run Nova Analysis to start"}
          </div>
        ) : recos.map((r, i) => (
          <div key={i} className="ri">
            <div className="rh">
              <div className={"rsev " + r.severity} />
              <div className="rsvc">{r.service}</div>
              <div className="rname">{r.name}</div>
              <div className="rsav">{r.savings}</div>
            </div>
            <div className="rbody">
              <div className="rdesc">{r.desc}</div>
              <div className="acts">
                <button className="btn btn-p" disabled={r.executing} onClick={() => onExecute(i)}>
                  {r.executing ? "Executing..." : "Execute"}
                </button>
                <button className="btn btn-s" onClick={() => onDefer(r.name)}>Defer</button>
                <button className="btn btn-d" onClick={() => onDismiss(i)}>Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
