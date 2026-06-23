import { useState, useRef } from "react";
import { PageBanner } from "../theme";
import {
  ArrowLeft, Plus, Save, Download, Printer,
  ClipboardList, Activity, ChevronRight, ChevronDown,
  ChevronUp, CheckCircle2, Edit2, Trash2, User,
  Calendar, X, Search, Filter,
} from "lucide-react";

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
const card = (x = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...x,
});
const iStyle = {
  width: "100%", padding: "8px 11px", border: "1.5px solid #e0e0e0",
  borderRadius: "7px", fontSize: "13px", color: "#333",
  backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};
const fo = e => (e.target.style.borderColor = "#2f9be0");
const fb = e => (e.target.style.borderColor = "#e0e0e0");

const OBtn = ({ children, onClick, style = {}, disabled = false }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 20px", backgroundColor: disabled ? "#e0e0e0" : "#2f9be0", color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 2px 8px rgba(47, 155, 224,0.28)", ...style }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = "#2380c2"; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = disabled ? "#e0e0e0" : (style.backgroundColor || "#2f9be0"); }}
  >{children}</button>
);

const GhostBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick}
    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: "#fff", color: "#555", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", ...style }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
  >{children}</button>
);

const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "22px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>{title}</h1>
    {sub && <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "6px" }} />
  </div>
);

const BackBtn = ({ label, onClick }) => (
  <button onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#888", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: "18px", padding: "0" }}
    onMouseEnter={e => (e.currentTarget.style.color = "#2f9be0")}
    onMouseLeave={e => (e.currentTarget.style.color = "#888")}
  ><ArrowLeft size={15} /> {label}</button>
);

const FieldInput = ({ label, value, onChange, placeholder, type = "text", style = {} }) => (
  <div style={style}>
    <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={iStyle} onFocus={fo} onBlur={fb} />
  </div>
);

// ─── RPS MEASURES ─────────────────────────────────────────────────────────────
const RPS_MEASURES = [
  { id: 1, label: "Ankle dorsiflexion ROM (cm)" },
  { id: 2, label: "Functional LLD (Mention the long side)" },
  { id: 3, label: "Passive Hip IR in supine with hip and knee @ 90° (Degrees)" },
  { id: 4, label: "Passive Glenohumeral IR @ 90° (Degrees)" },
  { id: 5, label: "Passive Glenohumeral ER @ 90° (Degrees)" },
  { id: 6, label: "Side Lying thoracic rotation ROM (cm) – on floor" },
  { id: 7, label: "Thomas Test Position – Psoas length" },
  { id: 8, label: "Rectus femoris length" },
  { id: 9, label: "Active knee extension (AKE)" },
];

// ─── MSK MEASURES ─────────────────────────────────────────────────────────────
const MSK_MEASURES = [
  {
    group: "Standing", color: "#1565c0", bg: "#e3f2fd", border: "#90caf9",
    items: [
      { id: 1,  label: "Rearfoot Pronation (Pronated/Neutral/Supinated)" },
      { id: 2,  label: "Midfoot Pronation (Pronated/Neutral/Supinated)" },
      { id: 3,  label: "Ankle dorsiflexion ROM (cm)" },
      { id: 4,  label: "Single leg lumbar extension" },
      { id: 5,  label: "Lumbar Quadrant test (Kemps test)" },
      { id: 6,  label: "Gillet Test (Stork test)" },
    ],
  },
  {
    group: "Sitting", color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7",
    items: [
      { id: 7,  label: "Tibial Dial Test (cm)" },
      { id: 8,  label: "Bilateral Rotator cuff MMT (at neutral & 90-90)" },
      { id: 9,  label: "HK Shoulder Impingement test (Positive / Negative)" },
      { id: 10, label: "O'Brien's Test (Positive / Negative)" },
      { id: 11, label: "Slump test" },
    ],
  },
  {
    group: "Supine", color: "#4a148c", bg: "#f3e5f5", border: "#ce93d8",
    items: [
      { id: 12, label: "Functional LLD (Mention the long side)" },
      { id: 13, label: "Passive Hip IR in supine with hip and knee @ 90° (Degrees)" },
      { id: 14, label: "Faber's Test (cm)" },
      { id: 15, label: "Anterior apprehension (Positive / Negative)" },
      { id: 16, label: "Relocation test (Positive / Negative)" },
      { id: 17, label: "Passive Glenohumeral IR @ 90° (Degrees)" },
      { id: 18, label: "Passive Glenohumeral ER @ 90° (Degrees)" },
      { id: 19, label: "GIRD / ERG (Positive /Negative)" },
      { id: 20, label: "Pectoralis Minor Tightness (cm)" },
      { id: 21, label: "Active knee extension – Hamstring length" },
      { id: 22, label: "Adductor Squeeze test" },
      { id: 23, label: "Hip quadrant test" },
      { id: 24, label: "Mc Murrays test", note: "Medial / Lateral meniscus" },
      { id: 25, label: "Anterior drawers test" },
      { id: 26, label: "Posterior drawers test" },
      { id: 27, label: "Medial joint line palpation" },
      { id: 28, label: "Medial slab palpation" },
      { id: 29, label: "Thomas Test Position – Psoas length" },
      { id: 30, label: "Thomas Test Position – Hip abduction angle" },
      { id: 31, label: "Thomas Test Position – Rectus femoris length" },
    ],
  },
  {
    group: "Prone Position", color: "#b71c1c", bg: "#ffebee", border: "#ef9a9a",
    items: [
      { id: 32, label: "Posterior ankle impingement test (prone)" },
    ],
  },
  {
    group: "Side Lying on Floor", color: "#e65100", bg: "#e8f3fb", border: "#ffcc80",
    items: [
      { id: 33, label: "Side lying thoracic rotation ROM (cm) – on floor" },
    ],
  },
];

// ─── INIT ROW VALUES ──────────────────────────────────────────────────────────
const initRpsRows  = () => Object.fromEntries(RPS_MEASURES.map(m => [m.id, { left: "", right: "", comments: "" }]));
const initMskRows  = () => {
  const all = MSK_MEASURES.flatMap(g => g.items);
  return Object.fromEntries(all.map(m => [m.id, { left: "", right: "", comments: "" }]));
};
const initRpsMeta  = () => ({ athleteName: "", date: new Date().toISOString().split("T")[0], skill: "", assessor: "" });
const initMskMeta  = () => ({ athleteName: "", date: new Date().toISOString().split("T")[0], height: "", weight: "", age: "", skill: "", assessor: "" });

// ─── MEASURE ROW ─────────────────────────────────────────────────────────────
function MeasureRow({ num, label, note, values, onChange, isEven }) {
  const cellInput = (field) => (
    <input
      value={values[field] || ""}
      onChange={e => onChange(field, e.target.value)}
      style={{
        width: "100%", padding: "6px 8px", border: "1.5px solid #e0e0e0",
        borderRadius: "6px", fontSize: "12px", color: "#333", backgroundColor: "#fff",
        outline: "none", boxSizing: "border-box", textAlign: "center", fontFamily: "inherit",
      }}
      onFocus={fo} onBlur={fb}
    />
  );

  return (
    <tr style={{ backgroundColor: isEven ? "#f9f9f9" : "#fff" }}>
      {/* Number */}
      <td style={{ padding: "8px 12px", fontSize: "12px", fontWeight: "700", color: "#2f9be0", textAlign: "center", borderBottom: "1px solid #f0f0f0", borderRight: "1px solid #f0f0f0", width: "36px" }}>
        {num}
      </td>
      {/* Measure label */}
      <td style={{ padding: "8px 14px", fontSize: "12px", color: "#333", borderBottom: "1px solid #f0f0f0", borderRight: "1px solid #f0f0f0", lineHeight: "1.45" }}>
        {label}
        {note && <div style={{ fontSize: "10px", color: "#2f9be0", fontStyle: "italic", marginTop: "2px" }}>{note}</div>}
      </td>
      {/* Left */}
      <td style={{ padding: "6px 8px", borderBottom: "1px solid #f0f0f0", borderRight: "1px solid #f0f0f0", width: "80px", minWidth: "70px" }}>
        {cellInput("left")}
      </td>
      {/* Right */}
      <td style={{ padding: "6px 8px", borderBottom: "1px solid #f0f0f0", borderRight: "1px solid #f0f0f0", width: "80px", minWidth: "70px" }}>
        {cellInput("right")}
      </td>
      {/* Comments */}
      <td style={{ padding: "6px 8px", borderBottom: "1px solid #f0f0f0", minWidth: "160px" }}>
        <input
          value={values.comments || ""}
          onChange={e => onChange("comments", e.target.value)}
          placeholder="Comments / Observations"
          style={{ ...iStyle, fontSize: "12px", padding: "6px 8px", textAlign: "left", backgroundColor: "#fff" }}
          onFocus={fo} onBlur={fb}
        />
      </td>
    </tr>
  );
}

// ─── GROUP HEADER ROW ─────────────────────────────────────────────────────────
function GroupHeader({ label, color, bg, border }) {
  return (
    <tr>
      <td colSpan={5} style={{ padding: "8px 14px", backgroundColor: bg, color, fontWeight: "700", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", border: `1px solid ${border}`, borderLeft: `4px solid ${color}` }}>
        {label}
      </td>
    </tr>
  );
}

// ─── ASSESSMENT FORM (RPS or MSK) ────────────────────────────────────────────
function AssessmentForm({ type, onBack, onSave, initialData }) {
  const isRps = type === "rps";

  const [meta, setMeta]       = useState(initialData?.meta || (isRps ? initRpsMeta() : initMskMeta()));
  const [rows, setRows]       = useState(initialData?.rows || (isRps ? initRpsRows() : initMskRows()));
  const [saving, setSaving]   = useState(false);
  const printRef              = useRef();

  const setMetaField = (k, v) => setMeta(m => ({ ...m, [k]: v }));
  const setRowField  = (id, field, value) => setRows(r => ({ ...r, [id]: { ...r[id], [field]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ type, meta, rows, savedAt: new Date().toISOString() });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    const title = isRps ? "Routine Physio Screen" : "MSK Recording Sheet";
    const content = printRef.current.innerHTML;
    win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;padding:28px;color:#222;font-size:12px}
      h1{font-size:18px;font-weight:800;text-align:center;text-decoration:underline;color:#1565c0;margin-bottom:8px}
      .subtitle{text-align:center;font-weight:700;margin-bottom:18px;line-height:1.6}
      .meta-row{display:flex;gap:24px;margin-bottom:16px;font-size:12px;flex-wrap:wrap}
      .meta-item{display:flex;gap:6px}.meta-label{font-weight:700}
      table{width:100%;border-collapse:collapse;margin-top:10px}
      th{background:#0277bd;color:#fff;padding:8px 10px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase}
      th.center{text-align:center}
      td{padding:6px 10px;border:1px solid #e0e0e0;font-size:11px;line-height:1.4}
      td.center{text-align:center}
      .num{color:#2f9be0;font-weight:700;text-align:center}
      .group{background:#e3f2fd;color:#1565c0;font-weight:700;padding:7px 10px;border-left:4px solid #1565c0;font-size:11px;letter-spacing:.4px;text-transform:uppercase}
      tr:nth-child(even) td{background:#f9f9f9}
      @media print{body{padding:14px}}
    </style></head><body>${content}</body></html>`);
    win.document.close(); win.focus(); win.print();
  };

  const metaInputStyle = { ...iStyle, fontSize: "13px" };

  return (
    <div style={{ padding: "clamp(14px, 4vw, 28px)", maxWidth: "1100px", margin: "0 auto" }}>
      <BackBtn label="Physio Assessments" onClick={onBack} />

      {/* Page title */}
      <div style={{ ...card({ padding: "18px 22px", marginBottom: "20px" }), borderLeft: "4px solid #2f9be0" }}>
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <h2 style={{ fontSize: "clamp(15px, 3vw, 19px)", fontWeight: "800", color: "#1565c0", textDecoration: "underline", margin: 0, textTransform: "uppercase" }}>
            {isRps ? "(Routine Physio Screen)" : "MSK Recording Sheet"}
          </h2>
        </div>
        {isRps && (
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#333", margin: 0, lineHeight: "1.6" }}>
              All Bowlers – To Be tested before any high intensity bowling session
            </p>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#333", margin: 0 }}>
              Batsmen &amp; WK – To be tested twice weekly
            </p>
          </div>
        )}
      </div>

      {/* Meta fields */}
      <div style={card({ padding: "18px 22px", marginBottom: "20px" })}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <User size={14} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>Assessment Details</span>
        </div>

        {isRps ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            <FieldInput label="Athlete Name" value={meta.athleteName} onChange={v => setMetaField("athleteName", v)} placeholder="Enter name" />
            <FieldInput label="Date" type="date" value={meta.date} onChange={v => setMetaField("date", v)} placeholder="" />
            <FieldInput label="Skill" value={meta.skill} onChange={v => setMetaField("skill", v)} placeholder="e.g. Bowler" />
            <FieldInput label="Assessor" value={meta.assessor} onChange={v => setMetaField("assessor", v)} placeholder="Assessor name" />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
            <FieldInput label="Athlete Name" value={meta.athleteName} onChange={v => setMetaField("athleteName", v)} placeholder="Enter name" />
            <FieldInput label="Date" type="date" value={meta.date} onChange={v => setMetaField("date", v)} placeholder="" />
            <FieldInput label="Height" value={meta.height} onChange={v => setMetaField("height", v)} placeholder="e.g. 178 cm" />
            <FieldInput label="Weight" value={meta.weight} onChange={v => setMetaField("weight", v)} placeholder="e.g. 72 kg" />
            <FieldInput label="Age" value={meta.age} onChange={v => setMetaField("age", v)} placeholder="e.g. 23" />
            <FieldInput label="Skill" value={meta.skill} onChange={v => setMetaField("skill", v)} placeholder="e.g. Bowler" />
            <FieldInput label="Assessor" value={meta.assessor} onChange={v => setMetaField("assessor", v)} placeholder="Assessor name" style={{ gridColumn: "span 1" }} />
          </div>
        )}
      </div>

      {/* Measures table */}
      <div style={card({ overflow: "hidden", marginBottom: "20px" })}>
        <div className="scroll-x" style={{ overflowX: "auto" }}>
          <div ref={printRef}>
            {/* Print header */}
            <div style={{ display: "none" }} className="print-header">
              <h1>{isRps ? "(ROUTINE PHYSIO SCREEN)" : "MSK RECORDING SHEET"}</h1>
              {isRps && <div className="subtitle">All Bowlers – To Be tested before any high intensity bowling session<br/>Batsmen &amp; WK – To be tested twice weekly</div>}
              <div className="meta-row">
                <div className="meta-item"><span className="meta-label">Athlete Name:</span><span>{meta.athleteName || "___________"}</span></div>
                {!isRps && <><div className="meta-item"><span className="meta-label">Height:</span><span>{meta.height || "___"}</span></div><div className="meta-item"><span className="meta-label">Weight:</span><span>{meta.weight || "___"}</span></div><div className="meta-item"><span className="meta-label">Age:</span><span>{meta.age || "___"}</span></div></>}
                <div className="meta-item"><span className="meta-label">Date:</span><span>{meta.date || "___________"}</span></div>
                <div className="meta-item"><span className="meta-label">Skill:</span><span>{meta.skill || "___________"}</span></div>
                <div className="meta-item"><span className="meta-label">Assessor:</span><span>{meta.assessor || "___________"}</span></div>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#0277bd" }}>
                  <th style={{ padding: "10px 12px", fontSize: "12px", fontWeight: "700", color: "#fff", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)", width: "36px" }}>#</th>
                  <th style={{ padding: "10px 14px", fontSize: "12px", fontWeight: "700", color: "#fff", textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)" }}>MEASURES</th>
                  <th style={{ padding: "10px 8px", fontSize: "12px", fontWeight: "700", color: "#fff", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)", width: "80px" }}>Left</th>
                  <th style={{ padding: "10px 8px", fontSize: "12px", fontWeight: "700", color: "#fff", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)", width: "80px" }}>Right</th>
                  <th style={{ padding: "10px 14px", fontSize: "12px", fontWeight: "700", color: "#fff", textAlign: "left" }}>COMMENTS / OBSERVATIONS</th>
                </tr>
              </thead>
              <tbody>
                {isRps
                  ? RPS_MEASURES.map((m, i) => (
                      <MeasureRow key={m.id} num={m.id} label={m.label} values={rows[m.id] || {}} onChange={(f, v) => setRowField(m.id, f, v)} isEven={i % 2 === 0} />
                    ))
                  : MSK_MEASURES.map(group => (
                      <>
                        <GroupHeader key={`g_${group.group}`} label={group.group} color={group.color} bg={group.bg} border={group.border} />
                        {group.items.map((m, i) => (
                          <MeasureRow key={m.id} num={m.id} label={m.label} note={m.note} values={rows[m.id] || {}} onChange={(f, v) => setRowField(m.id, f, v)} isEven={i % 2 === 0} />
                        ))}
                      </>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <GhostBtn onClick={handlePrint} style={{ padding: "9px 16px" }}>
          <Printer size={14} /> Print / Download PDF
        </GhostBtn>
        <OBtn onClick={handleSave} disabled={saving} style={{ padding: "9px 22px" }}>
          {saving ? (
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
              Saving…
            </span>
          ) : <><Save size={14} /> Save Assessment</>}
        </OBtn>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── SAVED ASSESSMENT CARD ────────────────────────────────────────────────────
function AssessmentCard({ assessment, onView, onDelete }) {
  const isRps  = assessment.type === "rps";
  const filled = Object.values(assessment.rows).filter(r => r.left || r.right || r.comments).length;
  const total  = Object.keys(assessment.rows).length;

  return (
    <div style={card({ padding: "16px 20px", cursor: "pointer", transition: "all 0.15s", borderLeft: isRps ? "4px solid #2f9be0" : "4px solid #0277bd" })}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }} onClick={() => onView(assessment)}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>
              {assessment.meta.athleteName || "Unknown Athlete"}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "20px", backgroundColor: isRps ? "#e8f3fb" : "#e3f2fd", color: isRps ? "#2f9be0" : "#1565c0", border: `1px solid ${isRps ? "#cfe6f7" : "#90caf9"}` }}>
              {isRps ? "RPS" : "MSK"}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>
            {assessment.meta.assessor && <span>Assessor: {assessment.meta.assessor} · </span>}
            {assessment.meta.date && <span>{new Date(assessment.meta.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
            {assessment.meta.skill && <span> · {assessment.meta.skill}</span>}
          </div>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, height: "5px", backgroundColor: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round((filled / total) * 100)}%`, backgroundColor: filled === total ? "#2e7d32" : "#2f9be0", borderRadius: "4px", transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: "11px", color: "#888", whiteSpace: "nowrap" }}>{filled}/{total} filled</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button onClick={() => onView(assessment)}
            style={{ width: "30px", height: "30px", borderRadius: "7px", backgroundColor: isRps ? "#e8f3fb" : "#e3f2fd", border: `1px solid ${isRps ? "#cfe6f7" : "#90caf9"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          ><Edit2 size={13} style={{ color: isRps ? "#2f9be0" : "#1565c0" }} /></button>
          <button onClick={() => onDelete(assessment.id)}
            style={{ width: "30px", height: "30px", borderRadius: "7px", backgroundColor: "#fff0f0", border: "1px solid #ffc5c5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ffc5c5")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff0f0")}
          ><Trash2 size={13} style={{ color: "#cc3333" }} /></button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const V = { LIST: "list", RPS: "rps", MSK: "msk" };

export default function PhysioAssessments({ player }) {
  const [view,        setView]       = useState(V.LIST);
  const [assessments, setAssessments]= useState([]);
  const [activeAss,   setActiveAss]  = useState(null);
  const [search,      setSearch]     = useState("");
  const [typeFilter,  setTypeFilter] = useState("all");
  const [toast,       setToast]      = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleSave = async (data) => {
    if (activeAss) {
      setAssessments(prev => prev.map(a => a.id === activeAss.id ? { ...a, ...data } : a));
      showToast("✅ Assessment updated successfully.");
    } else {
      const newAss = { ...data, id: `ass_${Date.now()}` };
      setAssessments(prev => [newAss, ...prev]);
      showToast(`✅ ${data.type === "rps" ? "RPS" : "MSK"} assessment saved.`);
    }
    setActiveAss(null);
    setView(V.LIST);
  };

  const handleView = (ass) => { setActiveAss(ass); setView(ass.type === "rps" ? V.RPS : V.MSK); };

  const handleDelete = (id) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
    showToast("Assessment deleted.");
  };

  const handleBack = () => { setActiveAss(null); setView(V.LIST); };

  const filtered = assessments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.meta.athleteName?.toLowerCase().includes(q) || a.meta.assessor?.toLowerCase().includes(q) || a.meta.skill?.toLowerCase().includes(q);
    const matchType   = typeFilter === "all" || a.type === typeFilter;
    return matchSearch && matchType;
  });

  // ── Form views ──
  if (view === V.RPS) return (
    <AssessmentForm type="rps" onBack={handleBack} onSave={handleSave} initialData={activeAss} />
  );
  if (view === V.MSK) return (
    <AssessmentForm type="msk" onBack={handleBack} onSave={handleSave} initialData={activeAss} />
  );

  // ── List view ──
  const rpsCount  = assessments.filter(a => a.type === "rps").length;
  const mskCount  = assessments.filter(a => a.type === "msk").length;
  const totalFill = assessments.length > 0 ? Math.round(assessments.reduce((s, a) => {
    const filled = Object.values(a.rows).filter(r => r.left || r.right || r.comments).length;
    const total  = Object.keys(a.rows).length;
    return s + (filled / total);
  }, 0) / assessments.length * 100) : 0;

  return (
    <div style={{ padding: "clamp(14px, 4vw, 28px)", maxWidth: "1100px", margin: "0 auto" }}>

      <PageBanner title="Assessments" sub="RPS & MSK screening" />

      {/* ── HEADING + actions ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "22px", gap: "14px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: "800", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>Physio Assessments</h1>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Routine Physio Screen (RPS) &amp; MSK Recording Sheet</p>
          <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "6px" }} />
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => { setActiveAss(null); setView(V.RPS); }}
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 16px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1.5px solid #cfe6f7", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#cfe6f7")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#e8f3fb")}
          >
            <Plus size={14} /> New RPS
          </button>
          <button onClick={() => { setActiveAss(null); setView(V.MSK); }}
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 16px", backgroundColor: "#e3f2fd", color: "#1565c0", border: "1.5px solid #90caf9", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#90caf9")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
          >
            <Plus size={14} /> New MSK
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "14px", marginBottom: "22px" }}>
        {[
          { label: "Total Assessments", value: assessments.length, color: "#2f9be0", icon: ClipboardList },
          { label: "RPS Assessments",   value: rpsCount,           color: "#f9a825", icon: Activity     },
          { label: "MSK Assessments",   value: mskCount,           color: "#1565c0", icon: Activity     },
          { label: "Avg Completion",    value: `${totalFill}%`,    color: "#2e7d32", icon: CheckCircle2 },
        ].map(s => (
          <div key={s.label} style={card({ padding: "14px 18px", borderLeft: `4px solid ${s.color}` })}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#888", fontWeight: "500" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Quick-start cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px", marginBottom: "22px" }}>

        {/* RPS card */}
        <div style={card({ padding: "22px", borderLeft: "4px solid #2f9be0", cursor: "pointer", transition: "all 0.15s" })}
          onClick={() => { setActiveAss(null); setView(V.RPS); }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(47, 155, 224,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#e8f3fb", border: "1.5px solid #cfe6f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ClipboardList size={20} style={{ color: "#2f9be0" }} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#222" }}>RPS</div>
              <div style={{ fontSize: "11px", color: "#888" }}>Routine Physio Screen</div>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.55", margin: "0 0 12px" }}>
            9-measure screen for bowlers (pre high-intensity) and batsmen/WK (twice weekly).
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#2f9be0", fontWeight: "700" }}>
            <span>9 measures</span>
            <span style={{ fontSize: "11px", color: "#aaa", fontWeight: "400" }}>· Left / Right / Comments</span>
          </div>
        </div>

        {/* MSK card */}
        <div style={card({ padding: "22px", borderLeft: "4px solid #1565c0", cursor: "pointer", transition: "all 0.15s" })}
          onClick={() => { setActiveAss(null); setView(V.MSK); }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(21,101,192,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#e3f2fd", border: "1.5px solid #90caf9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={20} style={{ color: "#1565c0" }} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#222" }}>MSK</div>
              <div style={{ fontSize: "11px", color: "#888" }}>MSK Recording Sheet</div>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.55", margin: "0 0 12px" }}>
            33-measure comprehensive MSK screen across Standing, Sitting, Supine, Prone and Side Lying positions.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1565c0", fontWeight: "700" }}>
            <span>33 measures · 5 positions</span>
            <span style={{ fontSize: "11px", color: "#aaa", fontWeight: "400" }}>· Left / Right / Comments</span>
          </div>
        </div>
      </div>

      {/* ── Saved assessments ── */}
      {assessments.length > 0 && (
        <>
          {/* Search + filter */}
          <div style={card({ padding: "12px 16px", marginBottom: "16px" })}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
                <Search size={13} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by athlete, assessor, skill…"
                  style={{ ...iStyle, paddingLeft: "32px" }} onFocus={fo} onBlur={fb} />
                {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex" }}><X size={13} /></button>}
              </div>
              <div style={{ display: "flex", border: "1.5px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                {[{ k: "all", l: "All" }, { k: "rps", l: "RPS" }, { k: "msk", l: "MSK" }].map(f => (
                  <button key={f.k} onClick={() => setTypeFilter(f.k)}
                    style={{ padding: "7px 14px", border: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", backgroundColor: typeFilter === f.k ? "#2f9be0" : "#fff", color: typeFilter === f.k ? "#fff" : "#666", borderRight: f.k !== "msk" ? "1px solid #e0e0e0" : "none", transition: "all 0.12s" }}>
                    {f.l}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: "12px", color: "#888" }}><b style={{ color: "#222" }}>{filtered.length}</b> assessment{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.length === 0 ? (
              <div style={card({ padding: "40px", textAlign: "center" })}>
                <Search size={28} style={{ color: "#ddd", margin: "0 auto 10px", display: "block" }} />
                <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>No assessments match your search</p>
              </div>
            ) : (
              filtered.map(a => (
                <AssessmentCard key={a.id} assessment={a} onView={handleView} onDelete={handleDelete} />
              ))
            )}
          </div>
        </>
      )}

      {assessments.length === 0 && (
        <div style={card({ padding: "48px", textAlign: "center" })}>
          <ClipboardList size={40} style={{ color: "#ddd", margin: "0 auto 14px", display: "block" }} />
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#555", margin: "0 0 6px" }}>No assessments yet</p>
          <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 20px" }}>Create a new RPS or MSK assessment using the buttons above</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setActiveAss(null); setView(V.RPS); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 18px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1.5px solid #cfe6f7", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#cfe6f7")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#e8f3fb")}
            ><Plus size={14} /> Start RPS</button>
            <button onClick={() => { setActiveAss(null); setView(V.MSK); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 18px", backgroundColor: "#e3f2fd", color: "#1565c0", border: "1.5px solid #90caf9", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#90caf9")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
            ><Plus size={14} /> Start MSK</button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "28px", right: "28px", backgroundColor: toast.type === "error" ? "#cc3333" : "#2e7d32", color: "#fff", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 999, display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={15} /> {toast.msg}
        </div>
      )}
    </div>
  );
}