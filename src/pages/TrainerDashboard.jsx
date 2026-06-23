import { useState, useRef, useEffect } from "react";
import {
  ChevronRight, ChevronLeft, ArrowLeft, Users, Calendar,
  Activity, AlertCircle, Edit2, BarChart2, Plus, Trash2,
  Clock, Dumbbell, FileText, Eye, Check, X, Save,
  TrendingUp, Target, Zap, CheckCircle2, Search,
  Filter, Star, RotateCcw, RefreshCw,
} from "lucide-react";
import { exitingExercises } from "../api/authApi"; // ← adjust to your actual api path

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const card = (x = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...x,
});
const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "22px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", margin: 0 }}>{title}</h1>
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
const OBtn = ({ children, onClick, style = {}, disabled = false, type = "button" }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 20px", backgroundColor: disabled ? "#e0e0e0" : "#2f9be0", color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 2px 8px rgba(47,155,224,0.28)", ...style }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = "#2589c9"; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = disabled ? "#e0e0e0" : (style.backgroundColor || "#2f9be0"); }}
  >{children}</button>
);
const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0",
  borderRadius: "7px", fontSize: "13px", color: "#333",
  backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const fo = e => (e.target.style.borderColor = "#2f9be0");
const fb = e => (e.target.style.borderColor = "#e0e0e0");

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_PLAYERS = [
  { id: 1, name: "Rahul Das",    role: "Bowler",       status: "Injured", avatar: "RD" },
  { id: 2, name: "Arjun Menon", role: "Batsman",       status: "Active",  avatar: "AM" },
  { id: 3, name: "Vivek Pillai",role: "All-rounder",   status: "Active",  avatar: "VP" },
  { id: 4, name: "Nikhil K",    role: "Wicket-keeper", status: "Active",  avatar: "NK" },
];

const SESSION_TYPES = ["Strength","Conditioning","Bowling","Batting","Fielding","Net Practice","Recovery","Fitness Test","Match","Other"];
const DAYS_LABELS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const ROW_LABELS    = ["Strength","Conditioning","Cricket/Other","Location","Recovery/treatment","Practitioner","Fixtures"];
const buildGrid     = () => { const g = {}; for (let w = 1; w <= 7; w++) { g[w] = {}; DAYS_LABELS.forEach((_, i) => { g[w][i] = {}; ROW_LABELS.forEach(r => { g[w][i][r] = ""; }); }); } return g; };
const WEEK_DATES    = { 1:["6 May","7 May","8 May","9 May","10 May","11 May","12 May"],2:["13 May","14 May","15 May","16 May","17 May","18 May","19 May"],3:["20 May","21 May","22 May","23 May","24 May","25 May","26 May"],4:["27 May","28 May","29 May","30 May","31 May","1 Jun","2 Jun"],5:["3 Jun","4 Jun","5 Jun","6 Jun","7 Jun","8 Jun","9 Jun"],6:["10 Jun","11 Jun","12 Jun","13 Jun","14 Jun","15 Jun","16 Jun"],7:["17 Jun","18 Jun","19 Jun","20 Jun","21 Jun","22 Jun","23 Jun"] };

// Exercise library is loaded from backend via exitingExercises() inside ExerciseSearchModal

// Workload mock data
const WORKLOAD_DAYS = [
  { date:"Nov 22", training:0,   competition:840, acuteLoad:210, chronicLoad:180, freshness:-30,  acwr:1.17, sessions:2 },
  { date:"Nov 23", training:92,  competition:0,   acuteLoad:280, chronicLoad:200, freshness:-80,  acwr:1.40, sessions:1 },
  { date:"Nov 24", training:34,  competition:0,   acuteLoad:270, chronicLoad:210, freshness:-60,  acwr:1.29, sessions:1 },
  { date:"Nov 25", training:0,   competition:630, acuteLoad:320, chronicLoad:220, freshness:-100, acwr:1.45, sessions:2 },
  { date:"Nov 26", training:119, competition:0,   acuteLoad:300, chronicLoad:225, freshness:-75,  acwr:1.33, sessions:1 },
  { date:"Nov 27", training:177, competition:0,   acuteLoad:280, chronicLoad:230, freshness:-50,  acwr:1.22, sessions:1 },
  { date:"Nov 28", training:142, competition:0,   acuteLoad:265, chronicLoad:232, freshness:-33,  acwr:1.14, sessions:1 },
  { date:"Nov 29", training:0,   competition:0,   acuteLoad:250, chronicLoad:233, freshness:-17,  acwr:1.07, sessions:0 },
  { date:"Nov 30", training:0,   competition:0,   acuteLoad:235, chronicLoad:233, freshness:0,    acwr:1.01, sessions:0 },
  { date:"Dec 01", training:59,  competition:0,   acuteLoad:220, chronicLoad:232, freshness:12,   acwr:0.95, sessions:1 },
  { date:"Dec 02", training:47,  competition:0,   acuteLoad:200, chronicLoad:230, freshness:30,   acwr:0.87, sessions:1 },
  { date:"Dec 03", training:0,   competition:0,   acuteLoad:185, chronicLoad:227, freshness:42,   acwr:0.81, sessions:0 },
  { date:"Dec 04", training:38,  competition:0,   acuteLoad:175, chronicLoad:224, freshness:49,   acwr:0.78, sessions:1 },
  { date:"Dec 05", training:29,  competition:0,   acuteLoad:168, chronicLoad:220, freshness:52,   acwr:0.76, sessions:1 },
  { date:"Dec 06", training:22,  competition:0,   acuteLoad:162, chronicLoad:216, freshness:54,   acwr:0.75, sessions:1 },
  { date:"Dec 07", training:18,  competition:0,   acuteLoad:158, chronicLoad:212, freshness:54,   acwr:0.74, sessions:1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE SEARCH MODAL  — data from backend via exitingExercises()
// Backend shape: { success, count, workouts: [{ name, category, jointArea,
//   position, difficulty, duration, reps, gifUrl, description }, ...] }
// ─────────────────────────────────────────────────────────────────────────────
function ExerciseSearchModal({ onAdd, onClose }) {
  // ── data ──
  const [exercises, setExercises] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [fetchErr,  setFetchErr]  = useState("");

  // ── filters ──
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [jntFilter, setJntFilter] = useState("All");

  // ── right-panel state ──
  const [selected,  setSelected]  = useState(null);
  const [sets,      setSets]       = useState(3);
  const [reps,      setReps]       = useState(10);
  const [rest,      setRest]       = useState(60);
  const [duration,  setDuration]   = useState("");
  const [equipment, setEquipment]  = useState("");
  const [notes,     setNotes]      = useState("");
  const [imgErr,    setImgErr]     = useState(false);

  // ── fetch from backend ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchErr("");
      try {
        const res = await exitingExercises();
        setExercises(res.data.workouts || []);
      } catch (err) {
        console.error(err);
        setFetchErr("Failed to load exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── derived category / joint lists from real data ──
  const categories = ["All", ...Array.from(new Set(exercises.map(e => e.category).filter(Boolean)))];
  const joints     = ["All", ...Array.from(new Set(exercises.map(e => e.jointArea).filter(Boolean)))];

  // ── filter ──
  const filtered = exercises.filter(e => {
    const q = search.toLowerCase();
    return (
      (!q || e.name?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q)) &&
      (catFilter === "All" || e.category === catFilter) &&
      (jntFilter === "All" || e.jointArea === jntFilter)
    );
  });

  // ── select ──
  const selectEx = ex => {
    setSelected(ex);
    setImgErr(false);
    // pre-fill from backend defaults where available
    setSets(3);
    setReps(ex.reps ? parseInt(ex.reps) || 10 : 10);
    setRest(60);
    setDuration(ex.duration || "");
    setEquipment("");
    setNotes(ex.description || "");
  };

  // ── build exercise row for session ──
  const handleAdd = () => {
    if (!selected) return;
    onAdd({
      name:        selected.name || "",
      sets:        String(sets),
      reps:        reps > 0 ? `${reps} reps` : (selected.reps || ""),
      rest:        `${rest}s`,
      duration:    duration || selected.duration || "",
      equipment:   equipment || "",
      description: notes || selected.description || "",
      load:        "",
    });
  };

  // ── category color map (built from live categories) ──
  const CAT_PALETTE = [
    "#2f9be0","#3b82f6","#7c3aed","#2e7d32","#db2777","#059669","#f59e0b","#0ea5e9","#dc2626","#64748b",
  ];
  const catColorMap = {};
  categories.filter(c => c !== "All").forEach((c, i) => {
    catColorMap[c] = CAT_PALETTE[i % CAT_PALETTE.length];
  });
  const catColor = cat => catColorMap[cat] || "#888";

  const SpinBtn = ({ label, val, setVal, min = 0, max = 999 }) => (
    <div>
      <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>{label}</label>
      <div style={{ display:"flex", alignItems:"center", border:"1.5px solid #e0e0e0", borderRadius:"7px", overflow:"hidden" }}>
        <button onClick={() => setVal(v => Math.max(min, v - 1))}
          style={{ padding:"7px 10px", background:"none", border:"none", borderRight:"1px solid #e0e0e0", cursor:"pointer", color:"#888", fontSize:"14px", fontWeight:"700" }}>−</button>
        <input type="number" value={val} onChange={e => setVal(Number(e.target.value))}
          style={{ width:"44px", textAlign:"center", border:"none", outline:"none", fontSize:"14px", fontWeight:"800", color:"#222", backgroundColor:"#fff", padding:"7px 0" }} />
        <button onClick={() => setVal(v => Math.min(max, v + 1))}
          style={{ padding:"7px 10px", background:"none", border:"none", borderLeft:"1px solid #e0e0e0", cursor:"pointer", color:"#888", fontSize:"14px", fontWeight:"700" }}>+</button>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.5)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
      <div style={{ backgroundColor:"#fff", borderRadius:"14px", width:"100%", maxWidth:"860px", maxHeight:"92vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"16px 22px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#2f9be0", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"2px" }}>Exercise Library</div>
            <h2 style={{ fontSize:"17px", fontWeight:"800", color:"#222", margin:0 }}>Search &amp; Add Exercise</h2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            {!loading && (
              <span style={{ fontSize:"12px", color:"#aaa" }}>{exercises.length} exercises</span>
            )}
            <button onClick={onClose}
              style={{ width:"32px", height:"32px", borderRadius:"7px", border:"1.5px solid #e0e0e0", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#2f9be0"; e.currentTarget.style.color="#2f9be0"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#e0e0e0"; e.currentTarget.style.color="#aaa"; }}
            ><X size={16}/></button>
          </div>
        </div>

        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

          {/* ── LEFT: Library ── */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", borderRight:"1px solid #f0f0f0", overflow:"hidden", minWidth:0 }}>

            {/* Search + filters */}
            <div style={{ padding:"12px 14px", borderBottom:"1px solid #f0f0f0", display:"flex", flexDirection:"column", gap:"8px", flexShrink:0 }}>
              <div style={{ position:"relative" }}>
                <Search size={13} style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:"#aaa" }}/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, category…"
                  style={{ ...inputStyle, paddingLeft:"30px", fontSize:"13px" }} onFocus={fo} onBlur={fb}/>
                {search && (
                  <button onClick={() => setSearch("")}
                    style={{ position:"absolute", right:"9px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#aaa", display:"flex" }}>
                    <X size={12}/>
                  </button>
                )}
              </div>

              {/* Category pills — built from real data */}
              {categories.length > 1 && (
                <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                  {categories.map(c => (
                    <button key={c} onClick={() => setCatFilter(c)}
                      style={{
                        padding:"3px 9px", borderRadius:"20px", fontSize:"11px", fontWeight:"700",
                        cursor:"pointer", transition:"all 0.1s",
                        border:`1.5px solid ${catFilter===c ? (catColor(c)||"#2f9be0") : "#e0e0e0"}`,
                        backgroundColor: catFilter===c ? ((catColor(c)||"#2f9be0")+"18") : "#f9f9f9",
                        color: catFilter===c ? (catColor(c)||"#2f9be0") : "#666",
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* Joint pills */}
              {joints.length > 1 && (
                <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                  {joints.map(j => (
                    <button key={j} onClick={() => setJntFilter(j)}
                      style={{
                        padding:"3px 9px", borderRadius:"20px", fontSize:"11px", fontWeight:"600", cursor:"pointer",
                        border:`1.5px solid ${jntFilter===j ? "#2f9be0" : "#e0e0e0"}`,
                        backgroundColor: jntFilter===j ? "#e8f3fb" : "#f9f9f9",
                        color: jntFilter===j ? "#2f9be0" : "#888",
                      }}>
                      {j}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Exercise list */}
            <div style={{ flex:1, overflowY:"auto" }}>

              {/* Loading */}
              {loading && (
                <div style={{ padding:"40px", textAlign:"center" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"50%", border:"3px solid #cfe6f7", borderTopColor:"#2f9be0", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }}/>
                  <p style={{ fontSize:"13px", color:"#aaa", margin:0 }}>Loading exercises…</p>
                </div>
              )}

              {/* Error */}
              {!loading && fetchErr && (
                <div style={{ padding:"32px", textAlign:"center" }}>
                  <AlertCircle size={28} style={{ color:"#ffc5c5", margin:"0 auto 10px", display:"block" }}/>
                  <p style={{ fontSize:"13px", color:"#cc3333", margin:"0 0 12px", fontWeight:"600" }}>{fetchErr}</p>
                  <button onClick={() => { setFetchErr(""); setLoading(true); exitingExercises().then(r => { setExercises(r.data.workouts||[]); setLoading(false); }).catch(() => { setFetchErr("Failed again."); setLoading(false); }); }}
                    style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"7px 14px", backgroundColor:"#e8f3fb", color:"#2f9be0", border:"1.5px solid #cfe6f7", borderRadius:"7px", fontSize:"12px", fontWeight:"700", cursor:"pointer" }}>
                    <RefreshCw size={12}/> Retry
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !fetchErr && filtered.length === 0 && (
                <div style={{ padding:"40px", textAlign:"center" }}>
                  <Search size={28} style={{ color:"#ddd", margin:"0 auto 10px", display:"block" }}/>
                  <p style={{ fontSize:"13px", color:"#aaa", margin:0 }}>
                    {exercises.length === 0 ? "No exercises in library" : "No exercises match your search"}
                  </p>
                </div>
              )}

              {/* Exercise rows */}
              {!loading && !fetchErr && filtered.map((ex, i) => {
                const isSel = selected?._id === ex._id || selected?.name === ex.name;
                const cc = catColor(ex.category);
                return (
                  <div key={ex._id || i} onClick={() => selectEx(ex)}
                    style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", borderBottom:i<filtered.length-1?"1px solid #f5f5f5":"none", cursor:"pointer", backgroundColor:isSel?"#e8f3fb":"transparent", transition:"background 0.1s" }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.backgroundColor="#fdf8f4"; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.backgroundColor="transparent"; }}
                  >
                    {/* Thumbnail or icon */}
                    <div style={{ width:"38px", height:"38px", borderRadius:"8px", overflow:"hidden", flexShrink:0, backgroundColor:cc+"18", border:`1.5px solid ${cc}40`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {ex.gifUrl ? (
                        <img src={ex.gifUrl} alt={ex.name}
                          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                          onError={e => (e.target.style.display="none")}/>
                      ) : (
                        <Dumbbell size={16} style={{ color:cc }}/>
                      )}
                    </div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"13px", fontWeight:"700", color:isSel?"#2f9be0":"#222", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ex.name}</div>
                      <div style={{ fontSize:"11px", color:"#888", marginTop:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {[ex.jointArea, ex.position, ex.difficulty].filter(Boolean).join(" · ")}
                      </div>
                    </div>

                    {ex.category && (
                      <span style={{ fontSize:"10px", fontWeight:"700", padding:"2px 7px", borderRadius:"20px", backgroundColor:cc+"18", color:cc, border:`1px solid ${cc}40`, flexShrink:0, whiteSpace:"nowrap" }}>
                        {ex.category}
                      </span>
                    )}
                    {isSel && <Check size={13} style={{ color:"#2f9be0", flexShrink:0 }}/>}
                  </div>
                );
              })}
            </div>

            {/* Footer count */}
            {!loading && !fetchErr && (
              <div style={{ padding:"9px 14px", borderTop:"1px solid #f0f0f0", backgroundColor:"#fafafa", fontSize:"12px", color:"#aaa" }}>
                {filtered.length} of {exercises.length} exercise{exercises.length!==1?"s":""}
              </div>
            )}
          </div>

          {/* ── RIGHT: Configure selected ── */}
          <div style={{ width:"290px", flexShrink:0, display:"flex", flexDirection:"column", backgroundColor:"#fafafa" }}>
            {!selected ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", textAlign:"center" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"50%", backgroundColor:"#e8f3fb", border:"1.5px solid #cfe6f7", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"12px" }}>
                  <Dumbbell size={22} style={{ color:"#2f9be0" }}/>
                </div>
                <p style={{ fontSize:"13px", fontWeight:"700", color:"#555", margin:"0 0 4px" }}>Select an exercise</p>
                <p style={{ fontSize:"12px", color:"#aaa", margin:0 }}>Click any exercise on the left to configure and add to the session</p>
              </div>
            ) : (
              <>
                {/* Selected header */}
                <div style={{ padding:"14px 16px", borderBottom:"1px solid #e8e8e8", flexShrink:0 }}>
                  {/* GIF preview */}
                  {selected.gifUrl && !imgErr && (
                    <div style={{ borderRadius:"8px", overflow:"hidden", marginBottom:"10px", backgroundColor:"#f0f0f0", aspectRatio:"16/9" }}>
                      <img src={selected.gifUrl} alt={selected.name}
                        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                        onError={() => setImgErr(true)}/>
                    </div>
                  )}
                  <div style={{ fontSize:"11px", color:"#2f9be0", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:"3px" }}>Selected</div>
                  <div style={{ fontSize:"14px", fontWeight:"800", color:"#222", lineHeight:"1.3" }}>{selected.name}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", marginTop:"6px" }}>
                    {[selected.category, selected.jointArea, selected.position, selected.difficulty].filter(Boolean).map((t,i) => (
                      <span key={i} style={{ fontSize:"10px", fontWeight:"600", padding:"2px 7px", borderRadius:"20px", backgroundColor:"#e8f3fb", color:"#2f9be0", border:"1px solid #cfe6f7" }}>{t}</span>
                    ))}
                  </div>
                  {selected.description && (
                    <p style={{ fontSize:"11px", color:"#888", marginTop:"8px", lineHeight:"1.5", marginBottom:0 }}>{selected.description}</p>
                  )}
                </div>

                {/* Config fields */}
                <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:"12px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                    <SpinBtn label="Sets"     val={sets} setVal={setSets} min={1} max={20}/>
                    <SpinBtn label="Reps"     val={reps} setVal={setReps} min={0} max={100}/>
                  </div>
                  <SpinBtn label="Rest (sec)" val={rest} setVal={setRest} min={0} max={600}/>

                  <div>
                    <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>DURATION</label>
                    <input value={duration} onChange={e => setDuration(e.target.value)} placeholder={selected.duration || "e.g. 30 min"}
                      style={inputStyle} onFocus={fo} onBlur={fb}/>
                  </div>

                  <div>
                    <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>EQUIPMENT</label>
                    <input value={equipment} onChange={e => setEquipment(e.target.value)} placeholder="e.g. Resistance Band"
                      style={inputStyle} onFocus={fo} onBlur={fb}/>
                  </div>

                  <div>
                    <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>NOTES / CUES</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      placeholder="Technique cues, progressions…"
                      style={{ ...inputStyle, resize:"none", fontFamily:"inherit" }} onFocus={fo} onBlur={fb}/>
                  </div>
                </div>

                {/* Add button */}
                <div style={{ padding:"12px 16px", borderTop:"1px solid #e8e8e8", flexShrink:0 }}>
                  <OBtn onClick={handleAdd} style={{ width:"100%", justifyContent:"center" }}>
                    <Plus size={14}/> Add to Session
                  </OBtn>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKLOAD CHART
// ─────────────────────────────────────────────────────────────────────────────
function WorkloadChart({ data }) {
  const W = 640, H = 280, PL = 55, PR = 45, PT = 30, PB = 45;
  const chartW = W - PL - PR, chartH = H - PT - PB, n = data.length;
  const barW = (chartW / n) * 0.6;
  const maxLoad = Math.max(...data.map(d => d.training + d.competition), 900);
  const minFresh = Math.min(...data.map(d => d.freshness), -300);
  const totalRange = maxLoad - minFresh;
  const toY = v => PT + chartH - ((v - minFresh) / totalRange) * chartH;
  const toX = i => PL + (i + 0.5) * (chartW / n);
  const toYAcwr = v => PT + chartH * (1 - v / 4);
  const acutePath  = data.map((d,i)=>`${i===0?"M":"L"} ${toX(i)},${toY(d.acuteLoad)}`).join(" ");
  const chronicPath= data.map((d,i)=>`${i===0?"M":"L"} ${toX(i)},${toY(d.chronicLoad)}`).join(" ");
  const freshPath  = data.map((d,i)=>`${i===0?"M":"L"} ${toX(i)},${toY(d.freshness)}`).join(" ");
  const acwrLine   = data.map((d,i)=>`${i===0?"M":"L"} ${toX(i)},${toYAcwr(d.acwr)}`).join(" ");
  const zero_y = toY(0);
  return (
    <div style={{ overflowX:"auto" }}>
      <svg width={W} height={H} style={{ display:"block", minWidth:W }}>
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="#fafafa"/>
        {[0,300,600,900].map(v=>(
          <g key={v}>
            <line x1={PL} x2={PL+chartW} y1={toY(v)} y2={toY(v)} stroke="#e8e8e8" strokeWidth="1" strokeDasharray="3 3"/>
            <text x={PL-6} y={toY(v)+4} textAnchor="end" fontSize="10" fill="#aaa">{v}</text>
          </g>
        ))}
        <text x={PL-35} y={PT+chartH/2} fontSize="10" fill="#888" transform={`rotate(-90,${PL-35},${PT+chartH/2})`}>Load</text>
        {[0,1,2,3,4].map(v=><text key={`a${v}`} x={W-PR+6} y={toYAcwr(v)+4} fontSize="10" fill="#aaa">{v}</text>)}
        <line x1={PL} x2={PL+chartW} y1={zero_y} y2={zero_y} stroke="#ccc" strokeWidth="1"/>
        <path d={freshPath+` L ${toX(n-1)},${toY(0)} L ${toX(0)},${toY(0)} Z`} fill="rgba(255,200,0,0.55)"/>
        <path d={chronicPath+` L ${toX(n-1)},${toY(0)} L ${toX(0)},${toY(0)} Z`} fill="rgba(100,200,160,0.35)"/>
        <path d={acutePath+` L ${toX(n-1)},${toY(0)} L ${toX(0)},${toY(0)} Z`} fill="rgba(95,160,224,0.40)"/>
        {data.map((d,i)=>d.competition>0&&<rect key={`c${i}`} x={toX(i)-barW/2} y={toY(d.competition)} width={barW} height={zero_y-toY(d.competition)} fill="#2f9be0" rx="2" opacity="0.9"/>)}
        {data.map((d,i)=>d.training>0&&<rect key={`t${i}`} x={toX(i)-barW/2} y={toY(d.training)} width={barW} height={zero_y-toY(d.training)} fill="#7ec3ee" rx="2" opacity="0.75"/>)}
        {data.map((d,i)=>{const v=d.competition||d.training;if(v<30)return null;return<text key={`l${i}`} x={toX(i)} y={toY(v)-4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#555">{v}</text>;})}
        <path d={acwrLine} fill="none" stroke="#1a1a1a" strokeWidth="2"/>
        <rect x={PL} y={toYAcwr(1.3)} width={chartW} height={toYAcwr(0.8)-toYAcwr(1.3)} fill="rgba(100,200,100,0.08)"/>
        {data.filter((_,i)=>i%3===0||i===data.length-1).map(d=>{const i=data.indexOf(d);if(Math.abs(d.acwr-1)<0.05)return null;return<text key={`al${i}`} x={toX(i)} y={toYAcwr(d.acwr)-5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#333">{d.acwr.toFixed(2)}</text>;})}
        {data.map((d,i)=>i%2===0&&<text key={`xl${i}`} x={toX(i)} y={H-5} textAnchor="middle" fontSize="9" fill="#888" transform={`rotate(-35,${toX(i)},${H-5})`}>{d.date}</text>)}
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="none" stroke="#ddd" strokeWidth="1"/>
      </svg>
      <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginTop:"10px", paddingLeft:"8px" }}>
        {[
          {color:"#2f9be0",label:"Competition",line:false},{color:"#7ec3ee",label:"Training",line:false},
          {color:"rgba(95,160,224,0.6)",label:"Acute Load",line:false},{color:"rgba(100,200,160,0.5)",label:"Chronic Load",line:false},
          {color:"rgba(255,200,0,0.7)",label:"Freshness",line:false},{color:"#1a1a1a",label:"ACWR",line:true},
        ].map(l=>(
          <div key={l.label} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
            {l.line?<div style={{ width:"18px", height:"2px", backgroundColor:l.color }}/>:<div style={{ width:"12px", height:"12px", borderRadius:"3px", backgroundColor:l.color }}/>}
            <span style={{ fontSize:"11px", color:"#666" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DONUT CHART
// ─────────────────────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((s,d)=>s+d.value,0);
  if (!total) return <div style={{ padding:"24px", textAlign:"center", color:"#aaa", fontSize:"13px" }}>No data</div>;
  const cx=90,cy=90,r=60,inner=38;
  let angle=-90;
  const slices = data.map(d=>{
    const pct=d.value/total,sweep=pct*360;
    const a1=(angle*Math.PI)/180,a2=((angle+sweep)*Math.PI)/180;
    const laf=sweep>180?1:0;
    const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);
    const ix1=cx+inner*Math.cos(a1),iy1=cy+inner*Math.sin(a1),ix2=cx+inner*Math.cos(a2),iy2=cy+inner*Math.sin(a2);
    const midA=((angle+sweep/2)*Math.PI)/180;
    const lx=cx+(r+16)*Math.cos(midA),ly=cy+(r+16)*Math.sin(midA);
    const path=`M ${x1} ${y1} A ${r} ${r} 0 ${laf} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${laf} 0 ${ix1} ${iy1} Z`;
    angle+=sweep;
    return{...d,path,pct,lx,ly,sweep};
  });
  return (
    <div>
      <svg width="180" height="180" style={{ display:"block", margin:"0 auto" }}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2"/>)}
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#333">{total}</text>
        <text x={cx} y={cy+8} textAnchor="middle" fontSize="9" fill="#888">sessions</text>
        {slices.map((s,i)=>s.sweep>15&&<text key={`l${i}`} x={s.lx} y={s.ly} textAnchor="middle" fontSize="9" fontWeight="700" fill={s.color}>{Math.round(s.pct*100)}%</text>)}
      </svg>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", justifyContent:"center", marginTop:"8px" }}>
        {data.map((d,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"9px", height:"9px", borderRadius:"50%", backgroundColor:d.color }}/><span style={{ fontSize:"11px", color:"#666" }}>{d.label} ({d.value})</span></div>)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANNED VS REPORTED CHART
// ─────────────────────────────────────────────────────────────────────────────
function PlannedVsReported({ sessions }) {
  const W=500,H=200,PL=45,PR=20,PT=20,PB=40;
  const chartW=W-PL-PR,chartH=H-PT-PB,maxVal=1000;
  const n=Math.min(sessions.length,10),recent=sessions.slice(-n);
  const toY=v=>PT+chartH*(1-v/maxVal),toX=i=>PL+(i+0.5)*(chartW/n),barW=(chartW/n)*0.28;
  return (
    <div style={{ overflowX:"auto" }}>
      <svg width={W} height={H} style={{ display:"block", minWidth:W }}>
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="#fafafa"/>
        {[0,300,600,900].map(v=><g key={v}><line x1={PL} x2={PL+chartW} y1={toY(v)} y2={toY(v)} stroke="#e8e8e8" strokeWidth="1" strokeDasharray="3 3"/><text x={PL-4} y={toY(v)+4} textAnchor="end" fontSize="9" fill="#aaa">{v}</text></g>)}
        {recent.map((s,i)=>{
          const pl=s.plannedLoad||0,rp=s.reportedLoad||0;
          return <g key={i}>
            <rect x={toX(i)-barW-1} y={toY(pl)} width={barW} height={Math.max(toY(0)-toY(pl),2)} fill="#3b82f6" rx="2" opacity="0.7"/>
            <rect x={toX(i)+1}      y={toY(rp)} width={barW} height={Math.max(toY(0)-toY(rp),2)} fill="#2f9be0" rx="2" opacity="0.8"/>
            {pl>50&&<text x={toX(i)-barW/2-1} y={toY(pl)-3} textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="700">{pl}</text>}
            {rp>50&&<text x={toX(i)+barW/2+1} y={toY(rp)-3} textAnchor="middle" fontSize="8" fill="#2f9be0" fontWeight="700">{rp}</text>}
            <text x={toX(i)} y={H-8} textAnchor="middle" fontSize="8" fill="#888" transform={`rotate(-30,${toX(i)},${H-8})`}>{s.name?.substring(0,8)||`S${i+1}`}</text>
          </g>;
        })}
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="none" stroke="#ddd" strokeWidth="1"/>
      </svg>
      <div style={{ display:"flex", gap:"14px", marginTop:"6px", paddingLeft:"4px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"12px", height:"12px", borderRadius:"3px", backgroundColor:"#3b82f6", opacity:0.7 }}/><span style={{ fontSize:"11px", color:"#666" }}>Planned</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}><div style={{ width:"12px", height:"12px", borderRadius:"3px", backgroundColor:"#2f9be0", opacity:0.8 }}/><span style={{ fontSize:"11px", color:"#666" }}>Reported</span></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE ROW (inside session)
// ─────────────────────────────────────────────────────────────────────────────
function ExerciseRow({ ex, idx, onChange, onRemove }) {
  const s = { width:"100%", padding:"7px 10px", border:"1.5px solid #e0e0e0", borderRadius:"6px", fontSize:"12px", color:"#333", backgroundColor:"#f9f9f9", outline:"none", boxSizing:"border-box" };
  const upd = (k,v) => onChange(idx,k,v);
  return (
    <div style={{ border:"1px solid #e8e8e8", borderRadius:"9px", overflow:"hidden", marginBottom:"10px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 14px", backgroundColor:"#fafafa", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ width:"24px", height:"24px", borderRadius:"50%", backgroundColor:"#2f9be0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"800", color:"#fff", flexShrink:0 }}>{idx+1}</div>
        <input value={ex.name} onChange={e=>upd("name",e.target.value)} placeholder="Exercise name…"
          style={{ flex:1, border:"none", backgroundColor:"transparent", fontSize:"13px", fontWeight:"700", outline:"none", padding:"2px 0", color:"#222" }}
          onFocus={e=>(e.target.style.borderBottom="1.5px solid #2f9be0")} onBlur={e=>(e.target.style.borderBottom="none")}/>
        <button onClick={()=>onRemove(idx)} style={{ background:"none", border:"none", cursor:"pointer", padding:"3px", color:"#cc3333", display:"flex", borderRadius:"5px" }}
          onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#fff0f0")} onMouseLeave={e=>(e.currentTarget.style.backgroundColor="transparent")}
        ><Trash2 size={14}/></button>
      </div>
      <div style={{ padding:"10px 14px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:"8px" }}>
        {[{label:"SETS",key:"sets",ph:"e.g. 3"},{label:"REPS/TIME",key:"reps",ph:"e.g. 10"},{label:"REST",key:"rest",ph:"e.g. 60s"},{label:"DURATION",key:"duration",ph:"e.g. 30m"},{label:"EQUIPMENT",key:"equipment",ph:"e.g. Barbell"}].map(f=>(
          <div key={f.key}>
            <label style={{ fontSize:"9px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase", letterSpacing:"0.4px" }}>{f.label}</label>
            <input value={ex[f.key]||""} onChange={e=>upd(f.key,e.target.value)} placeholder={f.ph} style={s}
              onFocus={fo} onBlur={fb}/>
          </div>
        ))}
      </div>
      <div style={{ padding:"0 14px 12px", display:"grid", gridTemplateColumns:"1fr auto", gap:"10px", alignItems:"start" }}>
        <div>
          <label style={{ fontSize:"9px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase", letterSpacing:"0.4px" }}>DESCRIPTION / NOTES</label>
          <textarea value={ex.description||""} onChange={e=>upd("description",e.target.value)} placeholder="Technique cues, progressions…" rows={2}
            style={{ ...s, resize:"none", fontFamily:"inherit" }} onFocus={fo} onBlur={fb}/>
        </div>
        <div style={{ minWidth:"88px" }}>
          <label style={{ fontSize:"9px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase", letterSpacing:"0.4px" }}>LOAD (AU)</label>
          <input type="number" value={ex.load||""} onChange={e=>upd("load",e.target.value)} placeholder="e.g. 120" style={s} onFocus={fo} onBlur={fb}/>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION CARD
// ─────────────────────────────────────────────────────────────────────────────
const ChevronDownIcon = ({size,style}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="6 9 12 15 18 9"/></svg>;

function SessionCard({ session, idx, onChange, onRemove, collapsed, onToggle }) {
  const [showExSearch, setShowExSearch] = useState(false);
  const upd = (k,v) => onChange(idx,k,v);
  const totalLoad = (session.exercises||[]).reduce((s,e)=>s+(Number(e.load)||0),0);

  const addExercise = () => {
    upd("exercises",[...(session.exercises||[]),{name:"",sets:"",reps:"",rest:"",duration:"",equipment:"",description:"",load:""}]);
  };

  const addExerciseFromLibrary = (ex) => {
    upd("exercises",[...(session.exercises||[]),ex]);
    setShowExSearch(false);
  };

  const updateExercise = (ei,k,v) => {
    const exs=[...(session.exercises||[])];exs[ei]={...exs[ei],[k]:v};upd("exercises",exs);
  };
  const removeExercise = (ei) => upd("exercises",(session.exercises||[]).filter((_,i)=>i!==ei));

  return (
    <>
      <div style={{ border:`1.5px solid ${collapsed?"#e8e8e8":"#2f9be0"}`, borderRadius:"12px", overflow:"hidden", marginBottom:"14px", transition:"all 0.15s" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", backgroundColor:collapsed?"#fafafa":"#e8f3fb", cursor:"pointer", flexWrap:"wrap" }}
          onClick={onToggle}>
          <div style={{ width:"28px", height:"28px", borderRadius:"8px", backgroundColor:"#2f9be0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"800", color:"#fff", flexShrink:0 }}>{idx+1}</div>

          {/* Name */}
          <input value={session.name||""} onChange={e=>{e.stopPropagation();upd("name",e.target.value);}} onClick={e=>e.stopPropagation()}
            placeholder="Session name…"
            style={{ flex:"1 1 140px", minWidth:"100px", padding:"5px 8px", border:"1px solid #e0e0e0", borderRadius:"6px", fontSize:"13px", fontWeight:"700", color:"#222", backgroundColor:"#fff", outline:"none", boxSizing:"border-box" }}
            onFocus={fo} onBlur={fb}/>

          {/* Type */}
          <select value={session.type||""} onChange={e=>{e.stopPropagation();upd("type",e.target.value);}} onClick={e=>e.stopPropagation()}
            style={{ flex:"0 1 130px", padding:"5px 8px", border:"1px solid #e0e0e0", borderRadius:"6px", fontSize:"12px", color:"#555", backgroundColor:"#fff", outline:"none", cursor:"pointer" }}
            onFocus={fo} onBlur={fb}>
            <option value="">Type…</option>
            {SESSION_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>

          {/* Date */}
          <input type="date" value={session.date||""} onChange={e=>{e.stopPropagation();upd("date",e.target.value);}} onClick={e=>e.stopPropagation()}
            style={{ flex:"0 1 130px", padding:"5px 8px", border:"1px solid #e0e0e0", borderRadius:"6px", fontSize:"12px", color:"#555", backgroundColor:"#fff", outline:"none", boxSizing:"border-box" }}
            onFocus={fo} onBlur={fb}/>

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:"11px", color:"#2f9be0", fontWeight:"700" }}>{session.exercises?.length||0} ex</div>
              {totalLoad>0&&<div style={{ fontSize:"10px", color:"#888" }}>{totalLoad} AU</div>}
            </div>
            <button onClick={e=>{e.stopPropagation();onRemove(idx);}} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", color:"#cc3333", display:"flex", borderRadius:"6px" }}
              onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#fff0f0")} onMouseLeave={e=>(e.currentTarget.style.backgroundColor="transparent")}
            ><Trash2 size={15}/></button>
            {collapsed?<ChevronRight size={15} style={{ color:"#aaa" }}/>:<ChevronDownIcon size={15} style={{ color:"#2f9be0" }}/>}
          </div>
        </div>

        {/* Body */}
        {!collapsed && (
          <div style={{ padding:"16px 18px", backgroundColor:"#fff", borderTop:"1px solid #f0f0f0" }}>
            {/* Description */}
            <div style={{ marginBottom:"14px" }}>
              <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.4px" }}>SESSION DESCRIPTION / OBJECTIVES</label>
              <textarea value={session.description||""} onChange={e=>upd("description",e.target.value)} placeholder="Session objectives, warm-up notes…" rows={2}
                style={{ ...inputStyle, resize:"none", fontFamily:"inherit" }} onFocus={fo} onBlur={fb}/>
            </div>

            {/* Load + Duration */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"10px", marginBottom:"14px" }}>
              {[{label:"PLANNED LOAD (AU)",key:"plannedLoad"},{label:"REPORTED LOAD (AU)",key:"reportedLoad"},{label:"DURATION (min)",key:"durationMins"}].map(f=>(
                <div key={f.key}>
                  <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase", letterSpacing:"0.4px" }}>{f.label}</label>
                  <input type="number" value={session[f.key]||""} onChange={e=>upd(f.key,e.target.value)} placeholder="—"
                    style={{ width:"100%", padding:"7px 10px", border:"1.5px solid #e0e0e0", borderRadius:"6px", fontSize:"13px", fontWeight:"700", color:"#222", backgroundColor:"#f9f9f9", outline:"none", boxSizing:"border-box" }}
                    onFocus={fo} onBlur={fb}/>
                </div>
              ))}
            </div>

            {/* Exercises */}
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px", flexWrap:"wrap", gap:"8px" }}>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#333", display:"flex", alignItems:"center", gap:"6px" }}>
                  <Dumbbell size={13} style={{ color:"#2f9be0" }}/> Exercises ({session.exercises?.length||0})
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={()=>setShowExSearch(true)}
                    style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 12px", backgroundColor:"#e8f3fb", color:"#2f9be0", border:"1.5px solid #cfe6f7", borderRadius:"7px", fontSize:"12px", fontWeight:"700", cursor:"pointer" }}
                    onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#cfe6f7")}
                    onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#e8f3fb")}
                  ><Search size={12}/> Search Library</button>
                  <OBtn onClick={addExercise} style={{ padding:"6px 12px", fontSize:"11px" }}>
                    <Plus size={12}/> Add Manual
                  </OBtn>
                </div>
              </div>

              {(session.exercises||[]).length===0 ? (
                <div style={{ padding:"22px", backgroundColor:"#f9f9f9", borderRadius:"8px", border:"1.5px dashed #e0e0e0", textAlign:"center" }}>
                  <Dumbbell size={20} style={{ color:"#ddd", margin:"0 auto 6px", display:"block" }}/>
                  <p style={{ fontSize:"12px", color:"#aaa", margin:"0 0 10px" }}>No exercises yet</p>
                  <button onClick={()=>setShowExSearch(true)}
                    style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"7px 14px", backgroundColor:"#e8f3fb", color:"#2f9be0", border:"1.5px solid #cfe6f7", borderRadius:"7px", fontSize:"12px", fontWeight:"700", cursor:"pointer" }}>
                    <Search size={12}/> Search Exercise Library
                  </button>
                </div>
              ) : (
                (session.exercises||[]).map((ex,ei)=>(
                  <ExerciseRow key={ei} ex={ex} idx={ei} onChange={updateExercise} onRemove={removeExercise}/>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showExSearch && (
        <ExerciseSearchModal onAdd={addExerciseFromLibrary} onClose={()=>setShowExSearch(false)}/>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKLOAD DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function WorkloadDashboard({ player, sessions }) {
  const ww = useWindowWidth();
  const isMobile = ww < 640;
  const prev7 = WORKLOAD_DAYS.slice(-14,-7), next7 = WORKLOAD_DAYS.slice(-7);
  const sum = (arr,key) => arr.reduce((s,d)=>s+(d[key]||0),0);
  const stats = [
    {label:"Duration",    prev:"7:00",next:"0:00",  change:"-100%",down:true},
    {label:"Load",        prev:"1.43 (835)",next:"—",change:"-100%",down:true,highlight:true},
    {label:"Acute Load",  prev:sum(prev7,"acuteLoad"),  next:sum(next7,"acuteLoad"),   change:"-100%",down:true},
    {label:"Chronic Load",prev:sum(prev7,"chronicLoad"),next:sum(next7,"chronicLoad"), change:"-37%", down:true},
    {label:"Freshness",   prev:-250,next:368,change:"-247%",down:false},
    {label:"ACWR",        prev:"1.43",next:"0",change:"-100%",down:true},
  ];
  const donutData = [
    {label:"Competition",value:WORKLOAD_DAYS.filter(d=>d.competition>0).length,color:"#64c8f0"},
    {label:"Training",   value:WORKLOAD_DAYS.filter(d=>d.training>0).length,   color:"#2f9be0"},
  ];
  return (
    <div style={{ padding:"clamp(14px,4vw,28px)" }}>
      <Heading title="Workload" sub={`Training load monitoring for ${player.name}`}/>
      <div style={card({ padding:"20px 22px", marginBottom:"20px", overflowX:"hidden" })}>
        <WorkloadChart data={WORKLOAD_DAYS}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"18px", marginBottom:"20px" }}>
        <div style={card({ padding:"20px 22px" })}>
          <div style={{ fontSize:"14px", fontWeight:"700", color:"#333", marginBottom:"14px", display:"flex", alignItems:"center", gap:"7px" }}>
            <BarChart2 size={14} style={{ color:"#2f9be0" }}/> Planned vs Reported
          </div>
          {sessions.length>0?<PlannedVsReported sessions={sessions}/>:<div style={{ padding:"32px", textAlign:"center", color:"#aaa", fontSize:"13px" }}>Add sessions to see chart</div>}
        </div>
        <div style={card({ padding:"20px 22px" })}>
          <div style={{ fontSize:"13px", color:"#888", textAlign:"center", marginBottom:"4px" }}>Distribution of activities/sessions</div>
          <div style={{ fontSize:"12px", color:"#aaa", textAlign:"center", marginBottom:"14px" }}>Prev 7d</div>
          <DonutChart data={donutData}/>
        </div>
      </div>
      <div style={card({ overflow:"hidden" })}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"400px" }}>
            <thead>
              <tr style={{ backgroundColor:"#f9f9f9" }}>
                {["Metric","Prev 7d","Next 7d","% change"].map(h=>(
                  <th key={h} style={{ padding:"11px 14px", fontSize:"12px", fontWeight:"700", color:"#555", textAlign:h==="Metric"?"left":"center", borderBottom:"1px solid #e8e8e8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((s,i)=>(
                <tr key={s.label} style={{ backgroundColor:s.highlight?"#fff8e1":i%2===0?"#fff":"#fafafa" }}>
                  <td style={{ padding:"10px 14px", fontSize:"13px", color:"#333", borderBottom:"1px solid #f5f5f5", fontWeight:s.highlight?"700":"500" }}>{s.label}</td>
                  <td style={{ padding:"10px 14px", fontSize:"13px", color:"#333", borderBottom:"1px solid #f5f5f5", textAlign:"center", fontWeight:s.highlight?"700":"400" }}>{s.prev}</td>
                  <td style={{ padding:"10px 14px", fontSize:"13px", color:"#333", borderBottom:"1px solid #f5f5f5", textAlign:"center" }}>{s.next}</td>
                  <td style={{ padding:"10px 14px", fontSize:"12px", borderBottom:"1px solid #f5f5f5", textAlign:"center" }}>
                    <span style={{ fontWeight:"700", color:s.down?"#cc3333":"#2e7d32" }}>{s.change} {s.down?"↓":"↑"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSIONS VIEW
// ─────────────────────────────────────────────────────────────────────────────
function SessionsView({ player, sessions, setSessions }) {
  const [collapsed, setCollapsed] = useState({});

  const addSession = () => {
    const ns = {id:`s_${Date.now()}`,name:"",type:"",date:"",description:"",plannedLoad:"",reportedLoad:"",durationMins:"",exercises:[]};
    setSessions(prev=>[...prev,ns]);
    setCollapsed(prev=>({...prev,[sessions.length]:false}));
  };
  const updateSession = (idx,k,v) => setSessions(prev=>{const a=[...prev];a[idx]={...a[idx],[k]:v};return a;});
  const removeSession = idx => setSessions(prev=>prev.filter((_,i)=>i!==idx));
  const toggleCollapse = idx => setCollapsed(prev=>({...prev,[idx]:!prev[idx]}));

  const totalLoad = sessions.reduce((s,se)=>s+(Number(se.plannedLoad)||0),0);

  return (
    <div style={{ padding:"clamp(14px,4vw,28px)" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"22px", gap:"12px", flexWrap:"wrap" }}>
        <Heading title="Sessions" sub={`Training sessions for ${player.name}`}/>
        <OBtn onClick={addSession}><Plus size={14}/> Add Session</OBtn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"14px", marginBottom:"22px" }}>
        {[
          {label:"Total Sessions",  value:sessions.length,                              color:"#2f9be0",icon:Calendar},
          {label:"Completed",       value:sessions.filter(s=>s.reportedLoad>0).length,  color:"#2e7d32",icon:CheckCircle2},
          {label:"Planned Load",    value:totalLoad>0?totalLoad+" AU":"—",              color:"#3b82f6",icon:Zap},
        ].map(s=>(
          <div key={s.label} style={card({ padding:"14px 18px", borderLeft:`4px solid ${s.color}` })}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4px" }}>
              <span style={{ fontSize:"20px", fontWeight:"800", color:s.color }}>{s.value}</span>
              <div style={{ width:"32px", height:"32px", borderRadius:"8px", backgroundColor:s.color+"18", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <s.icon size={15} style={{ color:s.color }}/>
              </div>
            </div>
            <span style={{ fontSize:"12px", color:"#888", fontWeight:"500" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {sessions.length===0 ? (
        <div style={card({ padding:"56px", textAlign:"center" })}>
          <Calendar size={40} style={{ color:"#ddd", margin:"0 auto 14px", display:"block" }}/>
          <p style={{ fontSize:"16px", fontWeight:"700", color:"#555", margin:0 }}>No sessions yet</p>
          <p style={{ fontSize:"13px", color:"#aaa", marginTop:"6px" }}>Create your first training session for {player.name}</p>
          <OBtn onClick={addSession} style={{ marginTop:"18px" }}><Plus size={14}/> Add First Session</OBtn>
        </div>
      ) : (
        sessions.map((session,idx)=>(
          <SessionCard key={session.id||idx} session={session} idx={idx} onChange={updateSession} onRemove={removeSession} collapsed={collapsed[idx]!==false&&idx!==sessions.length-1} onToggle={()=>toggleCollapse(idx)}/>
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FITNESS OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
function FitnessOverview({ player }) {
  const [activeWeek,setActiveWeek] = useState(1);
  const [gridData,  setGridData]   = useState(buildGrid);
  const [editCell,  setEditCell]   = useState(null);
  const [editVal,   setEditVal]    = useState("");

  const saveCell = () => {
    if (!editCell) return;
    setGridData(prev=>{const n={...prev};n[activeWeek]={...n[activeWeek]};n[activeWeek][editCell.day]={...n[activeWeek][editCell.day],[editCell.row]:editVal};return n;});
    setEditCell(null);setEditVal("");
  };

  return (
    <div style={{ padding:"clamp(14px,4vw,28px)" }}>
      <div style={{ background:"linear-gradient(135deg,#1a2340,#2d3a5c)", borderRadius:"12px", padding:"22px 24px", marginBottom:"20px" }}>
        <div style={{ fontSize:"20px", fontWeight:"800", color:"#fff", marginBottom:"12px" }}>Fitness Overview</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={()=>setActiveWeek(w=>Math.max(1,w-1))} style={{ background:"none", border:"none", cursor:"pointer", color:"#fff", opacity:activeWeek===1?0.3:1 }}><ChevronLeft size={22}/></button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:"16px", fontWeight:"700", color:"#fff" }}>Week {activeWeek}</div>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginTop:"2px" }}>{WEEK_DATES[activeWeek]?.[0]} – {WEEK_DATES[activeWeek]?.[6]}</div>
          </div>
          <button onClick={()=>setActiveWeek(w=>Math.min(7,w+1))} style={{ background:"none", border:"none", cursor:"pointer", color:"#fff", opacity:activeWeek===7?0.3:1 }}><ChevronRight size={22}/></button>
        </div>
      </div>
      <div style={card({ overflow:"auto" })}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"700px" }}>
          <thead>
            <tr style={{ backgroundColor:"#f9f9f9" }}>
              <th style={{ padding:"12px 14px", fontSize:"12px", fontWeight:"700", color:"#888", textAlign:"left", borderBottom:"1px solid #e8e8e8", width:"120px" }}/>
              {DAYS_LABELS.map((day,di)=>(
                <th key={day} style={{ padding:"10px 12px", fontSize:"11px", fontWeight:"700", color:"#555", textAlign:"center", borderBottom:"1px solid #e8e8e8", borderLeft:"1px solid #f0f0f0", minWidth:"90px" }}>
                  <div>{WEEK_DATES[activeWeek]?.[di]||""}</div>
                  <div style={{ color:"#aaa", fontWeight:"500", marginTop:"1px" }}>{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map((row,ri)=>(
              <tr key={row} style={{ backgroundColor:ri%2===0?"#fff":"#fafafa" }}>
                <td style={{ padding:"12px 14px", fontSize:"12px", fontWeight:"600", color:"#555", borderBottom:"1px solid #f5f5f5", borderRight:"1px solid #f0f0f0", verticalAlign:"top" }}>{row}</td>
                {DAYS_LABELS.map((_,di)=>{
                  const cellVal=gridData[activeWeek]?.[di]?.[row]||"";
                  const isEditing=editCell?.day===di&&editCell?.row===row;
                  return (
                    <td key={di} style={{ padding:"10px 12px", fontSize:"12px", color:"#333", borderBottom:"1px solid #f5f5f5", borderLeft:"1px solid #f0f0f0", verticalAlign:"top", cursor:"pointer", backgroundColor:isEditing?"#f0f8fd":"transparent" }}
                      onClick={()=>{if(!isEditing){setEditCell({day:di,row});setEditVal(cellVal);}}}>
                      {isEditing?(
                        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                          <textarea autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onClick={e=>e.stopPropagation()} rows={3}
                            style={{ width:"100%", padding:"6px 8px", border:"1.5px solid #2f9be0", borderRadius:"6px", fontSize:"12px", outline:"none", resize:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                          <div style={{ display:"flex", gap:"4px" }}>
                            <button onClick={e=>{e.stopPropagation();saveCell();}} style={{ flex:1, padding:"4px", backgroundColor:"#2f9be0", color:"#fff", border:"none", borderRadius:"4px", cursor:"pointer", fontSize:"11px", fontWeight:"700" }}>Save</button>
                            <button onClick={e=>{e.stopPropagation();setEditCell(null);setEditVal("");}} style={{ flex:1, padding:"4px", backgroundColor:"#f0f0f0", color:"#555", border:"none", borderRadius:"4px", cursor:"pointer", fontSize:"11px" }}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"4px", minHeight:"24px" }}>
                          <span style={{ lineHeight:"1.4", color:cellVal?"#333":"#ccc" }}>{cellVal||"–"}</span>
                          {cellVal&&<Edit2 size={11} style={{ color:"#ccc", flexShrink:0, marginTop:"2px" }}/>}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:"10px", fontSize:"12px", color:"#aaa", textAlign:"right" }}>Click any cell to edit</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NFTC TAB
// ─────────────────────────────────────────────────────────────────────────────
const NFTC_COLUMNS = [
  { key:"10m",       label:"10M",             sub:"(Secs)" },
  { key:"20m",       label:"20M",             sub:"(Secs)" },
  { key:"40m",       label:"40M",             sub:"(Secs)" },
  { key:"slj",       label:"Standing Long Jump (SLJ)", sub:"(m)" },
  { key:"runthree",  label:"Run a Three",     sub:"" },
  { key:"yoyo",      label:"YO-YO",           sub:"(Level)" },
  { key:"dexa",      label:"DEXA",            sub:"(Fat %)" },
];

const NFTC_NATIONAL_STANDARD = {
  "10m":"1.5","20m":"3.18","40m":"5.84","slj":"2.13","runthree":"10.22","yoyo":"16.5","dexa":"—",
};

function NFTCView({ player, nftcData, setNftcData }) {
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({date:"",testBy:"",notes:"",...Object.fromEntries(NFTC_COLUMNS.map(c=>[c.key,""]))});

  const saveEdit = () => {
    setNftcData(prev=>prev.map((r,i)=>i===editRow?{...r,...editForm}:r));
    setEditRow(null);setEditForm({});
  };
  const deleteRow = idx => setNftcData(prev=>prev.filter((_,i)=>i!==idx));
  const addRow = () => {
    setNftcData(prev=>[...prev,{...newForm,id:Date.now()}]);
    setNewForm({date:"",testBy:"",notes:"",...Object.fromEntries(NFTC_COLUMNS.map(c=>[c.key,""]))});
    setShowAdd(false);
  };

  const cellStyle = (isHighlight,isEdit) => ({
    padding:"10px 12px", fontSize:"13px", color:"#333",
    borderBottom:"1px solid #f5f5f5", borderRight:"1px solid #f0f0f0",
    textAlign:"center", backgroundColor:isEdit?"#f0f8fd":isHighlight?"#fff8e1":"transparent",
    whiteSpace:"nowrap",
  });

  const compareToStandard = (key,val) => {
    const std = NFTC_NATIONAL_STANDARD[key];
    if (!val||val==="—"||!std||std==="—") return null;
    const v=parseFloat(val),s=parseFloat(std);
    if (isNaN(v)||isNaN(s)) return null;
    const timeKeys=["10m","20m","40m","runthree"];
    if (timeKeys.includes(key)) return v<=s?"better":"worse";
    return v>=s?"better":"worse";
  };

  return (
    <div style={{ padding:"clamp(14px,4vw,28px)" }}>
      {/* Title */}
      <div style={{ textAlign:"center", marginBottom:"24px" }}>
        <h2 style={{ fontSize:"18px", fontWeight:"800", color:"#1565c0", textDecoration:"underline", margin:"0 0 6px", textTransform:"uppercase" }}>
          National Fitness Testing Criteria (NFTC)
        </h2>
        <p style={{ fontSize:"13px", color:"#888", margin:0 }}>
          Fitness benchmarks and testing results for {player.name}
        </p>
        <div style={{ width:"32px", height:"3px", backgroundColor:"#2f9be0", borderRadius:"2px", margin:"8px auto 0" }}/>
      </div>

      {/* National Standard Card */}
      <div style={card({ overflow:"hidden", marginBottom:"22px" })}>
        <div style={{ padding:"14px 18px", backgroundColor:"#1565c0", display:"flex", alignItems:"center", gap:"8px" }}>
          <Star size={15} style={{ color:"#fff" }}/>
          <span style={{ fontSize:"13px", fontWeight:"700", color:"#fff" }}>National Standard Benchmarks</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"600px" }}>
            <thead>
              <tr style={{ backgroundColor:"#e3f2fd" }}>
                {NFTC_COLUMNS.map(c=>(
                  <th key={c.key} style={{ padding:"10px 14px", fontSize:"12px", fontWeight:"700", color:"#1565c0", textAlign:"center", borderBottom:"2px solid #90caf9", borderRight:"1px solid #90caf9", whiteSpace:"nowrap" }}>
                    <div>{c.label}</div>
                    {c.sub&&<div style={{ fontSize:"10px", fontWeight:"500", color:"#5c8fc7", marginTop:"2px" }}>{c.sub}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor:"#fff" }}>
                {NFTC_COLUMNS.map(c=>(
                  <td key={c.key} style={{ padding:"12px 14px", fontSize:"15px", fontWeight:"800", color:"#1565c0", textAlign:"center", borderBottom:"1px solid #e3f2fd", borderRight:"1px solid #e3f2fd" }}>
                    {NFTC_NATIONAL_STANDARD[c.key]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Results */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px", flexWrap:"wrap", gap:"10px" }}>
        <div style={{ fontSize:"14px", fontWeight:"700", color:"#333", display:"flex", alignItems:"center", gap:"7px" }}>
          <Activity size={15} style={{ color:"#2f9be0" }}/> {player.name}'s Test Results
        </div>
        <OBtn onClick={()=>setShowAdd(v=>!v)} style={{ padding:"7px 14px", fontSize:"12px" }}>
          <Plus size={13}/> Add Test Entry
        </OBtn>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={card({ padding:"18px 20px", marginBottom:"16px", borderLeft:"4px solid #2f9be0" })}>
          <div style={{ fontSize:"13px", fontWeight:"700", color:"#333", marginBottom:"14px" }}>New Test Entry</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"10px", marginBottom:"12px" }}>
            <div>
              <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>DATE</label>
              <input type="date" value={newForm.date} onChange={e=>setNewForm(f=>({...f,date:e.target.value}))} style={inputStyle} onFocus={fo} onBlur={fb}/>
            </div>
            <div>
              <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>TESTED BY</label>
              <input value={newForm.testBy} onChange={e=>setNewForm(f=>({...f,testBy:e.target.value}))} placeholder="Assessor" style={inputStyle} onFocus={fo} onBlur={fb}/>
            </div>
            {NFTC_COLUMNS.map(c=>(
              <div key={c.key}>
                <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>{c.label}{c.sub?` ${c.sub}`:""}</label>
                <input value={newForm[c.key]} onChange={e=>setNewForm(f=>({...f,[c.key]:e.target.value}))} placeholder="—" style={inputStyle} onFocus={fo} onBlur={fb}/>
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", display:"block", marginBottom:"3px", textTransform:"uppercase" }}>NOTES</label>
            <input value={newForm.notes} onChange={e=>setNewForm(f=>({...f,notes:e.target.value}))} placeholder="Test conditions, observations…" style={inputStyle} onFocus={fo} onBlur={fb}/>
          </div>
          <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
            <OBtn onClick={addRow} style={{ fontSize:"12px", padding:"8px 16px" }}><Save size={13}/> Save Entry</OBtn>
            <button onClick={()=>setShowAdd(false)}
              style={{ padding:"8px 14px", backgroundColor:"#fff", color:"#555", border:"1.5px solid #e0e0e0", borderRadius:"7px", fontSize:"12px", fontWeight:"600", cursor:"pointer" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#2f9be0";e.currentTarget.style.color="#2f9be0";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#e0e0e0";e.currentTarget.style.color="#555";}}
            >Cancel</button>
          </div>
        </div>
      )}

      {/* Results table */}
      {nftcData.length===0 ? (
        <div style={card({ padding:"48px", textAlign:"center" })}>
          <Target size={36} style={{ color:"#ddd", margin:"0 auto 12px", display:"block" }}/>
          <p style={{ fontSize:"14px", fontWeight:"700", color:"#555", margin:"0 0 6px" }}>No test entries yet</p>
          <p style={{ fontSize:"13px", color:"#aaa", margin:0 }}>Click "Add Test Entry" to record NFTC results</p>
        </div>
      ) : (
        <div style={card({ overflow:"hidden" })}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"700px" }}>
              <thead>
                <tr style={{ backgroundColor:"#fafafa" }}>
                  <th style={{ padding:"10px 14px", fontSize:"11px", fontWeight:"700", color:"#888", textAlign:"left", borderBottom:"1px solid #e8e8e8", borderRight:"1px solid #f0f0f0", whiteSpace:"nowrap" }}>DATE</th>
                  {NFTC_COLUMNS.map(c=>(
                    <th key={c.key} style={{ padding:"10px 10px", fontSize:"11px", fontWeight:"700", color:"#555", textAlign:"center", borderBottom:"1px solid #e8e8e8", borderRight:"1px solid #f0f0f0", whiteSpace:"nowrap" }}>
                      <div>{c.label}</div>
                      {c.sub&&<div style={{ fontSize:"9px", color:"#aaa", fontWeight:"500" }}>{c.sub}</div>}
                    </th>
                  ))}
                  <th style={{ padding:"10px 14px", fontSize:"11px", fontWeight:"700", color:"#888", textAlign:"left", borderBottom:"1px solid #e8e8e8", borderRight:"1px solid #f0f0f0", whiteSpace:"nowrap" }}>TESTED BY</th>
                  <th style={{ padding:"10px 14px", fontSize:"11px", fontWeight:"700", color:"#888", textAlign:"center", borderBottom:"1px solid #e8e8e8" }}>ACTIONS</th>
                </tr>
                {/* Standard row */}
                <tr style={{ backgroundColor:"#e3f2fd" }}>
                  <td style={{ padding:"8px 14px", fontSize:"11px", fontWeight:"700", color:"#1565c0", borderBottom:"2px solid #90caf9", borderRight:"1px solid #90caf9" }}>National Std</td>
                  {NFTC_COLUMNS.map(c=>(
                    <td key={c.key} style={{ padding:"8px 10px", fontSize:"12px", fontWeight:"800", color:"#1565c0", textAlign:"center", borderBottom:"2px solid #90caf9", borderRight:"1px solid #90caf9" }}>
                      {NFTC_NATIONAL_STANDARD[c.key]}
                    </td>
                  ))}
                  <td colSpan={2} style={{ borderBottom:"2px solid #90caf9" }}/>
                </tr>
              </thead>
              <tbody>
                {nftcData.map((row,i)=>(
                  <tr key={row.id||i} style={{ backgroundColor:i%2===0?"#fff":"#fafafa" }}
                    onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#fdf8f4")}
                    onMouseLeave={e=>(e.currentTarget.style.backgroundColor=i%2===0?"#fff":"#fafafa")}
                  >
                    <td style={{ padding:"10px 14px", fontSize:"13px", color:"#333", borderBottom:"1px solid #f5f5f5", borderRight:"1px solid #f0f0f0", whiteSpace:"nowrap" }}>
                      {editRow===i
                        ?<input type="date" value={editForm.date||row.date} onChange={e=>setEditForm(f=>({...f,date:e.target.value}))} style={{ ...inputStyle, padding:"5px 8px", fontSize:"12px" }} onFocus={fo} onBlur={fb}/>
                        :(row.date||"—")
                      }
                    </td>
                    {NFTC_COLUMNS.map(c=>{
                      const cmp = compareToStandard(c.key, row[c.key]);
                      return (
                        <td key={c.key} style={{ ...cellStyle(false, editRow===i), borderBottom:"1px solid #f5f5f5", position:"relative" }}>
                          {editRow===i
                            ?<input value={editForm[c.key]!==undefined?editForm[c.key]:row[c.key]||""} onChange={e=>setEditForm(f=>({...f,[c.key]:e.target.value}))}
                              style={{ ...inputStyle, padding:"5px 8px", fontSize:"12px", textAlign:"center" }} onFocus={fo} onBlur={fb}/>
                            :<span style={{ fontWeight:"700", color:cmp==="better"?"#2e7d32":cmp==="worse"?"#cc3333":"#333" }}>
                              {row[c.key]||"—"}
                              {cmp==="better"&&<span style={{ fontSize:"10px", marginLeft:"3px" }}>↑</span>}
                              {cmp==="worse" &&<span style={{ fontSize:"10px", marginLeft:"3px" }}>↓</span>}
                            </span>
                          }
                        </td>
                      );
                    })}
                    <td style={{ padding:"10px 12px", fontSize:"12px", color:"#555", borderBottom:"1px solid #f5f5f5", borderRight:"1px solid #f0f0f0", whiteSpace:"nowrap" }}>
                      {editRow===i
                        ?<input value={editForm.testBy!==undefined?editForm.testBy:row.testBy||""} onChange={e=>setEditForm(f=>({...f,testBy:e.target.value}))}
                          style={{ ...inputStyle, padding:"5px 8px", fontSize:"12px" }} onFocus={fo} onBlur={fb}/>
                        :(row.testBy||"—")
                      }
                    </td>
                    <td style={{ padding:"8px 12px", borderBottom:"1px solid #f5f5f5" }}>
                      <div style={{ display:"flex", gap:"5px", justifyContent:"center" }}>
                        {editRow===i ? (
                          <>
                            <button onClick={saveEdit}
                              style={{ width:"28px", height:"28px", borderRadius:"6px", backgroundColor:"#f0faf0", border:"1px solid #b8e6b8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                              onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#b8e6b8")} onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#f0faf0")}
                            ><Save size={12} style={{ color:"#2e7d32" }}/></button>
                            <button onClick={()=>{setEditRow(null);setEditForm({});}}
                              style={{ width:"28px", height:"28px", borderRadius:"6px", backgroundColor:"#f5f5f5", border:"1px solid #e0e0e0", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                              onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#e0e0e0")} onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#f5f5f5")}
                            ><X size={12} style={{ color:"#888" }}/></button>
                          </>
                        ) : (
                          <>
                            <button onClick={()=>{setEditRow(i);setEditForm({...row});}}
                              style={{ width:"28px", height:"28px", borderRadius:"6px", backgroundColor:"#e8f3fb", border:"1px solid #cfe6f7", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                              onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#cfe6f7")} onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#e8f3fb")}
                            ><Edit2 size={12} style={{ color:"#2f9be0" }}/></button>
                            <button onClick={()=>deleteRow(i)}
                              style={{ width:"28px", height:"28px", borderRadius:"6px", backgroundColor:"#fff0f0", border:"1px solid #ffc5c5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                              onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#ffc5c5")} onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#fff0f0")}
                            ><Trash2 size={12} style={{ color:"#cc3333" }}/></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ padding:"10px 16px", borderTop:"1px solid #f0f0f0", backgroundColor:"#fafafa", display:"flex", gap:"16px", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <span style={{ fontSize:"12px", fontWeight:"700", color:"#2e7d32" }}>↑</span>
              <span style={{ fontSize:"11px", color:"#666" }}>Meets/exceeds standard</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <span style={{ fontSize:"12px", fontWeight:"700", color:"#cc3333" }}>↓</span>
              <span style={{ fontSize:"11px", color:"#666" }}>Below standard</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TRAINER DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const V = { HOME:"home", PLAYER:"player" };

export default function TrainerDashboard() {
  const [players,      setPlayers]      = useState(INITIAL_PLAYERS);
  const [view,         setView]         = useState(V.HOME);
  const [activePlayer, setActivePlayer] = useState(null);
  const [activeTab,    setActiveTab]    = useState("workload");
  const [allSessions,  setAllSessions]  = useState({});
  const [allNftc,      setAllNftc]      = useState({});

  const ww = useWindowWidth();
  const isMobile = ww < 640;
  const isTablet = ww < 900;

  const getSessions  = pid => allSessions[pid] || [];
  const setSessions  = (pid,fn) => setAllSessions(prev=>({...prev,[pid]:typeof fn==="function"?fn(prev[pid]||[]):fn}));
  const getNftcData  = pid => allNftc[pid] || [];
  const setNftcData  = (pid,fn) => setAllNftc(prev=>({...prev,[pid]:typeof fn==="function"?fn(prev[pid]||[]):fn}));

  const TABS = [
    {key:"workload", label:"Workload",        icon:TrendingUp},
    {key:"sessions", label:"Sessions",        icon:Dumbbell},
    {key:"fitness",  label:"Fitness Overview",icon:BarChart2},
    {key:"nftc",     label:"NFTC",            icon:Target},
  ];

  // ── HOME ──
  if (view===V.HOME) return (
    <div style={{ padding:"clamp(14px,4vw,28px)", maxWidth:"1100px", margin:"0 auto" }}>
      <Heading title="Trainer Dashboard" sub="Monitor player workload, sessions and fitness"/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"14px", marginBottom:"22px" }}>
        {[
          {label:"Total Players",  value:players.length,                                    icon:Users,       color:"#2f9be0"},
          {label:"Active Players", value:players.filter(p=>p.status==="Active").length,      icon:Activity,    color:"#2e7d32"},
          {label:"Injured",        value:players.filter(p=>p.status==="Injured").length,     icon:AlertCircle, color:"#cc3333"},
          {label:"Total Sessions", value:Object.values(allSessions).flat().length,           icon:Calendar,    color:"#3b82f6"},
        ].map(s=>(
          <div key={s.label} style={card({ padding:"16px 18px", borderLeft:`4px solid ${s.color}` })}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"5px" }}>
              <span style={{ fontSize:"22px", fontWeight:"800", color:s.color }}>{s.value}</span>
              <div style={{ width:"34px", height:"34px", borderRadius:"9px", backgroundColor:s.color+"18", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <s.icon size={16} style={{ color:s.color }}/>
              </div>
            </div>
            <span style={{ fontSize:"12px", color:"#888", fontWeight:"500" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={card({ overflow:"hidden" })}>
        <div style={{ padding:"14px 22px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:"8px" }}>
          <Users size={15} style={{ color:"#2f9be0" }}/>
          <span style={{ fontSize:"14px", fontWeight:"700", color:"#333" }}>Players</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill,minmax(${isMobile?"100%":"240px"},1fr))` }}>
          {players.map((p,i)=>{
            const sessCount=getSessions(p.id).length;
            return (
              <div key={p.id} onClick={()=>{setActivePlayer(p);setActiveTab("workload");setView(V.PLAYER);}}
                style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px 20px", cursor:"pointer", borderRight:(!isMobile&&i%2===0)?"1px solid #f5f5f5":"none", borderBottom:i<players.length-1?"1px solid #f5f5f5":"none", transition:"background 0.12s" }}
                onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#fdf8f4")}
                onMouseLeave={e=>(e.currentTarget.style.backgroundColor="transparent")}
              >
                <div style={{ width:"42px", height:"42px", borderRadius:"50%", backgroundColor:p.status==="Injured"?"#fff0f0":"#e8f3fb", border:`2px solid ${p.status==="Injured"?"#ffc5c5":"#cfe6f7"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"800", color:p.status==="Injured"?"#cc3333":"#2f9be0", flexShrink:0 }}>{p.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"14px", fontWeight:"700", color:"#222" }}>{p.name}</span>
                    {p.status==="Injured"&&<span style={{ fontSize:"10px", fontWeight:"700", color:"#cc3333", backgroundColor:"#fff0f0", border:"1px solid #ffc5c5", borderRadius:"20px", padding:"2px 7px" }}>Injured</span>}
                  </div>
                  <div style={{ fontSize:"12px", color:"#888", marginTop:"1px" }}>{p.role} · {sessCount} session{sessCount!==1?"s":""}</div>
                </div>
                <ChevronRight size={15} style={{ color:"#ccc" }}/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── PLAYER HUB ──
  if (view===V.PLAYER&&activePlayer) {
    const sessions   = getSessions(activePlayer.id);
    const setMySession = fn => setSessions(activePlayer.id,fn);
    const nftcData   = getNftcData(activePlayer.id);
    const setMyNftc  = fn => setNftcData(activePlayer.id,fn);

    return (
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#1a2340 0%,#2d3a5c 100%)", padding:"clamp(16px,4vw,28px) clamp(16px,4vw,28px) 0", borderBottom:"1px solid #e8e8e8" }}>
          <button onClick={()=>setView(V.HOME)}
            style={{ display:"flex", alignItems:"center", gap:"6px", background:"none", border:"none", color:"rgba(255,255,255,0.7)", fontSize:"13px", fontWeight:"600", cursor:"pointer", marginBottom:"14px", padding:"0" }}>
            <ArrowLeft size={15}/> All Players
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"20px", flexWrap:"wrap" }}>
            <div style={{ width:"48px", height:"48px", borderRadius:"50%", backgroundColor:activePlayer.status==="Injured"?"#cc3333":"#2f9be0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", fontWeight:"800", color:"#fff", flexShrink:0 }}>
              {activePlayer.avatar}
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                <h2 style={{ fontSize:"clamp(16px,3vw,20px)", fontWeight:"800", color:"#fff", margin:0 }}>{activePlayer.name}</h2>
                <span style={{ fontSize:"11px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px", backgroundColor:activePlayer.status==="Injured"?"#cc3333":"rgba(255,255,255,0.15)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)" }}>{activePlayer.status}</span>
              </div>
              <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", marginTop:"3px" }}>{activePlayer.role} · {sessions.length} session{sessions.length!==1?"s":""}</div>
            </div>
          </div>

          {/* Tab bar — scrollable on mobile */}
          <div style={{ display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
            {TABS.map(tab=>(
              <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
                style={{ display:"flex", alignItems:"center", gap:"6px", padding:"11px clamp(12px,2vw,20px)", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"700", backgroundColor:"transparent", color:activeTab===tab.key?"#fff":"rgba(255,255,255,0.5)", borderBottom:activeTab===tab.key?"3px solid #2f9be0":"3px solid transparent", transition:"all 0.15s", whiteSpace:"nowrap", flexShrink:0 }}>
                <tab.icon size={14}/> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab==="workload" && <WorkloadDashboard player={activePlayer} sessions={sessions}/>}
        {activeTab==="sessions" && <SessionsView player={activePlayer} sessions={sessions} setSessions={setMySession}/>}
        {activeTab==="fitness"  && <FitnessOverview player={activePlayer}/>}
        {activeTab==="nftc"     && <NFTCView player={activePlayer} nftcData={nftcData} setNftcData={setMyNftc}/>}
      </div>
    );
  }

  return null;
}