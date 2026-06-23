import { useState, useRef } from "react";
import { PageBanner } from "../theme";
import {
  X, Plus, ArrowLeft, Edit2, Trash2, Paperclip,
  AlertTriangle, CheckCircle2, FileText, Pill,
  ChevronRight, Calendar, Clock, User, Upload,
  Bell, Lock, Copy,
} from "lucide-react";

// ─── SHARED ───────────────────────────────────────────────────────────────────
const card = (x = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...x,
});
const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0",
  borderRadius: "7px", fontSize: "13px", color: "#333",
  backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};
const focusOrange = e => (e.target.style.borderColor = "#2f9be0");
const blurGray    = e => (e.target.style.borderColor = "#e0e0e0");

const FieldLabel = ({ children }) => (
  <label style={{ fontSize: "12px", fontWeight: "700", color: "#555", display: "block", marginBottom: "5px" }}>
    {children}
  </label>
);

const OBtn = ({ children, onClick, style = {}, color = "#2f9be0" }) => (
  <button onClick={onClick}
    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: color, color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "700", cursor: "pointer", ...style }}
    onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
  >{children}</button>
);

const GhostBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick}
    style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", backgroundColor: "transparent", color: "#555", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "12px", fontWeight: "600", cursor: "pointer", ...style }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
  >{children}</button>
);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BODY_AREAS = [
  "Abdomen","Ankle","Chest","Chest/ribs/upper back","Elbow","Foot","Forearm",
  "Groin","Hand","Head","Hip","Hip/groin","Knee","Lower back","Lower leg",
  "Lumbosacral","Multiple regions","Neck","Non-specific","Pelvis","Shoulder","Thigh",
  "Thoracic spine","Unknown","Upper arm","Whole body","Wrist",
];
const CONSULTATION_TYPES = [
  "Initial Assessment","Follow-up","Rehabilitation","Treatment","Medical Review",
  "Clearance Check","Emergency","Physiotherapy","Sports Medicine","Other",
];
const SERVICES = [
  "Massage","Dry Needling","Ultrasound","TENS","Ice/Heat","Exercise Therapy",
  "Manual Therapy","Strapping/Taping","Education","Other",
];
const INJURY_CATEGORIES = [
  "Injury - Acute","Injury - Chronic","Illness","Medical Condition","Dental","Other",
];
const PARTICIPATION_OPTIONS = [
  "Full participation","Modified participation","No participation","Under observation",
];
const FREQUENCY_OPTIONS = ["Once daily","Twice daily","Three times daily","Four times daily","As needed","Weekly"];
const PRESCRIBERS = ["Dr. Arun (Physio)","Dr. Suresh (Doctor)","R S Unnikrishnan","Self-administered"];

const today = () => new Date().toISOString().split("T")[0];
const todayTime = () => { const d = new Date(); return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };
const fmtDate = d => { if (!d) return "—"; try { return new Date(d).toLocaleDateString("en-IN", { year:"numeric", month:"short", day:"numeric" }); } catch { return d; } };

// ─── HEALTH PROBLEM MODAL ────────────────────────────────────────────────────
function HealthProblemModal({ existing, player, onSave, onClose }) {
  const [form, setForm] = useState(existing || {
    date: today(), category: "", problem: "", bodyArea: "",
    participationStatus: "Full participation", attachments: [],
    recordedBy: "R S Unnikrishnan", notes: "",
  });
  const fileRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = e => {
    const f = e.target.files[0];
    if (f) set("attachments", [...(form.attachments || []), f.name]);
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...card(), width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#222" }}>{existing ? "Edit Health Problem" : "Add Health Problem"}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "20px", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "12px" }}>
            <div>
              <FieldLabel>Date</FieldLabel>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <select value={form.category} onChange={e => set("category", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
                <option value="">Select…</option>
                {INJURY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Health Problem / Diagnosis</FieldLabel>
            <input value={form.problem} onChange={e => set("problem", e.target.value)} placeholder="e.g. Thigh (L) | Rectus femoris strain" style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Body Area</FieldLabel>
            <select value={form.bodyArea} onChange={e => set("bodyArea", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
              <option value="">Select body area…</option>
              {BODY_AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Participation Status</FieldLabel>
            <select value={form.participationStatus} onChange={e => set("participationStatus", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
              {PARTICIPATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Notes</FieldLabel>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Additional notes…" rows={3}
              style={{ ...inputStyle, resize: "none" }} onFocus={focusOrange} onBlur={blurGray} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Recorded By</FieldLabel>
            <select value={form.recordedBy} onChange={e => set("recordedBy", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
              {PRESCRIBERS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Attachments */}
          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Attachments</FieldLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
              {(form.attachments || []).map((f, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", backgroundColor: "#e8f3fb", border: "1px solid #cfe6f7", borderRadius: "6px", fontSize: "12px", color: "#b05a00" }}>
                  <Paperclip size={11} /> {f}
                  <X size={11} style={{ cursor: "pointer", color: "#cc3333" }} onClick={() => set("attachments", (form.attachments || []).filter((_, j) => j !== i))} />
                </span>
              ))}
            </div>
            <button onClick={() => fileRef.current.click()}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
              <Upload size={12} /> Attach File
            </button>
            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <OBtn onClick={() => { if (!form.problem.trim()) { alert("Enter health problem."); return; } onSave({ ...form, id: form.id || `hp_${Date.now()}` }); }}>
              Save
            </OBtn>
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONSULTATION MODAL ───────────────────────────────────────────────────────
function ConsultationModal({ existing, healthProblems, onSave, onClose }) {
  const [mode, setMode] = useState("simple"); // simple | advanced
  const [form, setForm] = useState(existing || {
    date: today(), time: todayTime(), duration: "0:05",
    recordedBy: "Unnikrishnan, R.S",
    consultationType: "", services: [{ service: "", qty: 1, comment: "" }],
    bodyAreas: [], healthProblem: "", notes: "",
    whoCanSee: 36, attachments: [], sendNotification: "No", painLevel: 0,
    painSensation: "",
  });
  const fileRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleBodyArea = a => set("bodyAreas", form.bodyAreas.includes(a) ? form.bodyAreas.filter(x => x !== a) : [...form.bodyAreas, a]);

  const addService    = () => set("services", [...form.services, { service: "", qty: 1, comment: "" }]);
  const removeService = i  => set("services", form.services.filter((_, j) => j !== i));
  const updateService = (i, k, v) => { const s = [...form.services]; s[i] = { ...s[i], [k]: v }; set("services", s); };

  const handleFile = e => { const f = e.target.files[0]; if (f) set("attachments", [...(form.attachments || []), f.name]); };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...card(), width: "100%", maxWidth: "600px", maxHeight: "92vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <OBtn onClick={onClose} style={{ padding: "5px 12px", fontSize: "12px", backgroundColor: "#e0e0e0", color: "#555" }}>Close</OBtn>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>New Consultation</span>
          </div>
          <OBtn onClick={() => {}} style={{ padding: "5px 12px", fontSize: "12px", backgroundColor: "#f9a825" }}>
            <Copy size={12} /> Copy Previous
          </OBtn>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {/* Mode toggle */}
          <div style={{ display: "flex", gap: "0", marginBottom: "16px", borderBottom: "2px solid #f0f0f0" }}>
            {["simple","advanced"].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ padding: "8px 16px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", backgroundColor: "transparent", color: mode === m ? "#2f9be0" : "#888", borderBottom: mode === m ? "2px solid #2f9be0" : "2px solid transparent", marginBottom: "-2px", textTransform: "capitalize" }}>
                {m === "simple" ? "Simple Mode" : "Advanced Mode"}
              </button>
            ))}
          </div>

          {/* Date / Time / Duration */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", marginBottom: "12px" }}>
            <div>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
            </div>
            <div>
              <input type="time" value={form.time} onChange={e => set("time", e.target.value)} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
            </div>
            <div>
              <input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="Duration e.g. 0:45" style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
            </div>
          </div>

          {/* Recorded by */}
          <div style={{ marginBottom: "12px" }}>
            <select value={form.recordedBy} onChange={e => set("recordedBy", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
              {PRESCRIBERS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {mode === "advanced" && (
            <>
              {/* Consultation Type */}
              <div style={{ marginBottom: "12px" }}>
                <FieldLabel>Type of consultation</FieldLabel>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <select value={form.consultationType} onChange={e => set("consultationType", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer", flex: 1 }} onFocus={focusOrange} onBlur={blurGray}>
                    <option value="">Please select</option>
                    {CONSULTATION_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <button style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Plus size={14} /></button>
                  <button style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#cc3333", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><X size={14} /></button>
                </div>
              </div>

              {/* Services */}
              <div style={{ marginBottom: "12px" }}>
                <FieldLabel>Service provided</FieldLabel>
                {form.services.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr auto", gap: "8px", marginBottom: "6px", alignItems: "center" }}>
                    <select value={s.service} onChange={e => updateService(i, "service", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
                      <option value="">Please select</option>
                      {SERVICES.map(sv => <option key={sv}>{sv}</option>)}
                    </select>
                    <input type="number" value={s.qty} onChange={e => updateService(i, "qty", e.target.value)} style={{ ...inputStyle, textAlign: "center" }} onFocus={focusOrange} onBlur={blurGray} />
                    <input value={s.comment} onChange={e => updateService(i, "comment", e.target.value)} placeholder="Comment" style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={addService}    style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={12} /></button>
                      {form.services.length > 1 && <button onClick={() => removeService(i)} style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#cc3333", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Body Areas */}
              <div style={{ marginBottom: "12px" }}>
                <FieldLabel>Body Areas</FieldLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {BODY_AREAS.map(a => (
                    <label key={a} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#555", cursor: "pointer" }}>
                      <input type="checkbox" checked={form.bodyAreas.includes(a)} onChange={() => toggleBodyArea(a)} style={{ accentColor: "#2f9be0" }} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              {/* Health Problem */}
              <div style={{ marginBottom: "12px" }}>
                <FieldLabel>Health Problem</FieldLabel>
                <select value={form.healthProblem} onChange={e => set("healthProblem", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
                  <option value="">Please select</option>
                  {healthProblems.map(hp => <option key={hp.id} value={hp.id}>{hp.problem}</option>)}
                </select>
              </div>

              {/* Pain Level */}
              <div style={{ marginBottom: "12px" }}>
                <FieldLabel>Pain Level</FieldLabel>
                <div style={{ position: "relative", marginBottom: "6px" }}>
                  <div style={{ height: "5px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                    <div style={{ height: "100%", width: `${form.painLevel * 10}%`, backgroundColor: form.painLevel >= 7 ? "#cc3333" : form.painLevel >= 4 ? "#f9a825" : "#2e7d32", borderRadius: "4px" }} />
                  </div>
                  <input type="range" min={0} max={10} value={form.painLevel} onChange={e => set("painLevel", Number(e.target.value))}
                    style={{ position: "absolute", top: "-5px", left: 0, width: "100%", opacity: 0, cursor: "pointer", height: "14px" }} />
                  <div style={{ position: "absolute", top: "-6px", left: `calc(${form.painLevel * 10}% - 7px)`, width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#fff", border: "2px solid #2f9be0", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", pointerEvents: "none" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#aaa" }}>No pain</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#2f9be0" }}>{form.painLevel}</span>
                  <span style={{ fontSize: "11px", color: "#aaa" }}>Maximal pain</span>
                </div>
              </div>

              {/* Pain sensation */}
              <div style={{ marginBottom: "12px" }}>
                <FieldLabel>Pain sensation</FieldLabel>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["Sharp","Dull","Aching","Burning","Throbbing","Stabbing"].map(s => (
                    <button key={s} onClick={() => set("painSensation", s)}
                      style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: `1.5px solid ${form.painSensation === s ? "#2f9be0" : "#e0e0e0"}`, backgroundColor: form.painSensation === s ? "#e8f3fb" : "#f9f9f9", color: form.painSensation === s ? "#2f9be0" : "#666" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          <div style={{ marginBottom: "12px" }}>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Notes" rows={4}
              style={{ ...inputStyle, resize: "vertical" }} onFocus={focusOrange} onBlur={blurGray} />
          </div>

          {/* Who can see */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "#f5f5f5", borderRadius: "8px", cursor: "pointer" }}>
              <User size={14} style={{ color: "#888" }} />
              <span style={{ fontSize: "13px", color: "#555" }}>Who can see note ({form.whoCanSee})</span>
              <ChevronRight size={14} style={{ color: "#ccc", marginLeft: "auto" }} />
            </div>
          </div>

          {/* Attachments */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "#f5f5f5", borderRadius: "8px", marginBottom: "6px" }}>
              <Upload size={14} style={{ color: "#888" }} />
              <span style={{ fontSize: "13px", color: "#555", flex: 1 }}>Attach files</span>
              <button onClick={() => fileRef.current.click()} style={{ background: "none", border: "none", cursor: "pointer", color: "#2f9be0", display: "flex" }}><Paperclip size={16} /></button>
            </div>
            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {(form.attachments || []).map((f, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", backgroundColor: "#e8f3fb", border: "1px solid #cfe6f7", borderRadius: "6px", fontSize: "12px", color: "#b05a00" }}>
                  <Paperclip size={11} />{f}
                  <X size={11} style={{ cursor: "pointer", color: "#cc3333" }} onClick={() => set("attachments", (form.attachments || []).filter((_, j) => j !== i))} />
                </span>
              ))}
            </div>
          </div>

          {/* Send notification */}
          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Send notification</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {["Yes","No"].map(v => (
                <button key={v} onClick={() => set("sendNotification", v)}
                  style={{ padding: "9px", border: `1.5px solid ${form.sendNotification === v ? "#2f9be0" : "#e0e0e0"}`, borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: "600", backgroundColor: form.sendNotification === v ? "#e8f3fb" : "#f9f9f9", color: form.sendNotification === v ? "#2f9be0" : "#666" }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <OBtn onClick={() => { onSave({ ...form, id: form.id || `cons_${Date.now()}` }); }} style={{ flex: 1, justifyContent: "center" }}>
              Save
            </OBtn>
            <OBtn onClick={() => { onSave({ ...form, id: form.id || `cons_${Date.now()}`, locked: true }); }} style={{ flex: 1, justifyContent: "center", backgroundColor: "#2e7d32" }}>
              <Lock size={13} /> Save and lock
            </OBtn>
            <GhostBtn onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</GhostBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MEDICATION MODAL ─────────────────────────────────────────────────────────
function MedicationModal({ existing, healthProblems, onSave, onClose }) {
  const [form, setForm] = useState(existing || {
    startDate: today(), stopDate: today(),
    name: "", healthProblem: "",
    prescriber: "Unnikrishnan, R.S",
    dose: "", frequency: "",
    selfAdministered: "Yes",
    sideEffects: "", notes: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...card(), width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <OBtn onClick={onClose} style={{ padding: "5px 12px", fontSize: "12px", backgroundColor: "#e0e0e0", color: "#555" }}>Close</OBtn>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>Add Medication</span>
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Start Date</FieldLabel>
            <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Medication name</FieldLabel>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Medication" style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Health Problem</FieldLabel>
            <select value={form.healthProblem} onChange={e => set("healthProblem", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
              <option value="">Select Health Problem</option>
              {healthProblems.map(hp => <option key={hp.id} value={hp.id}>{hp.problem}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Prescriber</FieldLabel>
            <select value={form.prescriber} onChange={e => set("prescriber", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
              {PRESCRIBERS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", marginBottom: "12px" }}>
            <div>
              <FieldLabel>Dose</FieldLabel>
              <input value={form.dose} onChange={e => set("dose", e.target.value)} placeholder="Dose" style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
            </div>
            <div>
              <FieldLabel>Frequency</FieldLabel>
              <select value={form.frequency} onChange={e => set("frequency", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusOrange} onBlur={blurGray}>
                <option value="">Frequency</option>
                {FREQUENCY_OPTIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Stop date</FieldLabel>
            <input type="date" value={form.stopDate} onChange={e => set("stopDate", e.target.value)} style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Self-administered</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {["Yes","No"].map(v => (
                <button key={v} onClick={() => set("selfAdministered", v)}
                  style={{ padding: "8px", border: `1.5px solid ${form.selfAdministered === v ? "#2f9be0" : "#e0e0e0"}`, borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: "600", backgroundColor: form.selfAdministered === v ? "#e8f3fb" : "#f9f9f9", color: form.selfAdministered === v ? "#2f9be0" : "#666" }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <FieldLabel>Possible side effects</FieldLabel>
            <input value={form.sideEffects} onChange={e => set("sideEffects", e.target.value)} placeholder="Possible side effects" style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <OBtn onClick={() => { if (!form.name.trim()) { alert("Enter medication name."); return; } onSave({ ...form, id: form.id || `med_${Date.now()}` }); }} style={{ flex: 1, justifyContent: "center" }}>
              Save Medication
            </OBtn>
            <GhostBtn onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</GhostBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PARTICIPATION BADGE ──────────────────────────────────────────────────────
export function ParticipationBadge({ status }) {
  const cfg = {
    "Full participation":     { bg: "#f0faf0", color: "#2e7d32", border: "#b8e6b8" },
    "Modified participation": { bg: "#fff8e1", color: "#f9a825", border: "#ffe082" },
    "No participation":       { bg: "#fff0f0", color: "#cc3333", border: "#ffc5c5" },
    "Under observation":      { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
  };
  const c = cfg[status] || cfg["Full participation"];
  return (
    <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "20px", backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {status}
    </span>
  );
}

// ─── MAIN PLAYER MEDICAL RECORD ───────────────────────────────────────────────
export default function PlayerMedicalRecord({ player, onClose }) {
  const [healthProblems,    setHealthProblems]    = useState([
    {
      id: "hp_demo1", date: "2026-04-18", category: "Injury - Acute",
      problem: "Thigh (L) | Rectus femoris strain", bodyArea: "Thigh",
      participationStatus: "No participation",
      attachments: ["Edhan Apple Tom -MRI Report.pdf"],
      recordedBy: "Ronnie Chatterjee", notes: "", status: "Open",
    },
  ]);
  const [consultations,     setConsultations]     = useState([
    { id: "c1", date: "2026-05-07", healthProblem: "hp_demo1", category: "INJURY - ACUTE | Thigh (L) | Rectus femoris strain", notes: "Edhan completed the 4th day of rehabilitation successfully. No pain reported at ...", recordedBy: "R S Unnikrishnan", attachments: [], locked: false },
    { id: "c2", date: "2026-05-06", healthProblem: "hp_demo1", category: "INJURY - ACUTE | Thigh (L) | Rectus femoris strain", notes: "Follow-up consultation completed. The player has responded very well to the reha ...", recordedBy: "R S Unnikrishnan", attachments: [], locked: false },
    { id: "c3", date: "2026-05-05", healthProblem: "hp_demo1", category: "INJURY - ACUTE | Thigh (L) | Rectus femoris strain", notes: "Edhan attended the follow-up consultation today. He reports no ...", recordedBy: "R S Unnikrishnan", attachments: [], locked: false },
  ]);
  const [medications,       setMedications]       = useState([]);
  const [hpFilter,          setHpFilter]          = useState("Open");
  const [showHpModal,       setShowHpModal]       = useState(false);
  const [showConsModal,     setShowConsModal]     = useState(false);
  const [showMedModal,      setShowMedModal]      = useState(false);
  const [editHp,            setEditHp]            = useState(null);
  const [editCons,          setEditCons]          = useState(null);
  const [editMed,           setEditMed]           = useState(null);
  const [activeSection,     setActiveSection]     = useState("health"); // health | consultations | medications

  const totalInjuries   = healthProblems.length;
  const totalMissedDays = healthProblems.filter(h => h.participationStatus === "No participation").length * 5;
  const availability    = Math.max(0, Math.round(100 - (totalMissedDays / 30) * 100));

  const filteredHp = healthProblems.filter(h => hpFilter === "All" ? true : h.status === hpFilter);

  const saveHp   = hp   => { setHealthProblems(prev => prev.some(x => x.id === hp.id) ? prev.map(x => x.id === hp.id ? hp : x) : [...prev, { ...hp, status: "Open" }]); setShowHpModal(false); setEditHp(null); };
  const saveCons = cons => { setConsultations(prev => prev.some(x => x.id === cons.id) ? prev.map(x => x.id === cons.id ? cons : x) : [cons, ...prev]); setShowConsModal(false); setEditCons(null); };
  const saveMed  = med  => { setMedications(prev => prev.some(x => x.id === med.id) ? prev.map(x => x.id === med.id ? med : x) : [...prev, med]); setShowMedModal(false); setEditMed(null); };

  const closeHp   = hp  => setHealthProblems(prev => prev.map(x => x.id === hp.id ? { ...x, status: "Closed" } : x));
  const deleteHp  = id  => setHealthProblems(prev => prev.filter(x => x.id !== id));
  const deleteCons = id => setConsultations(prev => prev.filter(x => x.id !== id));
  const deleteMed  = id => setMedications(prev => prev.filter(x => x.id !== id));

  const TABS = [
    { key: "health",        label: "Health Problems",  count: healthProblems.length },
    { key: "consultations", label: "Consultations",    count: consultations.length  },
    { key: "medications",   label: "Medications",      count: medications.length    },
  ];

  return (
    <>
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px", overflowY: "auto" }}>
        <div style={{ ...card(), width: "100%", maxWidth: "920px", marginTop: "20px", overflow: "hidden" }}>

          <PageBanner title="Medical Record" sub="Health problems, consultations & medications" />

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #1a2340, #2d3a5c)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>
                {player.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>{player.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{player.role}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "22px", lineHeight: 1 }}>×</button>
          </div>

          {/* Stats strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", borderBottom: "1px solid #f0f0f0" }}>
            {[
              { label: "Injuries",    value: totalInjuries,   color: "#fff0f0",  textColor: "#cc3333" },
              { label: "Missed Days", value: totalMissedDays, color: "#fff8e1",  textColor: "#f9a825" },
              { label: "Availability",value: `${availability}%`, color: "#f0faf0", textColor: "#2e7d32" },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: "16px 20px", backgroundColor: s.color, borderRight: i < 2 ? "1px solid #f0f0f0" : "none", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: s.textColor }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tab nav */}
          <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", backgroundColor: "#fafafa", padding: "0 20px" }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveSection(tab.key)}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "13px 16px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", backgroundColor: "transparent", color: activeSection === tab.key ? "#2f9be0" : "#888", borderBottom: activeSection === tab.key ? "2px solid #2f9be0" : "2px solid transparent" }}>
                {tab.label}
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "1px 7px", borderRadius: "20px", backgroundColor: activeSection === tab.key ? "#e8f3fb" : "#f0f0f0", color: activeSection === tab.key ? "#2f9be0" : "#888" }}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: "20px 24px" }}>

            {/* ── HEALTH PROBLEMS ── */}
            {activeSection === "health" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>Health problems ({healthProblems.length})</span>
                    <div style={{ display: "flex", gap: "0", marginLeft: "12px" }}>
                      {["Open","Closed","All"].map(f => (
                        <button key={f} onClick={() => setHpFilter(f)}
                          style={{ padding: "4px 10px", border: "1px solid #e0e0e0", backgroundColor: hpFilter === f ? "#2f9be0" : "#fff", color: hpFilter === f ? "#fff" : "#666", fontSize: "12px", fontWeight: "600", cursor: "pointer", borderRadius: f === "Open" ? "5px 0 0 5px" : f === "All" ? "0 5px 5px 0" : "0" }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <OBtn onClick={() => { setEditHp(null); setShowHpModal(true); }} style={{ padding: "7px 14px", fontSize: "12px" }}>
                    <Plus size={13} /> Add New
                  </OBtn>
                </div>

                {filteredHp.length === 0 ? (
                  <div style={{ padding: "32px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>No health problems recorded</div>
                ) : (
                  <div className="scroll-x" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f9f9f9" }}>
                          {["Date","Category","Health problem","Participation status","Attachments","Recorded by",""].map(h => (
                            <th key={h} style={{ padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: "#888", textAlign: "left", borderBottom: "1px solid #e8e8e8" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHp.map((hp, i) => (
                          <tr key={hp.id} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.12s" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#fff" : "#fafafa")}
                          >
                            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#555", borderBottom: "1px solid #f5f5f5", whiteSpace: "nowrap" }}>{fmtDate(hp.date)}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#cc3333", borderBottom: "1px solid #f5f5f5", whiteSpace: "nowrap" }}>{hp.category}</td>
                            <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: "600", color: "#2f9be0", borderBottom: "1px solid #f5f5f5", cursor: "pointer", textDecoration: "underline" }}>{hp.problem}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f5f5" }}>
                              <ParticipationBadge status={hp.participationStatus} />
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#888", borderBottom: "1px solid #f5f5f5" }}>
                              {(hp.attachments || []).map((a, j) => (
                                <div key={j} style={{ display: "flex", alignItems: "center", gap: "4px", color: "#3b82f6", fontSize: "11px", cursor: "pointer" }}>
                                  <Paperclip size={10} />{a}
                                </div>
                              ))}
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5" }}>{hp.recordedBy}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f5f5" }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => { setEditHp(hp); setShowHpModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2f9be0", display: "flex" }}><Edit2 size={14} /></button>
                                <button onClick={() => deleteHp(hp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cc3333", display: "flex" }}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── CONSULTATIONS ── */}
            {activeSection === "consultations" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>Consultations ({consultations.length})</span>
                  <OBtn onClick={() => { setEditCons(null); setShowConsModal(true); }} style={{ padding: "7px 14px", fontSize: "12px" }}>
                    <Plus size={13} /> Add New
                  </OBtn>
                </div>

                {consultations.length === 0 ? (
                  <div style={{ padding: "32px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>No consultations recorded</div>
                ) : (
                  <div className="scroll-x" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f9f9f9" }}>
                          {["Date","Category","Health Problem","Notes","Attachments","Recorded by",""].map(h => (
                            <th key={h} style={{ padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: "#888", textAlign: "left", borderBottom: "1px solid #e8e8e8" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.map((c, i) => (
                          <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#fff" : "#fafafa")}
                          >
                            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#555", borderBottom: "1px solid #f5f5f5", whiteSpace: "nowrap" }}>{fmtDate(c.date)}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5", maxWidth: "180px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.category || c.consultationType || "—"}</div>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#888", borderBottom: "1px solid #f5f5f5" }}>
                              {healthProblems.find(h => h.id === c.healthProblem)?.problem || c.healthProblem || "—"}
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5", maxWidth: "220px" }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notes || "—"}</div>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "11px", color: "#888", borderBottom: "1px solid #f5f5f5" }}>
                              {(c.attachments || []).length > 0 ? (c.attachments || []).map((a, j) => <div key={j} style={{ color: "#3b82f6", display: "flex", alignItems: "center", gap: "3px" }}><Paperclip size={10} />{a}</div>) : "—"}
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5" }}>{c.recordedBy}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f5f5" }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                {!c.locked && <button onClick={() => { setEditCons(c); setShowConsModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2f9be0", display: "flex" }}><Edit2 size={14} /></button>}
                                {c.locked && <Lock size={13} style={{ color: "#aaa" }} />}
                                <button onClick={() => deleteCons(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cc3333", display: "flex" }}><X size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── MEDICATIONS ── */}
            {activeSection === "medications" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>Medications ({medications.length})</span>
                  <OBtn onClick={() => { setEditMed(null); setShowMedModal(true); }} style={{ padding: "7px 14px", fontSize: "12px" }}>
                    <Plus size={13} /> Add Medication
                  </OBtn>
                </div>

                {medications.length === 0 ? (
                  <div style={{ padding: "32px", textAlign: "center" }}>
                    <Pill size={32} style={{ color: "#ddd", margin: "0 auto 10px", display: "block" }} />
                    <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>No medications recorded</p>
                  </div>
                ) : (
                  <div className="scroll-x" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f9f9f9" }}>
                          {["Medication","Health Problem","Prescriber","Dose","Frequency","Start","Stop","Self-admin",""].map(h => (
                            <th key={h} style={{ padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: "#888", textAlign: "left", borderBottom: "1px solid #e8e8e8" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {medications.map((m, i) => (
                          <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#fff" : "#fafafa")}
                          >
                            <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: "700", color: "#222", borderBottom: "1px solid #f5f5f5" }}>{m.name}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#888", borderBottom: "1px solid #f5f5f5" }}>{healthProblems.find(h => h.id === m.healthProblem)?.problem || "—"}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5" }}>{m.prescriber}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5" }}>{m.dose || "—"}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5" }}>{m.frequency || "—"}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5", whiteSpace: "nowrap" }}>{fmtDate(m.startDate)}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", borderBottom: "1px solid #f5f5f5", whiteSpace: "nowrap" }}>{fmtDate(m.stopDate)}</td>
                            <td style={{ padding: "10px 12px", fontSize: "12px", borderBottom: "1px solid #f5f5f5" }}>
                              <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", backgroundColor: m.selfAdministered === "Yes" ? "#f0faf0" : "#fff0f0", color: m.selfAdministered === "Yes" ? "#2e7d32" : "#cc3333", border: `1px solid ${m.selfAdministered === "Yes" ? "#b8e6b8" : "#ffc5c5"}` }}>{m.selfAdministered}</span>
                            </td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f5f5" }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => { setEditMed(m); setShowMedModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2f9be0", display: "flex" }}><Edit2 size={14} /></button>
                                <button onClick={() => deleteMed(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cc3333", display: "flex" }}><X size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showHpModal   && <HealthProblemModal  existing={editHp}   player={player}          onSave={saveHp}   onClose={() => { setShowHpModal(false);   setEditHp(null);   }} />}
      {showConsModal && <ConsultationModal   existing={editCons} healthProblems={healthProblems} onSave={saveCons} onClose={() => { setShowConsModal(false); setEditCons(null); }} />}
      {showMedModal  && <MedicationModal     existing={editMed}  healthProblems={healthProblems} onSave={saveMed}  onClose={() => { setShowMedModal(false);  setEditMed(null);  }} />}
    </>
  );
}