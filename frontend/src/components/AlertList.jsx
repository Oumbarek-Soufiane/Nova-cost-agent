// frontend/src/components/AlertList.jsx
export default function AlertList({ alerts }) {
  if (alerts.length === 0) {
    return <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", padding: "14px 0", textAlign: "center" }}>All clear</div>;
  }
  return (
    <div className="alist">
      {alerts.map((a, i) => (
        <div key={i} className={"al " + a.type}>
          <div className="al-ic">{a.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="al-title">{a.title}</div>
            <div className="al-desc">{a.desc}</div>
          </div>
          <div className="al-time">{a.time}</div>
        </div>
      ))}
    </div>
  );
}
