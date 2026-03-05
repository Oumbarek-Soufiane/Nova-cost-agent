// frontend/src/components/Chart.jsx
import { useState } from "react";

export default function Chart({ data }) {
  const [tip, setTip] = useState(null);
  const max = Math.max(...data.map((d) => d.cost));
  return (
    <div className="chart">
      {data.map((d, i) => (
        <div key={i} className="bw" onMouseEnter={() => setTip({ i, d })} onMouseLeave={() => setTip(null)}>
          <div
            className={d.spike ? "bar spk" : "bar"}
            style={{ height: (d.cost / max) * 100 + "%", background: d.spike ? undefined : "rgba(88,166,255," + (0.18 + (d.cost / max) * 0.55) + ")" }}
          />
          {i % 4 === 0 && <div className="blbl">{d.hour.slice(0, 2)}h</div>}
        </div>
      ))}
      {tip && (
        <div className="ctip" style={{ left: (tip.i / data.length) * 100 + "%" }}>
          {tip.d.hour} — ${tip.d.cost.toFixed(0)}{tip.d.spike ? " SPIKE" : ""}
        </div>
      )}
    </div>
  );
}
