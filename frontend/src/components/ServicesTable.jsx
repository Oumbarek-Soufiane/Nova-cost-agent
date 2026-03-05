// frontend/src/components/ServicesTable.jsx
export default function ServicesTable({ services }) {
  return (
    <div className="panel">
      <div className="ph">
        <div className="pt">Service Breakdown</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--t3)" }}>last 1hr</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Service</th><th>Region</th><th>Cost/hr</th>
              <th>Utilisation</th><th>Status</th><th>vs Baseline</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i}>
                <td><span className="sn">{s.name}</span></td>
                <td style={{ color: "var(--t3)" }}>{s.region}</td>
                <td style={{ color: "var(--amber)", fontWeight: 600 }}>${s.cost}</td>
                <td>
                  <div className="bc">
                    <div className="bt">
                      <div className="bf" style={{ width: s.pct + "%", background: s.pct > 80 ? "var(--red)" : s.pct < 25 ? "var(--amber)" : "var(--blue)" }} />
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--t3)", width: 26 }}>{s.pct}%</span>
                  </div>
                </td>
                <td><span className={"tag tag-" + s.status}>{s.status}</span></td>
                <td style={{ fontFamily: "var(--mono)", fontSize: 10, color: s.trend.startsWith("+") && !["2%","4%"].some((x) => s.trend.endsWith(x)) ? "var(--red)" : "var(--green)" }}>
                  {s.trend}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
