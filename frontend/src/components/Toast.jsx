// frontend/src/components/Toast.jsx
const ICONS = { success: "OK", warning: "!!", error: "XX", info: "ii" };

export default function Toast({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={"toast " + t.type}>
          {ICONS[t.type]} {t.msg}
        </div>
      ))}
    </div>
  );
}
