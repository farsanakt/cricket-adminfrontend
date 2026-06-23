import { useState, useRef } from "react";
import {
  ArrowLeft, Upload, X, FileText, Save, Send, CheckCircle, Target,
} from "lucide-react";

// ─── TEXT exercises (8) ───────────────────────────────────────────────────────
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

// ─── GIF exercises (8) ───────────────────────────────────────────────────────
const EXERCISES_GIF = [
  { id: 9,  name: "Goblet Squat",          muscle: "Quads, Glutes, Core",      gif: "https://fitnessprogramer.com/wp-content/uploads/2023/01/Dumbbell-Goblet-Squat.gif" },
  { id: 10, name: "Med Ball Throws",       muscle: "Obliques, Core",            gif: "https://fitnessprogramer.com/wp-content/uploads/2024/03/Step-Behind-Rotational-Med-Ball-Throw.gif" },
  { id: 11, name: "Hip Flexor Stretch",    muscle: "Hip Flexors, Quads",        gif: "https://fitnessprogramer.com/wp-content/uploads/2021/08/Kneeling-Hip-Flexor-Stretch.gif" },
  { id: 12, name: "Thoracic Rotation",     muscle: "Thoracic Spine, Obliques",  gif: "https://fitnessprogramer.com/wp-content/uploads/2022/08/Kneeling-T-spine-Rotation.gif" },
  { id: 13, name: "Lunges",               muscle: "Quads, Hamstrings, Glutes", gif: "https://burnfit.io/en/wp-content/uploads/sites/3/2026/01/DB_LUNGE-2.gif" },
  { id: 14, name: "Push-ups Wide",         muscle: "Chest, Shoulders, Triceps", gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif" },
  { id: 15, name: "Dead Hangs",            muscle: "Forearms, Shoulders, Back", gif: "https://www.docteur-fitness.com/wp-content/uploads/2025/11/dead-hang-suspension-passive.gif" },
  { id: 16, name: "Foam Roll IT Band",     muscle: "IT Band, TFL",              gif: "https://fitnessprogramer.com/wp-content/uploads/2022/02/Foam-Roller-IT-iliotibial-Band-Stretch.gif" },
];

const ALL_EXERCISES = [...EXERCISES_TEXT, ...EXERCISES_GIF];

const DIAGNOSIS_LOCATIONS = [
  "Knee pain","Shoulder pain","Lower back","Hamstring","Quad",
  "Ankle","Hip","Elbow","Wrist","Neck","Groin","Calf",
];

// ─── Shared sub-components ────────────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <div style={{
    backgroundColor: "#e8e8e8", borderRadius: "8px",
    padding: "10px 16px", marginBottom: "20px",
  }}>
    <span style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>{title}</span>
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>
    {children}
  </div>
);

const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: "100%", padding: "10px 12px",
      border: "1.5px solid #d0d0d0", borderRadius: "7px",
      fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9",
      outline: "none", resize: "vertical", boxSizing: "border-box",
      fontFamily: "inherit",
    }}
    onFocus={(e) => (e.target.style.borderColor = "#2f9be0")}
    onBlur={(e)  => (e.target.style.borderColor = "#d0d0d0")}
  />
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%", padding: "10px 12px",
      border: "1.5px solid #d0d0d0", borderRadius: "7px",
      fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9",
      outline: "none", boxSizing: "border-box",
    }}
    onFocus={(e) => (e.target.style.borderColor = "#2f9be0")}
    onBlur={(e)  => (e.target.style.borderColor = "#d0d0d0")}
  />
);

const SingleUpload = ({ file, onFile, onRemove }) => {
  const ref = useRef();
  return (
    <div style={{ marginTop: "8px" }}>
      {!file ? (
        <button type="button" onClick={() => ref.current.click()}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 14px", backgroundColor: "#2f9be0",
            color: "#fff", border: "none", borderRadius: "6px",
            fontSize: "12px", fontWeight: "700", cursor: "pointer",
          }}>
          <Upload size={13} /> Upload
          <input ref={ref} type="file" style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
        </button>
      ) : (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "5px 10px", backgroundColor: "#e8f3fb",
          border: "1px solid #cfe6f7", borderRadius: "6px",
        }}>
          <FileText size={13} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "12px", color: "#b05a00", fontWeight: "600" }}>{file.name}</span>
          <button type="button" onClick={onRemove}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0", display: "flex" }}>
            <X size={13} style={{ color: "#cc3333" }} />
          </button>
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
        <div key={i} style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "5px 10px", backgroundColor: "#e8f3fb",
          border: "1px solid #cfe6f7", borderRadius: "6px",
        }}>
          <FileText size={12} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "11px", color: "#b05a00", fontWeight: "600" }}>{f.name}</span>
          <button type="button" onClick={() => onRemove(i)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0", display: "flex" }}>
            <X size={12} style={{ color: "#cc3333" }} />
          </button>
        </div>
      ))}
      {files.length < max && (
        <button type="button" onClick={() => ref.current.click()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "5px 12px", backgroundColor: "#2f9be0",
            color: "#fff", border: "none", borderRadius: "6px",
            fontSize: "12px", fontWeight: "700", cursor: "pointer",
          }}>
          <Upload size={12} /> Upload
          <input ref={ref} type="file" style={{ display: "none" }}
            onChange={(e) => { if (e.target.files[0]) { onAdd(e.target.files[0]); e.target.value = ""; }}} />
        </button>
      )}
    </div>
  );
};

const TagInput = ({ tags, onChange }) => {
  const [open, setOpen] = useState(false);
  const remove = (t) => onChange(tags.filter((x) => x !== t));
  const add    = (t) => { if (!tags.includes(t)) onChange([...tags, t]); setOpen(false); };
  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center",
          padding: "8px 10px", border: "1.5px solid #d0d0d0", borderRadius: "7px",
          backgroundColor: "#f9f9f9", minHeight: "42px", cursor: "pointer",
        }}>
        {tags.map((t) => (
          <span key={t} style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "3px 9px", backgroundColor: "#e8f3fb",
            border: "1px solid #cfe6f7", borderRadius: "20px",
            fontSize: "12px", fontWeight: "600", color: "#b05a00",
          }}>
            {t}
            <X size={11} style={{ cursor: "pointer", color: "#cc3333" }}
              onClick={(e) => { e.stopPropagation(); remove(t); }} />
          </span>
        ))}
        <span style={{ fontSize: "12px", color: "#aaa" }}>
          {tags.length === 0 ? "Select diagnosis locations…" : "+ Add more"}
        </span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          backgroundColor: "#fff", border: "1.5px solid #e0e0e0",
          borderRadius: "8px", boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
          zIndex: 100, maxHeight: "180px", overflowY: "auto",
        }}>
          {DIAGNOSIS_LOCATIONS.filter((d) => !tags.includes(d)).map((d) => (
            <div key={d} onClick={() => add(d)}
              style={{
                padding: "9px 14px", fontSize: "13px", color: "#333",
                cursor: "pointer", borderBottom: "1px solid #f5f5f5",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RadioOpt = ({ label, value, current, onChange, desc }) => {
  const active = current === value;
  return (
    <div
      onClick={() => onChange(value)}
      style={{
        display: "flex", alignItems: "flex-start", gap: "10px",
        padding: "12px 16px",
        border: `1.5px solid ${active ? "#2f9be0" : "#e0e0e0"}`,
        borderRadius: "9px", cursor: "pointer",
        backgroundColor: active ? "#e8f3fb" : "#fff",
        transition: "all 0.15s", flex: 1, minWidth: "180px",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "#2f9be0"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "#e0e0e0"; }}
    >
      <div style={{
        width: "18px", height: "18px", borderRadius: "50%",
        border: `2px solid ${active ? "#2f9be0" : "#ccc"}`,
        backgroundColor: active ? "rgba(47, 155, 224,0.1)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: "1px",
      }}>
        {active && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#2f9be0" }} />}
      </div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: "700", color: active ? "#2f9be0" : "#333" }}>{label}</div>
        {desc && <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{desc}</div>}
      </div>
    </div>
  );
};

// ─── Workout selector ─────────────────────────────────────────────────────────
const WorkoutSelector = ({ selected, onChange }) => {
  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const SectionDivider = ({ label }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px",
    }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#2f9be0", flexShrink: 0 }} />
      <span style={{ fontSize: "12px", fontWeight: "700", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
    </div>
  );

  return (
    <div style={{ marginTop: "4px" }}>

      {/* ── TEXT CARDS: 4 per row × 2 rows ── */}
      <SectionDivider label="Bodyweight & Drill Exercises" />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "8px",
        marginBottom: "28px",
      }}>
        {EXERCISES_TEXT.map((ex) => {
          const on = selected.includes(ex.id);
          return (
            <div
              key={ex.id}
              onClick={() => toggle(ex.id)}
              style={{
                padding: "12px 14px", borderRadius: "9px",
                border: on ? "2px solid #2f9be0" : "1.5px solid #e0e0e0",
                backgroundColor: on ? "#e8f3fb" : "#fafafa",
                cursor: "pointer", transition: "all 0.15s", position: "relative",
                boxShadow: on ? "0 2px 8px rgba(47, 155, 224,0.15)" : "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (!on) { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.backgroundColor = "#fffaf5"; }
              }}
              onMouseLeave={(e) => {
                if (!on) { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.backgroundColor = "#fafafa"; }
              }}
            >
              {on && (
                <div style={{
                  position: "absolute", top: "8px", right: "8px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  backgroundColor: "#2f9be0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CheckCircle size={11} color="#fff" />
                </div>
              )}
              <div style={{
                fontSize: "13px", fontWeight: "700",
                color: on ? "#b05a00" : "#222",
                marginBottom: "5px", lineHeight: "1.3",
                paddingRight: on ? "22px" : "0",
              }}>
                {ex.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Target size={11} style={{ color: "#2f9be0", flexShrink: 0 }} />
                <span style={{ fontSize: "10px", color: "#999", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ex.muscle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── GIF CARDS: 4 per row × 2 rows ── */}
      <SectionDivider label="Guided Exercises" />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "10px",
        marginBottom: "20px",
      }}>
        {EXERCISES_GIF.map((ex) => {
          const on = selected.includes(ex.id);
          return (
            <div
              key={ex.id}
              onClick={() => toggle(ex.id)}
              style={{
                borderRadius: "9px",
                border: on ? "2px solid #2f9be0" : "1.5px solid #e0e0e0",
                backgroundColor: on ? "#e8f3fb" : "#fff",
                overflow: "hidden", cursor: "pointer",
                transition: "all 0.15s", position: "relative",
                boxShadow: on ? "0 2px 10px rgba(47, 155, 224,0.18)" : "0 1px 3px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                if (!on) { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.09)"; }
              }}
              onMouseLeave={(e) => {
                if (!on) { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }
              }}
            >
              {/* GIF area */}
              <div style={{ height: "110px", backgroundColor: "#f0f0f0", position: "relative", overflow: "hidden" }}>
                <img
                  src={ex.gif}
                  alt={ex.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                {on && (
                  <div style={{
                    position: "absolute", top: "6px", right: "6px",
                    width: "22px", height: "22px", borderRadius: "50%",
                    backgroundColor: "#2f9be0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}>
                    <CheckCircle size={13} color="#fff" />
                  </div>
                )}
                <div style={{
                  position: "absolute", bottom: "5px", left: "5px",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  fontSize: "9px", fontWeight: "700",
                  padding: "2px 7px", borderRadius: "20px",
                  color: "#2f9be0", border: "1px solid #cfe6f7",
                  maxWidth: "88%", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {ex.muscle}
                </div>
              </div>

              {/* Text below GIF */}
              <div style={{ padding: "9px 11px 11px" }}>
                <div style={{
                  fontSize: "12px", fontWeight: "700",
                  color: on ? "#b05a00" : "#222",
                  lineHeight: "1.3", marginBottom: "4px",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {ex.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Target size={11} style={{ color: "#2f9be0", flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", color: "#999", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ex.muscle}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      {selected.length > 0 && (
        <div style={{
          padding: "12px 16px", backgroundColor: "#f0faf0",
          border: "1.5px solid #b8e6b8", borderRadius: "9px",
          display: "flex", alignItems: "flex-start", gap: "9px",
        }}>
          <CheckCircle size={16} style={{ color: "#2e7d32", flexShrink: 0, marginTop: "1px" }} />
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#2e7d32", marginBottom: "6px" }}>
              {selected.length} exercise{selected.length > 1 ? "s" : ""} selected
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ALL_EXERCISES.filter((e) => selected.includes(e.id)).map((e) => (
                <span key={e.id} style={{
                  fontSize: "11px", fontWeight: "600", padding: "2px 9px",
                  borderRadius: "20px", backgroundColor: "#e8f3fb",
                  color: "#b05a00", border: "1px solid #cfe6f7",
                }}>
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main form ────────────────────────────────────────────────────────────────
const PhysioSessionForm = ({ player, report, onBack, onSave }) => {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).replace(/\//g, "-");

  const [subjective,       setSubjective]       = useState("");
  const [onExamination,    setOnExamination]    = useState("");
  const [specialTest,      setSpecialTest]      = useState("");
  const [xrayDesc,         setXrayDesc]         = useState("");
  const [xrayFiles,        setXrayFiles]        = useState([]);
  const [mriDesc,          setMriDesc]          = useState("");
  const [mriFiles,         setMriFiles]         = useState([]);
  const [usDesc,           setUsDesc]           = useState("");
  const [usFiles,          setUsFiles]          = useState([]);
  const [bloodDesc,        setBloodDesc]        = useState("");
  const [bloodFiles,       setBloodFiles]       = useState([]);
  const [diagLocations,    setDiagLocations]    = useState([]);
  const [diagDesc,         setDiagDesc]         = useState("");
  const [dischargeSummary, setDischargeSummary] = useState("");
  const [dischargeFile,    setDischargeFile]    = useState(null);
  const [goal,             setGoal]             = useState("");
  const [program,          setProgram]          = useState("");
  const [sessionAction,    setSessionAction]    = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const handleSave = () => {
    onSave({
      subjective, onExamination, specialTest,
      diagLocations, diagDesc, dischargeSummary,
      goal, program, sessionAction,
      selectedExercises,
    });
  };

  const cardStyle = {
    backgroundColor: "#fff", borderRadius: "10px",
    border: "1px solid #e8e8e8", padding: "22px",
    marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  };

  const twoCol = (left, right) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
      {left}{right}
    </div>
  );

  return (
    <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "24px", flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "36px", height: "36px", backgroundColor: "#fff",
              border: "1.5px solid #e0e0e0", borderRadius: "8px", cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2f9be0")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
          >
            <ArrowLeft size={17} style={{ color: "#555" }} />
          </button>
          <div>
            <div style={{ fontSize: "11px", color: "#2f9be0", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Create Session
            </div>
            <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>
              Assessment — {player?.name || "Player"}
            </h1>
          </div>
        </div>
        <div style={{
          padding: "7px 14px", backgroundColor: "#f5f5f5",
          border: "1px solid #e0e0e0", borderRadius: "8px",
          fontSize: "13px", fontWeight: "600", color: "#555",
        }}>
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
        <button style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "9px 18px", backgroundColor: "#2f9be0",
          color: "#fff", border: "none", borderRadius: "7px",
          fontSize: "13px", fontWeight: "700", cursor: "pointer",
        }}>
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
            <MultiUpload files={xrayFiles}
              onAdd={(f) => setXrayFiles((p) => [...p, f])}
              onRemove={(i) => setXrayFiles((p) => p.filter((_, j) => j !== i))} />
          </div>,
          <div>
            <Label>MRI / CT</Label>
            <TextInput value={mriDesc} onChange={setMriDesc} placeholder="Description" />
            <MultiUpload files={mriFiles}
              onAdd={(f) => setMriFiles((p) => [...p, f])}
              onRemove={(i) => setMriFiles((p) => p.filter((_, j) => j !== i))} />
          </div>
        )}

        {twoCol(
          <div>
            <Label>Ultrasound</Label>
            <TextInput value={usDesc} onChange={setUsDesc} placeholder="Description" />
            <MultiUpload files={usFiles}
              onAdd={(f) => setUsFiles((p) => [...p, f])}
              onRemove={(i) => setUsFiles((p) => p.filter((_, j) => j !== i))} />
          </div>,
          <div>
            <Label>Blood Report</Label>
            <TextInput value={bloodDesc} onChange={setBloodDesc} placeholder="Description" />
            <MultiUpload files={bloodFiles}
              onAdd={(f) => setBloodFiles((p) => [...p, f])}
              onRemove={(i) => setBloodFiles((p) => p.filter((_, j) => j !== i))} />
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
          <SingleUpload
            file={dischargeFile}
            onFile={setDischargeFile}
            onRemove={() => setDischargeFile(null)}
          />
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

      {/* ── SESSION ACTION ── */}
      <div style={cardStyle}>
        {/* <SectionHeader title="Session Action" /> */}
        {/* <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: sessionAction === "workout" ? "20px" : "0" }}>
          <RadioOpt label="Refer to Doctor"  value="refer"   current={sessionAction} onChange={setSessionAction} desc="Forward to medical team" />
          <RadioOpt label="Plan Workout"     value="workout" current={sessionAction} onChange={setSessionAction} desc="Assign a recovery exercise plan" />
        </div> */}

        {sessionAction === "workout" && (
          <div style={{
            marginTop: "16px", padding: "18px",
            backgroundColor: "#fdf8f4",
            border: "1.5px solid #cfe6f7", borderRadius: "10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                backgroundColor: "#2f9be0",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 6px rgba(47, 155, 224,0.3)",
              }}>
                <span style={{ fontSize: "16px" }}>💪</span>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#333" }}>Select Exercises</div>
                <div style={{ fontSize: "11px", color: "#888" }}>Choose from text drills and guided GIF exercises</div>
              </div>
            </div>
            <WorkoutSelector selected={selectedExercises} onChange={setSelectedExercises} />
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      <div style={{
        display: "flex", justifyContent: "flex-end", gap: "12px",
        padding: "16px 22px", backgroundColor: "#fff",
        borderRadius: "10px", border: "1px solid #e8e8e8",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "10px 20px", backgroundColor: "#fff",
            color: "#555", border: "1.5px solid #e0e0e0",
            borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
        >
          <ArrowLeft size={15} /> Cancel
        </button>

        {/* <button
          onClick={() => { setSessionAction("refer"); setTimeout(handleSave, 50); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "10px 20px", backgroundColor: "#fff0f0",
            color: "#cc3333", border: "1.5px solid #ffc5c5",
            borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe0e0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff0f0")}
        >
          <Send size={15} /> Refer to Doctor
        </button> */}

        <button
          onClick={handleSave}
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "10px 24px", backgroundColor: "#2f9be0",
            color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "13px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(47, 155, 224,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2380c2")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2f9be0")}
        >
          <Save size={15} /> Save Session
        </button>
      </div>
    </div>
  );
};

export default PhysioSessionForm;