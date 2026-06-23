// src/components/PhysioSessionForm.jsx
import { useState, useRef } from "react";
import {
  ArrowLeft, Upload, X, FileText, Save, Send,
  CheckCircle, Target, Plus, Trash2, Dumbbell,
  ChevronRight, ChevronLeft, Circle, CheckCircle2,
} from "lucide-react";

// ─── EXERCISE LIBRARY ─────────────────────────────────────────────────────────
const EXERCISES_TEXT = [
  { id: 1,  name: "Jumping Jacks",     muscle: "Full Body" },
  { id: 2,  name: "High Knees",        muscle: "Hip Flexors, Core" },
  { id: 3,  name: "Goblet Squats",     muscle: "Quads, Glutes, Core" },
  { id: 4,  name: "Dumbbell Lunges",   muscle: "Quads, Hamstrings" },
  { id: 5,  name: "Push-ups",          muscle: "Chest, Shoulders, Triceps" },
  { id: 6,  name: "Plank",             muscle: "Core, Shoulders" },
  { id: 7,  name: "Shoulder Taps",     muscle: "Core, Shoulders" },
  { id: 8,  name: "Glute Bridges",     muscle: "Glutes, Hamstrings" },
];

const EXERCISES_GIF = [
  { id: 9,  name: "Goblet Squat",          muscle: "Quads, Glutes, Core",      gif: "https://fitnessprogramer.com/wp-content/uploads/2023/01/Dumbbell-Goblet-Squat.gif" },
  { id: 10, name: "Med Ball Throws",       muscle: "Obliques, Core",            gif: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif" },
  { id: 11, name: "Hip Flexor Stretch",    muscle: "Hip Flexors, Quads",        gif: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" },
  { id: 12, name: "Thoracic Rotation",     muscle: "Thoracic Spine, Obliques",  gif: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif" },
  { id: 13, name: "Dumbbell Lunges",       muscle: "Quads, Hamstrings, Glutes", gif: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" },
  { id: 14, name: "Push-ups Wide",         muscle: "Chest, Shoulders, Triceps", gif: "https://media.giphy.com/media/XDSBGwnjvTpoZGJhxY/giphy.gif" },
  { id: 15, name: "Dead Hangs",            muscle: "Forearms, Shoulders, Back", gif: "https://media.giphy.com/media/3o7TKsQ8f6z6z6z6z6/giphy.gif" },
  { id: 16, name: "Foam Roll IT Band",     muscle: "IT Band, TFL",              gif: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" },
];

const ALL_EXERCISES = [...EXERCISES_TEXT, ...EXERCISES_GIF];

const EXERCISE_LIBRARY = [
  { id:"e1", name:"Core Activation in Side Lying", category:"Core",              defaultReps:"30 seconds", defaultRest:"60 seconds", defaultSets:3, equipment:"" },
  { id:"e2", name:"Crunch with Exercise Band",     category:"Core",              defaultReps:"10 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"Yellow exercise band" },
  { id:"e3", name:"Dead Bug",                      category:"Core",              defaultReps:"10 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"" },
  { id:"e4", name:"Hanging Straight Leg Raise",    category:"Core",              defaultReps:"10 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"Pull-up bar" },
  { id:"e5", name:"Oblique Crunch Side Lying",     category:"Core",              defaultReps:"10 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"" },
  { id:"e6", name:"Back Extension",                category:"Posterior Chain",   defaultReps:"10 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"" },
  { id:"e7", name:"Pallof Press Bosu Ball",        category:"Core Stability",    defaultReps:"10 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"Band, Bosu ball" },
  { id:"e8", name:"Single Leg Bosch Hold",         category:"Balance",           defaultReps:"30 seconds", defaultRest:"60 seconds", defaultSets:6, equipment:"" },
  { id:"e9", name:"Hamstring Bridge Walk Out",     category:"Posterior Chain",   defaultReps:"10 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"" },
  { id:"e10",name:"Goblet Squat",                  category:"Lower Body",        defaultReps:"12 reps",    defaultRest:"60 seconds", defaultSets:3, equipment:"Dumbbell" },
];

const EX_CATS = [...new Set(EXERCISE_LIBRARY.map(e => e.category))];

const WEEKS_META = [
  { week:1, label:"Week 1", totalGoals:10 },
  { week:2, label:"Week 2", totalGoals:10 },
  { week:3, label:"Week 3", totalGoals:10 },
  { week:4, label:"Week 4", totalGoals:10 },
  { week:5, label:"Week 5", totalGoals:10 },
  { week:6, label:"Week 6", totalGoals:8  },
  { week:7, label:"Week 7", totalGoals:7  },
];

const DIAGNOSIS_LOCATIONS = [
  "Knee pain","Shoulder pain","Lower back","Hamstring","Quad",
  "Ankle","Hip","Elbow","Wrist","Neck","Groin","Calf",
];

// ─── SHARED ───────────────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title }) => (
  <div style={{ backgroundColor: "#e8e8e8", borderRadius: "8px", padding: "10px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
    {Icon && <Icon size={14} style={{ color: "#555" }} />}
    <span style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>{title}</span>
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>{children}</div>
);

const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #d0d0d0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
    onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#d0d0d0")} />
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #d0d0d0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" }}
    onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#d0d0d0")} />
);

const OBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 20px", backgroundColor: "#2f9be0", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(47, 155, 224,0.28)", ...style }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2380c2")}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2f9be0")}
  >{children}</button>
);

const card = (x = {}) => ({ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...x });

// ─── UPLOAD HELPERS ───────────────────────────────────────────────────────────
const SingleUpload = ({ file, onFile, onRemove }) => {
  const ref = useRef();
  return (
    <div style={{ marginTop: "8px" }}>
      {!file ? (
        <button type="button" onClick={() => ref.current.click()}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", backgroundColor: "#2f9be0", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
          <Upload size={13} /> Upload
          <input ref={ref} type="file" style={{ display: "none" }} onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
        </button>
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 10px", backgroundColor: "#e8f3fb", border: "1px solid #cfe6f7", borderRadius: "6px" }}>
          <FileText size={13} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "12px", color: "#b05a00", fontWeight: "600" }}>{file.name}</span>
          <button type="button" onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", padding: "0", display: "flex" }}><X size={13} style={{ color: "#cc3333" }} /></button>
        </div>
      )}
    </div>
  );
};

const MultiUpload = ({ files, onAdd, onRemove, max = 4 }) => {
  const ref = useRef();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
      {files.map((f, i) => (
        <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 10px", backgroundColor: "#e8f3fb", border: "1px solid #cfe6f7", borderRadius: "6px" }}>
          <FileText size={12} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "11px", color: "#b05a00", fontWeight: "600" }}>{f.name}</span>
          <button type="button" onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0", display: "flex" }}><X size={12} style={{ color: "#cc3333" }} /></button>
        </div>
      ))}
      {files.length < max && (
        <button type="button" onClick={() => ref.current.click()}
          style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", backgroundColor: "#2f9be0", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
          <Upload size={12} /> Upload
          <input ref={ref} type="file" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) { onAdd(e.target.files[0]); e.target.value = ""; }}} />
        </button>
      )}
    </div>
  );
};

// ─── TAG INPUT ────────────────────────────────────────────────────────────────
const TagInput = ({ tags, onChange }) => {
  const [open, setOpen] = useState(false);
  const remove = t => onChange(tags.filter(x => x !== t));
  const add    = t => { if (!tags.includes(t)) onChange([...tags, t]); setOpen(false); };
  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(p => !p)}
        style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", padding: "8px 10px", border: "1.5px solid #d0d0d0", borderRadius: "7px", backgroundColor: "#f9f9f9", minHeight: "42px", cursor: "pointer" }}>
        {tags.map(t => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", backgroundColor: "#e8f3fb", border: "1px solid #cfe6f7", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: "#b05a00" }}>
            {t}
            <X size={11} style={{ cursor: "pointer", color: "#cc3333" }} onClick={e => { e.stopPropagation(); remove(t); }} />
          </span>
        ))}
        <span style={{ fontSize: "12px", color: "#aaa" }}>{tags.length === 0 ? "Select diagnosis locations…" : "+ Add more"}</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, backgroundColor: "#fff", border: "1.5px solid #e0e0e0", borderRadius: "8px", boxShadow: "0 4px 14px rgba(0,0,0,0.10)", zIndex: 100, maxHeight: "180px", overflowY: "auto" }}>
          {DIAGNOSIS_LOCATIONS.filter(d => !tags.includes(d)).map(d => (
            <div key={d} onClick={() => add(d)}
              style={{ padding: "9px 14px", fontSize: "13px", color: "#333", cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >{d}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── WORKOUT SELECTOR (4×2 text + 4×2 gif) ───────────────────────────────────
const WorkoutSelector = ({ selected, onChange }) => {
  const toggle = id => onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  const SectionDivider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#2f9be0", flexShrink: 0 }} />
      <span style={{ fontSize: "12px", fontWeight: "700", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
    </div>
  );

  return (
    <div style={{ marginTop: "4px" }}>
      {/* TEXT CARDS */}
      <SectionDivider label="Bodyweight & Drill Exercises" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", marginBottom: "24px" }}>
        {EXERCISES_TEXT.map(ex => {
          const on = selected.includes(ex.id);
          return (
            <div key={ex.id} onClick={() => toggle(ex.id)}
              style={{ padding: "12px 14px", borderRadius: "9px", border: on ? "2px solid #2f9be0" : "1.5px solid #e0e0e0", backgroundColor: on ? "#e8f3fb" : "#fafafa", cursor: "pointer", transition: "all 0.15s", position: "relative", boxShadow: on ? "0 2px 8px rgba(47, 155, 224,0.15)" : "0 1px 2px rgba(0,0,0,0.04)" }}
              onMouseEnter={e => { if (!on) { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.backgroundColor = "#fffaf5"; } }}
              onMouseLeave={e => { if (!on) { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.backgroundColor = "#fafafa"; } }}
            >
              {on && (
                <div style={{ position: "absolute", top: "8px", right: "8px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={11} color="#fff" />
                </div>
              )}
              <div style={{ fontSize: "13px", fontWeight: "700", color: on ? "#b05a00" : "#222", marginBottom: "5px", lineHeight: "1.3", paddingRight: on ? "22px" : "0" }}>{ex.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Target size={11} style={{ color: "#2f9be0", flexShrink: 0 }} />
                <span style={{ fontSize: "10px", color: "#999", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.muscle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* GIF CARDS */}
      <SectionDivider label="Guided Exercises" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "16px" }}>
        {EXERCISES_GIF.map(ex => {
          const on = selected.includes(ex.id);
          return (
            <div key={ex.id} onClick={() => toggle(ex.id)}
              style={{ borderRadius: "9px", border: on ? "2px solid #2f9be0" : "1.5px solid #e0e0e0", backgroundColor: on ? "#e8f3fb" : "#fff", overflow: "hidden", cursor: "pointer", transition: "all 0.15s", position: "relative", boxShadow: on ? "0 2px 10px rgba(47, 155, 224,0.18)" : "0 1px 3px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => { if (!on) { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.09)"; } }}
              onMouseLeave={e => { if (!on) { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; } }}
            >
              <div style={{ height: "100px", backgroundColor: "#f0f0f0", position: "relative", overflow: "hidden" }}>
                <img src={ex.gif} alt={ex.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                {on && (
                  <div style={{ position: "absolute", top: "6px", right: "6px", width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
                    <CheckCircle size={13} color="#fff" />
                  </div>
                )}
                <div style={{ position: "absolute", bottom: "5px", left: "5px", backgroundColor: "rgba(255,255,255,0.92)", fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "20px", color: "#2f9be0", border: "1px solid #cfe6f7", maxWidth: "88%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.muscle}</div>
              </div>
              <div style={{ padding: "9px 11px 11px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: on ? "#b05a00" : "#222", lineHeight: "1.3", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ex.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Target size={11} style={{ color: "#2f9be0", flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", color: "#999", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.muscle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {selected.length > 0 && (
        <div style={{ padding: "12px 16px", backgroundColor: "#f0faf0", border: "1.5px solid #b8e6b8", borderRadius: "9px", display: "flex", alignItems: "flex-start", gap: "9px" }}>
          <CheckCircle size={16} style={{ color: "#2e7d32", flexShrink: 0, marginTop: "1px" }} />
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#2e7d32", marginBottom: "6px" }}>{selected.length} exercise{selected.length > 1 ? "s" : ""} selected</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ALL_EXERCISES.filter(e => selected.includes(e.id)).map(e => (
                <span key={e.id} style={{ fontSize: "11px", fontWeight: "600", padding: "2px 9px", borderRadius: "20px", backgroundColor: "#e8f3fb", color: "#b05a00", border: "1px solid #cfe6f7" }}>{e.name}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PROGRAM BUILDER ─────────────────────────────────────────────────────────
const ProgramBuilder = ({ programs, setPrograms }) => {
  const [libOpen, setLibOpen]     = useState(false);
  const [catFilter, setCatFilter] = useState("All");
  const [editIdx, setEditIdx]     = useState(null);

  const filteredLib = catFilter === "All" ? EXERCISE_LIBRARY : EXERCISE_LIBRARY.filter(e => e.category === catFilter);

  const addExercise = ex => {
    setPrograms(prev => [...prev, { ...ex, instanceId: `${ex.id}_${Date.now()}`, reps: ex.defaultReps, rest: ex.defaultRest, sets: ex.defaultSets, notes: "" }]);
    setLibOpen(false);
  };

  const updEx = (idx, k, v) => setPrograms(prev => { const a = [...prev]; a[idx] = { ...a[idx], [k]: v }; return a; });
  const remEx = idx => setPrograms(prev => prev.filter((_, i) => i !== idx));

  const inputS = { width: "100%", padding: "6px 10px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "12px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}>
          <Dumbbell size={14} style={{ color: "#2f9be0" }} /> Exercises ({programs.length})
        </div>
        <OBtn onClick={() => setLibOpen(true)} style={{ padding: "6px 13px", fontSize: "12px" }}><Plus size={12} /> Add Exercise</OBtn>
      </div>

      {programs.length === 0 ? (
        <div style={{ padding: "24px", backgroundColor: "#f9f9f9", borderRadius: "9px", border: "1.5px dashed #e0e0e0", textAlign: "center" }}>
          <Dumbbell size={22} style={{ color: "#ddd", margin: "0 auto 8px", display: "block" }} />
          <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>No exercises added. Click "Add Exercise" to pick from the library.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {programs.map((ex, idx) => (
            <div key={ex.instanceId} style={{ border: "1.5px solid #e8e8e8", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 15px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{ex.name}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{ex.category}</div>
                </div>
                <button onClick={() => remEx(idx)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#cc3333", display: "flex", borderRadius: "6px" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fff0f0")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                ><Trash2 size={14} /></button>
              </div>
              <div style={{ padding: "11px 15px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px" }}>
                {[{ label: "REPS/TIME", key: "reps", val: ex.reps }, { label: "REST", key: "rest", val: ex.rest }, { label: "SETS", key: "sets", val: String(ex.sets) }, { label: "EQUIPMENT", key: "equipment", val: ex.equipment }].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "3px" }}>{f.label}</label>
                    <input value={f.val} onChange={e => updEx(idx, f.key, e.target.value)} style={inputS}
                      onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
                  </div>
                ))}
              </div>
              <div style={{ padding: "0 15px 11px" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "3px" }}>NOTES</label>
                <input value={ex.notes} onChange={e => updEx(idx, "notes", e.target.value)} placeholder="Additional notes..." style={inputS}
                  onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Library modal */}
      {libOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ ...card(), width: "100%", maxWidth: "620px", maxHeight: "78vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>Exercise Library</div><div style={{ fontSize: "12px", color: "#888", marginTop: "1px" }}>{EXERCISE_LIBRARY.length} exercises</div></div>
              <button onClick={() => setLibOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#aaa", lineHeight: 1, width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >×</button>
            </div>
            <div style={{ padding: "10px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", gap: "7px", flexWrap: "wrap" }}>
              {["All", ...EX_CATS].map(c => (
                <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "4px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: `1.5px solid ${catFilter === c ? "#2f9be0" : "#e0e0e0"}`, backgroundColor: catFilter === c ? "#e8f3fb" : "#f9f9f9", color: catFilter === c ? "#2f9be0" : "#666" }}>{c}</button>
              ))}
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filteredLib.map((ex, i) => (
                <div key={ex.id} onClick={() => addExercise(ex)}
                  style={{ display: "flex", alignItems: "center", gap: "13px", padding: "13px 20px", borderBottom: i < filteredLib.length - 1 ? "1px solid #f5f5f5" : "none", cursor: "pointer", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", backgroundColor: "#e8f3fb", border: "1.5px solid #cfe6f7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Dumbbell size={15} style={{ color: "#2f9be0" }} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{ex.name}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{ex.category} · {ex.defaultReps} · {ex.defaultSets} sets</div>
                  </div>
                  <div style={{ padding: "4px 10px", backgroundColor: "#e8f3fb", border: "1px solid #cfe6f7", borderRadius: "6px", fontSize: "11px", fontWeight: "700", color: "#2f9be0" }}>+ Add</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── WEEKLY GOALS BUILDER ────────────────────────────────────────────────────
const STATUS_OPTS = ["Not Started", "In Progress", "Completed", "At Risk"];
const STATUS_CFG = {
  "Not Started": { bg: "#f0f0f0", color: "#888",    border: "#e0e0e0" },
  "In Progress":  { bg: "#fff8e1", color: "#f9a825", border: "#ffe082" },
  "Completed":    { bg: "#f0faf0", color: "#2e7d32", border: "#b8e6b8" },
  "At Risk":      { bg: "#fff0f0", color: "#cc3333", border: "#ffc5c5" },
};

const WeeklyGoalsBuilder = ({ goals, setGoals }) => {
  const [activeWeek, setActiveWeek] = useState(1);
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalCat,  setNewGoalCat]  = useState("Clinical");

  const weekGoals = goals.filter(g => g.week === activeWeek);

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    setGoals(prev => [...prev, { id: `g_${Date.now()}`, week: activeWeek, text: newGoalText, category: newGoalCat, status: "Not Started", pain: 0, notes: "" }]);
    setNewGoalText("");
  };

  const updateGoalStatus = (id, status) => setGoals(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  const removeGoal = id => setGoals(prev => prev.filter(g => g.id !== id));

  const clinicalGoals = weekGoals.filter(g => g.category === "Clinical");
  const rehabGoals    = weekGoals.filter(g => g.category === "Rehabilitation");

  return (
    <div>
      {/* Week nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1a2340", borderRadius: "10px", padding: "14px 20px", marginBottom: "18px" }}>
        <button onClick={() => setActiveWeek(w => Math.max(1, w - 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", opacity: activeWeek === 1 ? 0.3 : 1, display: "flex" }}><ChevronLeft size={20} /></button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>Week {activeWeek}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{weekGoals.length} goal{weekGoals.length !== 1 ? "s" : ""} · {weekGoals.filter(g => g.status === "Completed").length} completed</div>
        </div>
        <button onClick={() => setActiveWeek(w => Math.min(7, w + 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", opacity: activeWeek === 7 ? 0.3 : 1, display: "flex" }}><ChevronRight size={20} /></button>
      </div>

      {/* Add goal */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input value={newGoalText} onChange={e => setNewGoalText(e.target.value)} placeholder="Add a new goal for this week..." onKeyDown={e => e.key === "Enter" && addGoal()}
          style={{ flex: 1, minWidth: "180px", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none" }}
          onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
        <select value={newGoalCat} onChange={e => setNewGoalCat(e.target.value)}
          style={{ padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "12px", color: "#555", backgroundColor: "#f9f9f9", outline: "none", cursor: "pointer" }}
          onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")}>
          <option>Clinical</option>
          <option>Rehabilitation</option>
        </select>
        <OBtn onClick={addGoal} style={{ padding: "9px 16px", fontSize: "12px" }}><Plus size={13} /> Add</OBtn>
      </div>

      {/* Goals list */}
      {weekGoals.length === 0 ? (
        <div style={{ padding: "24px", backgroundColor: "#f9f9f9", borderRadius: "9px", border: "1.5px dashed #e0e0e0", textAlign: "center" }}>
          <Circle size={22} style={{ color: "#ddd", margin: "0 auto 8px", display: "block" }} />
          <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>No goals for Week {activeWeek} yet. Add one above.</p>
        </div>
      ) : (
        <div>
          {/* Clinical */}
          {clinicalGoals.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "4px", height: "16px", backgroundColor: "#2f9be0", borderRadius: "2px" }} />
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>Clinical Goals</span>
              </div>
              {clinicalGoals.map(g => {
                const cfg = STATUS_CFG[g.status];
                return (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", backgroundColor: "#fff", borderRadius: "9px", border: "1px solid #e8e8e8", marginBottom: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    {g.status === "Completed" ? <CheckCircle2 size={18} style={{ color: "#2e7d32", flexShrink: 0 }} /> : <Circle size={18} style={{ color: "#ccc", flexShrink: 0 }} />}
                    <span style={{ flex: 1, fontSize: "13px", color: "#333" }}>{g.text}</span>
                    <select value={g.status} onChange={e => updateGoalStatus(g.id, e.target.value)}
                      style={{ padding: "3px 8px", border: `1.5px solid ${cfg.border}`, borderRadius: "20px", fontSize: "11px", fontWeight: "700", color: cfg.color, backgroundColor: cfg.bg, cursor: "pointer", outline: "none" }}>
                      {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => removeGoal(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", display: "flex", padding: "2px", borderRadius: "4px" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#cc3333")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                    ><X size={14} /></button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rehabilitation */}
          {rehabGoals.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "4px", height: "16px", backgroundColor: "#f9a825", borderRadius: "2px" }} />
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>Rehabilitation Goals</span>
              </div>
              {rehabGoals.map(g => {
                const cfg = STATUS_CFG[g.status];
                return (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", backgroundColor: "#fff", borderRadius: "9px", border: "1px solid #e8e8e8", marginBottom: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    {g.status === "Completed" ? <CheckCircle2 size={18} style={{ color: "#2e7d32", flexShrink: 0 }} /> : <Circle size={18} style={{ color: "#ccc", flexShrink: 0 }} />}
                    <span style={{ flex: 1, fontSize: "13px", color: "#333" }}>{g.text}</span>
                    <select value={g.status} onChange={e => updateGoalStatus(g.id, e.target.value)}
                      style={{ padding: "3px 8px", border: `1.5px solid ${cfg.border}`, borderRadius: "20px", fontSize: "11px", fontWeight: "700", color: cfg.color, backgroundColor: cfg.bg, cursor: "pointer", outline: "none" }}>
                      {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => removeGoal(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", display: "flex", padding: "2px", borderRadius: "4px" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#cc3333")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                    ><X size={14} /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN FORM ────────────────────────────────────────────────────────────────
const PhysioSessionForm = ({ player, report, onBack, onSave }) => {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");

  // Physio section
  const [subjective,        setSubjective]        = useState("");
  const [onExamination,     setOnExamination]      = useState("");
  // Differential Diagnosis
  const [specialTest,       setSpecialTest]        = useState("");
  const [xrayDesc,          setXrayDesc]           = useState("");
  const [xrayFiles,         setXrayFiles]          = useState([]);
  const [mriDesc,           setMriDesc]            = useState("");
  const [mriFiles,          setMriFiles]           = useState([]);
  const [usDesc,            setUsDesc]             = useState("");
  const [usFiles,           setUsFiles]            = useState([]);
  const [bloodDesc,         setBloodDesc]          = useState("");
  const [bloodFiles,        setBloodFiles]         = useState([]);
  const [diagLocations,     setDiagLocations]      = useState([]);
  const [diagDesc,          setDiagDesc]           = useState("");
  const [dischargeSummary,  setDischargeSummary]   = useState("");
  const [dischargeFile,     setDischargeFile]      = useState(null);
  // Treatment Goals
  const [goal,              setGoal]               = useState("");
  const [program,           setProgram]            = useState("");
  // Session Action
  const [sessionTab,        setSessionTab]         = useState("goals"); // "goals" | "program"
  const [weeklyGoals,       setWeeklyGoals]        = useState([]);
  const [programExercises,  setProgramExercises]   = useState([]);
  const [programName,       setProgramName]        = useState("");
  const [programNotes,      setProgramNotes]       = useState("");
  // Workout selector
  const [selectedWorkout,   setSelectedWorkout]    = useState([]);

  const handleSave = () => {
    onSave({
      subjective, onExamination, specialTest,
      diagLocations, diagDesc, dischargeSummary,
      goal, program,
      weeklyGoals, programExercises, programName, programNotes,
      selectedWorkout,
    });
  };

  const cardStyle = { backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e8e8e8", padding: "22px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" };
  const twoCol = (left, right) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>{left}{right}</div>
  );

  return (
    <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button onClick={onBack}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", backgroundColor: "#fff", border: "1.5px solid #e0e0e0", borderRadius: "8px", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#2f9be0")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#e0e0e0")}>
            <ArrowLeft size={17} style={{ color: "#555" }} />
          </button>
          <div>
            <div style={{ fontSize: "11px", color: "#2f9be0", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Create Session</div>
            <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>Assessment — {player?.name || "Player"}</h1>
          </div>
        </div>
        <div style={{ padding: "7px 14px", backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#555" }}>
          Date: <span style={{ color: "#2f9be0" }}>{today}</span>
        </div>
      </div>

      {/* ── PHYSIO ── */}
      <div style={cardStyle}>
        <SectionHeader title="Physio" />
        <div style={{ marginBottom: "20px" }}>
          <Label>Subjective</Label>
          <TextArea value={subjective} onChange={setSubjective} placeholder="Enter subjective description" rows={4} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Label>On Examination</Label>
          <TextArea value={onExamination} onChange={setOnExamination} placeholder="Enter examination findings" rows={4} />
        </div>
        <button style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 18px", backgroundColor: "#2f9be0", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          <span>👤</span> Pain Assessment
        </button>
      </div>

      {/* ── DIFFERENTIAL DIAGNOSIS ── */}
      <div style={cardStyle}>
        <SectionHeader title="Differential Diagnosis" />
        <div style={{ marginBottom: "20px" }}>
          <Label>Special Test</Label>
          <TextArea value={specialTest} onChange={setSpecialTest} placeholder="Enter special test findings" rows={3} />
        </div>
        {twoCol(
          <div>
            <Label>X-Ray</Label>
            <TextInput value={xrayDesc} onChange={setXrayDesc} placeholder="Description" />
            <MultiUpload files={xrayFiles} onAdd={f => setXrayFiles(p => [...p, f])} onRemove={i => setXrayFiles(p => p.filter((_, j) => j !== i))} />
          </div>,
          <div>
            <Label>MRI / CT</Label>
            <TextInput value={mriDesc} onChange={setMriDesc} placeholder="Description" />
            <MultiUpload files={mriFiles} onAdd={f => setMriFiles(p => [...p, f])} onRemove={i => setMriFiles(p => p.filter((_, j) => j !== i))} />
          </div>
        )}
        {twoCol(
          <div>
            <Label>Ultrasound</Label>
            <TextInput value={usDesc} onChange={setUsDesc} placeholder="Description" />
            <MultiUpload files={usFiles} onAdd={f => setUsFiles(p => [...p, f])} onRemove={i => setUsFiles(p => p.filter((_, j) => j !== i))} />
          </div>,
          <div>
            <Label>Blood Report</Label>
            <TextInput value={bloodDesc} onChange={setBloodDesc} placeholder="Description" />
            <MultiUpload files={bloodFiles} onAdd={f => setBloodFiles(p => [...p, f])} onRemove={i => setBloodFiles(p => p.filter((_, j) => j !== i))} />
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <Label>Diagnosis Location</Label>
          <TagInput tags={diagLocations} onChange={setDiagLocations} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Label>Diagnosis Description</Label>
          <TextArea value={diagDesc} onChange={setDiagDesc} placeholder="Enter diagnosis description" rows={3} />
        </div>
        <div>
          <Label>Discharge Summary</Label>
          <TextArea value={dischargeSummary} onChange={setDischargeSummary} placeholder="Enter discharge summary" rows={3} />
          <SingleUpload file={dischargeFile} onFile={setDischargeFile} onRemove={() => setDischargeFile(null)} />
        </div>
      </div>

      {/* ── TREATMENT GOALS ── */}
      <div style={cardStyle}>
        <SectionHeader title="Treatment Goals" />
        {twoCol(
          <div>
            <Label>Goal</Label>
            <TextArea value={goal} onChange={setGoal} placeholder="Enter treatment goal" rows={4} />
          </div>,
          <div>
            <Label>Program</Label>
            <TextArea value={program} onChange={setProgram} placeholder="Enter program description" rows={4} />
          </div>
        )}
      </div>

      {/* ── SESSION ACTION: WEEKLY GOALS & PROGRAMS ── */}
      <div style={cardStyle}>
        <SectionHeader icon={Target} title="Session Action — Weekly Goals & Programs" />

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "0", borderBottom: "2px solid #f0f0f0", marginBottom: "20px" }}>
          {[
            { key: "goals",   label: "Weekly Goals",    icon: CheckCircle2 },
            { key: "program", label: "Workout Program",  icon: Dumbbell     },
            { key: "workout", label: "Quick Exercises",  icon: Target       },
          ].map(tab => (
            <button key={tab.key} onClick={() => setSessionTab(tab.key)}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", backgroundColor: "transparent", color: sessionTab === tab.key ? "#2f9be0" : "#888", borderBottom: sessionTab === tab.key ? "2px solid #2f9be0" : "2px solid transparent", marginBottom: "-2px", transition: "all 0.15s" }}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* WEEKLY GOALS TAB */}
        {sessionTab === "goals" && (
          <WeeklyGoalsBuilder goals={weeklyGoals} setGoals={setWeeklyGoals} />
        )}

        {/* WORKOUT PROGRAM TAB */}
        {sessionTab === "program" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              <div>
                <Label>Program Name</Label>
                <input value={programName} onChange={e => setProgramName(e.target.value)} placeholder="e.g. Shoulder Rehab Phase 1"
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
              </div>
              <div>
                <Label>Program Notes</Label>
                <input value={programNotes} onChange={e => setProgramNotes(e.target.value)} placeholder="e.g. Light mobility only"
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
              </div>
            </div>
            <ProgramBuilder programs={programExercises} setPrograms={setProgramExercises} />
          </div>
        )}

        {/* QUICK EXERCISES TAB */}
        {sessionTab === "workout" && (
          <div>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px", lineHeight: "1.5" }}>
              Select individual exercises for today's session. 8 text-based drills + 8 guided exercises with demonstrations.
            </p>
            <WorkoutSelector selected={selectedWorkout} onChange={setSelectedWorkout} />
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", padding: "16px 22px", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <button onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 20px", backgroundColor: "#fff", color: "#555", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
        ><ArrowLeft size={15} /> Cancel</button>

        <OBtn onClick={handleSave}>
          <Save size={15} /> Save Session
        </OBtn>
      </div>
    </div>
  );
};

export default PhysioSessionForm;