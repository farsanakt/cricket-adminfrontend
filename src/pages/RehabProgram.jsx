import { useState, useRef, useEffect } from "react";
import {
  Search, Filter, X, Plus, Minus, Save,
  ChevronRight, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle2, Activity,
  Download, Edit2, ArrowLeft, Heart,
  Dumbbell, RotateCcw, Play, Image as ImgIcon,
} from "lucide-react";

import { PageBanner } from "../theme";

// Import your backend function
import { exitingExercises } from "../api/authApi"; // Update this path

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_PLAYERS = [
  { id:1, name:"Arjun Menon",    age:23, injury:"—",              team:"Kerala CA",    status:"Available", category:"Senior"   },
  { id:2, name:"Rahul Das",      age:25, injury:"Shoulder Strain",team:"Kerala CA",    status:"Injured",   category:"Senior"   },
  { id:3, name:"Vivek Pillai",   age:22, injury:"—",              team:"Kerala CA",    status:"Available", category:"Under-23" },
  { id:4, name:"Sneha Krishnan", age:22, injury:"—",              team:"Kerala Women", status:"Available", category:"Senior"   },
  { id:5, name:"Priya Menon",    age:19, injury:"—",              team:"Kerala Women", status:"Available", category:"Under-23" },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Available: { bg:"#f0faf0", color:"#2e7d32", border:"#b8e6b8", dot:"#2e7d32" },
  Injured:   { bg:"#fff0f0", color:"#cc3333", border:"#ffc5c5", dot:"#cc3333" },
  Resting:   { bg:"#fff8e1", color:"#f9a825", border:"#ffe082", dot:"#f9a825" },
};
const CAT_COLORS = {
  "Senior":   { bg:"#e8f3fb", color:"#2f9be0", border:"#cfe6f7" },
  "Under-23": { bg:"#e3f2fd", color:"#1976d2", border:"#90caf9" },
  "Under-19": { bg:"#f3e5f5", color:"#7b1fa2", border:"#ce93d8" },
  "Under-16": { bg:"#f0faf0", color:"#2e7d32", border:"#b8e6b8" },
  "Under-14": { bg:"#fce4ec", color:"#c2185b", border:"#f48fb1" },
  "Under-10": { bg:"#ffebee", color:"#d32f2f", border:"#ef9a9a" },
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const card = (x = {}) => ({
  backgroundColor:"#fff", borderRadius:"10px",
  border:"1px solid #e8e8e8", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", ...x,
});

const initials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

const Badge = ({ label, bg, color, border }) => (
  <span style={{ fontSize:"11px", fontWeight:"700", padding:"2px 9px", borderRadius:"20px", backgroundColor:bg, color, border:`1px solid ${border}` }}>
    {label}
  </span>
);

const OBtn = ({ children, onClick, style={} }) => (
  <button onClick={onClick}
    style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"9px 20px", backgroundColor:"#2f9be0", color:"#fff", border:"none", borderRadius:"8px", fontSize:"13px", fontWeight:"700", cursor:"pointer", boxShadow:"0 2px 8px rgba(47, 155, 224,0.28)", ...style }}
    onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#2380c2")}
    onMouseLeave={e=>(e.currentTarget.style.backgroundColor=style.backgroundColor||"#2f9be0")}
  >{children}</button>
);

const GhostBtn = ({ children, onClick, style={} }) => (
  <button onClick={onClick}
    style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"8px 16px", backgroundColor:"#fff", color:"#555", border:"1.5px solid #e0e0e0", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer", ...style }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor="#2f9be0"; e.currentTarget.style.color="#2f9be0"; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor="#e0e0e0"; e.currentTarget.style.color="#555"; }}
  >{children}</button>
);

const inputStyle = {
  width:"100%", padding:"9px 12px", border:"1.5px solid #e0e0e0",
  borderRadius:"7px", fontSize:"13px", color:"#333",
  backgroundColor:"#f9f9f9", outline:"none", boxSizing:"border-box", fontFamily:"inherit",
};
const fo = e => (e.target.style.borderColor="#2f9be0");
const fb = e => (e.target.style.borderColor="#e0e0e0");

const ToggleSwitch = ({ val, set }) => (
  <button onClick={()=>set(v=>!v)}
    style={{ width:"40px", height:"22px", borderRadius:"11px", backgroundColor:val?"#2e7d32":"#ccc", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
    <div style={{ position:"absolute", top:"3px", left:val?"21px":"3px", width:"16px", height:"16px", borderRadius:"50%", backgroundColor:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
  </button>
);

const SpinInput = ({ label, val, set, min=1, max=99 }) => (
  <div>
    <div style={{ fontSize:"12px", fontWeight:"700", color:"#888", marginBottom:"8px" }}>{label}</div>
    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
      <button onClick={()=>set(v=>Math.max(min,v-1))}
        style={{ width:"30px", height:"30px", borderRadius:"6px", border:"1.5px solid #e0e0e0", backgroundColor:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
        onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#f9f9f9")}
        onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#fff")}
      ><Minus size={11}/></button>
      <input type="number" value={val} onChange={e=>set(Number(e.target.value))}
        style={{ width:"50px", textAlign:"center", fontSize:"14px", fontWeight:"800", color:"#222", border:"1.5px solid #e0e0e0", borderRadius:"6px", padding:"6px 0", outline:"none", backgroundColor:"#fff" }}
        onFocus={fo} onBlur={fb}/>
      <button onClick={()=>set(v=>Math.min(max,v+1))}
        style={{ width:"30px", height:"30px", borderRadius:"6px", border:"1.5px solid #e0e0e0", backgroundColor:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
        onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#f9f9f9")}
        onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#fff")}
      ><Plus size={11}/></button>
    </div>
  </div>
);

// ─── WORKOUT LIBRARY WITH BACKEND ─────────────────────────────────────────────
function WorkoutLibrary({ added, onAdd, onRemove, onCardClick, selectedId, exercises, loading, error }) {
  const [search,   setSearch]   = useState("");
  const [showFil,  setShowFil]  = useState(false);
  const [fil,      setFil]      = useState({ cat:"All", joint:"All" });

  const activeCount = Object.values(fil).filter(v=>v!=="All").length;
  const isAdded = id => added.some(a=>a._id===id || a.id===id);

  // Extract unique categories and joints from backend data
  const CATS = ["All", ...new Set(exercises.map(e => e.category))];
  const JOINTS = ["All", ...new Set(exercises.map(e => e.jointArea))];

  const visible = exercises.filter(e => {
    const q = search.toLowerCase();
    return (
      (!q || e.name.toLowerCase().includes(q) || (e.category && e.category.toLowerCase().includes(q))) &&
      (fil.cat   ==="All" || e.category === fil.cat) &&
      (fil.joint ==="All" || e.jointArea === fil.joint)
    );
  });

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#aaa" }}>
        Loading exercises...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#cc3333" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      {/* ── LEFT: Library ── */}
      <div style={{ display:"flex", flexDirection:"column", flex:1, borderRight:"1px solid #f0f0f0", overflow:"hidden" }}>

        {/* Toolbar */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ position:"relative", flex:1, minWidth:"150px" }}>
            <Search size={13} style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", color:"#aaa" }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exercises…"
              style={{ ...inputStyle, paddingLeft:"32px" }} onFocus={fo} onBlur={fb}/>
            {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#aaa", display:"flex" }}><X size={13}/></button>}
          </div>
          <button onClick={()=>setShowFil(v=>!v)}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 12px", borderRadius:"7px", border:`1.5px solid ${showFil?"#2f9be0":"#e0e0e0"}`, backgroundColor:showFil?"#e8f3fb":"#fff", color:showFil?"#2f9be0":"#666", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
            <Filter size={12}/> Filters
            {activeCount>0 && <span style={{ width:"18px", height:"18px", borderRadius:"50%", backgroundColor:"#2f9be0", color:"#fff", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>{activeCount}</span>}
          </button>
        </div>

        {/* Filter drawer */}
        {showFil && (
          <div style={{ padding:"12px 16px", backgroundColor:"#e8f3fb", borderBottom:"1px solid #cfe6f7", display:"flex", flexWrap:"wrap", gap:"14px", alignItems:"flex-end" }}>
            {[["Category","cat",CATS],["Joint / Area","joint",JOINTS]].map(([lbl,key,opts])=>(
              <div key={key}>
                <div style={{ fontSize:"10px", fontWeight:"700", color:"#888", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"4px" }}>{lbl}</div>
                <div style={{ position:"relative" }}>
                  <select value={fil[key]} onChange={e=>setFil(f=>({...f,[key]:e.target.value}))}
                    style={{ ...inputStyle, width:"auto", minWidth:"140px", cursor:"pointer", paddingRight:"28px", appearance:"none" }} onFocus={fo} onBlur={fb}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position:"absolute", right:"9px", top:"50%", transform:"translateY(-50%)", color:"#aaa", pointerEvents:"none" }}/>
                </div>
              </div>
            ))}
            <button onClick={()=>setFil({cat:"All",joint:"All"})}
              style={{ display:"flex", alignItems:"center", gap:"5px", padding:"8px 12px", fontSize:"12px", fontWeight:"600", color:"#cc3333", border:"1.5px solid #ffc5c5", backgroundColor:"#fff0f0", borderRadius:"7px", cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#ffe0e0")}
              onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#fff0f0")}
            ><RotateCcw size={11}/> Clear</button>
          </div>
        )}

        {/* Exercise grid */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:"10px", alignContent:"start" }}>
          {visible.map(ex => {
            const exId = ex._id || ex.id;
            const active  = selectedId===exId;
            const already = isAdded(exId);
            return (
              <div key={exId} onClick={()=>{ onCardClick(ex); if(!already) onAdd(ex); }}
                style={{ borderRadius:"10px", border:`2px solid ${active?"#2f9be0":"#e8e8e8"}`, overflow:"hidden", cursor:"pointer", backgroundColor:active?"#e8f3fb":"#fff", transition:"all 0.15s", boxShadow:active?"0 0 0 3px rgba(47, 155, 224,0.12)":"0 1px 4px rgba(0,0,0,0.05)" }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.borderColor="#cfe6f7"; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.borderColor="#e8e8e8"; }}
              >
                {/* Thumbnail area with GIF */}
                <div style={{ height:"76px", background:"linear-gradient(135deg,#f5f5f5,#e0e0e0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px", userSelect:"none", overflow:"hidden" }}>
                  {ex.gifUrl ? (
                    <img src={ex.gifUrl} alt={ex.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  ) : (
                    <span>📋</span>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding:"9px 10px" }}>
                  <div style={{ fontSize:"12px", fontWeight:"700", color:"#222", lineHeight:"1.3", marginBottom:"7px" }}>{ex.name}</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"10px", fontWeight:"600", backgroundColor:"#f5f5f5", color:"#888", borderRadius:"4px", padding:"2px 7px" }}>{ex.category}</span>
                    <button onClick={e=>{ e.stopPropagation(); already?onRemove(exId):onAdd(ex); }}
                      style={{ width:"20px", height:"20px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", backgroundColor:already?"#cc3333":"#2f9be0", border:"none", cursor:"pointer", transition:"background 0.15s" }}
                      onMouseEnter={e=>(e.currentTarget.style.backgroundColor=already?"#bb2222":"#2380c2")}
                      onMouseLeave={e=>(e.currentTarget.style.backgroundColor=already?"#cc3333":"#2f9be0")}
                    >{already?<Minus size={10}/>:<Plus size={10}/>}</button>
                  </div>
                </div>
              </div>
            );
          })}
          {visible.length===0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", paddingTop:"40px", paddingBottom:"40px" }}>
              <Search size={26} style={{ color:"#ddd", margin:"0 auto 8px", display:"block" }}/>
              <p style={{ fontSize:"13px", color:"#bbb" }}>No exercises match</p>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Added exercises ── */}
      <div style={{ width:"210px", display:"flex", flexDirection:"column", backgroundColor:"#fafafa", flexShrink:0 }}>
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #e8e8e8", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:"11px", fontWeight:"700", color:"#888", textTransform:"uppercase", letterSpacing:"0.5px" }}>Added</span>
          <Badge label={String(added.length)} bg="#e8f3fb" color="#2f9be0" border="#cfe6f7"/>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"10px", display:"flex", flexDirection:"column", gap:"8px", scrollBehavior:"smooth", msOverflowStyle:"none", scrollbarWidth:"none" }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>
          {added.length===0 ? (
            <div style={{ textAlign:"center", paddingTop:"32px" }}>
              <Dumbbell size={22} style={{ color:"#ccc", margin:"0 auto 8px", display:"block" }}/>
              <p style={{ fontSize:"12px", color:"#ccc" }}>Click + to add exercises</p>
            </div>
          ) : added.map(ex=>(
            <div key={ex._id || ex.id} style={card({ padding:"10px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"6px" })}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#222", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ex.name}</div>
                <div style={{ fontSize:"10px", color:"#aaa", marginTop:"3px" }}>{ex.sets}×{ex.reps} · {ex.rest}s</div>
              </div>
              <button onClick={()=>onRemove(ex._id || ex.id)}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#ddd", padding:"0", flexShrink:0, display:"flex" }}
                onMouseEnter={e=>(e.currentTarget.style.color="#cc3333")}
                onMouseLeave={e=>(e.currentTarget.style.color="#ddd")}
              ><X size={12}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EXERCISE DETAIL MODAL ────────────────────────────────────────────────────
function ExerciseModal({ exercise, existing, onSave, onClose }) {
  const [sets,  setSets]  = useState(existing?.sets  ?? 3);
  const [reps,  setReps]  = useState(existing?.reps  ?? 10);
  const [rest,  setRest]  = useState(existing?.rest  ?? 60);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [tab,   setTab]   = useState("gif");
  if (!exercise) return null;

  return (
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ backgroundColor:"#fff", borderRadius:"14px", width:"100%", maxWidth:"700px", maxHeight:"87vh", overflowY:"auto", boxShadow:"0 24px 48px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"22px 24px 0" }}>
          <h2 style={{ fontSize:"18px", fontWeight:"800", color:"#222", paddingRight:"32px", lineHeight:"1.3", margin:0 }}>{exercise.name}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", fontSize:"20px", lineHeight:1, flexShrink:0 }}>×</button>
        </div>

        <div style={{ display:"flex", gap:"0", padding:"22px 24px" }}>
          {/* Left: gif + description */}
          <div style={{ flex:1, paddingRight:"22px", borderRight:"1px solid #f0f0f0" }}>
            {/* Tab */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"14px", flexWrap:"wrap" }}>
              {[{k:"gif",icon:<Play size={11}/>,label:"GIF"},{k:"images",icon:<ImgIcon size={11}/>,label:"Images"}].map(t=>(
                <button key={t.k} onClick={()=>setTab(t.k)}
                  style={{ display:"flex", alignItems:"center", gap:"5px", padding:"6px 12px", borderRadius:"7px", border:`1.5px solid ${tab===t.k?"#2f9be0":"#e0e0e0"}`, backgroundColor:tab===t.k?"#e8f3fb":"#fff", color:tab===t.k?"#2f9be0":"#888", fontSize:"12px", fontWeight:"700", cursor:"pointer" }}>
                  {t.icon}{t.label}
                </button>
              ))}
              <button style={{ display:"flex", alignItems:"center", gap:"5px", padding:"6px 12px", borderRadius:"7px", border:"1.5px solid #e0e0e0", backgroundColor:"#fff", color:"#aaa", fontSize:"12px", fontWeight:"600", cursor:"pointer", marginLeft:"auto" }}
                onMouseEnter={e=>{e.currentTarget.style.color="#cc3333";e.currentTarget.style.borderColor="#ffc5c5";}}
                onMouseLeave={e=>{e.currentTarget.style.color="#aaa";e.currentTarget.style.borderColor="#e0e0e0";}}
              ><Heart size={11}/> Favourite</button>
            </div>

            {/* Description */}
            <p style={{ fontSize:"13px", color:"#555", lineHeight:"1.65", marginBottom:"16px" }}>{exercise.description || "No description available"}</p>

            {/* GIF Display */}
            <div style={{ borderRadius:"10px", background:"linear-gradient(135deg,#f0f0f0,#e0e0e0)", height:"170px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", overflow:"hidden" }}>
              {exercise.gifUrl ? (
                <img src={exercise.gifUrl} alt={exercise.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              ) : (
                <div style={{ textAlign:"center" }}>
                  <ImgIcon size={32} style={{ color:"#bbb", marginBottom:"8px" }}/>
                  <p style={{ fontSize:"12px", color:"#aaa", margin:0 }}>No GIF available</p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {[exercise.category, exercise.jointArea, exercise.difficulty, exercise.position].filter(Boolean).map(t=>(
                <Badge key={t} label={t} bg="#e8f3fb" color="#2f9be0" border="#cfe6f7"/>
              ))}
            </div>
          </div>

          {/* Right: edit controls */}
          <div style={{ width:"210px", flexShrink:0, paddingLeft:"22px" }}>
            <h3 style={{ fontSize:"14px", fontWeight:"700", color:"#222", marginBottom:"18px", marginTop:0 }}>Edit exercise</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <SpinInput label="Sets" val={sets} set={setSets} min={1} max={10}/>
              <SpinInput label="Reps" val={reps} set={setReps} min={1} max={50}/>

              {/* Rest */}
              <div>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#888", marginBottom:"8px" }}>Rest duration</div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <button onClick={()=>setRest(v=>Math.max(0,v-10))}
                    style={{ width:"30px", height:"30px", borderRadius:"6px", border:"1.5px solid #e0e0e0", backgroundColor:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                    onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#f9f9f9")}
                    onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#fff")}
                  ><Minus size={11}/></button>
                  <input type="number" value={rest} onChange={e=>setRest(Number(e.target.value))}
                    style={{ width:"50px", textAlign:"center", fontSize:"14px", fontWeight:"800", color:"#222", border:"1.5px solid #e0e0e0", borderRadius:"6px", padding:"6px 0", outline:"none", backgroundColor:"#fff" }}
                    onFocus={fo} onBlur={fb}/>
                  <span style={{ fontSize:"12px", color:"#aaa" }}>sec</span>
                  <button onClick={()=>setRest(v=>v+10)}
                    style={{ width:"30px", height:"30px", borderRadius:"6px", border:"1.5px solid #e0e0e0", backgroundColor:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                    onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#f9f9f9")}
                    onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#fff")}
                  ><Plus size={11}/></button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#888", marginBottom:"6px" }}>Notes (optional)</div>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3}
                  placeholder="Add additional notes…"
                  style={{ ...inputStyle, resize:"vertical" }} onFocus={fo} onBlur={fb}/>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:"8px", marginTop:"18px" }}>
              <OBtn onClick={()=>onSave({...exercise,sets,reps,rest,notes})} style={{ flex:1, justifyContent:"center", padding:"9px 12px" }}>
                <Save size={13}/> Save
              </OBtn>
              <GhostBtn onClick={onClose} style={{ padding:"9px 12px" }}>Cancel</GhostBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ASSIGN MODAL ─────────────────────────────────────────────────────────────
function AssignModal({ player, programName, onConfirm, onClose }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [startDate, setStart]  = useState(todayStr);
  const [endDate,   setEnd]    = useState("");
  const [freq,      setFreq]   = useState("specific");
  const [days,      setDays]   = useState(["Mon","Wed","Fri"]);
  const [pain,      setPain]   = useState(true);
  const [rpe,       setRpe]    = useState(true);
  const [notif,     setNotif]  = useState(true);
  const [recording, setRec]    = useState("Optional");

  const toggleDay = d => setDays(ds=>ds.includes(d)?ds.filter(x=>x!==d):[...ds,d]);
  const qDate = off => { const d=new Date(); d.setDate(d.getDate()+off); return d.toISOString().split("T")[0]; };

  const selBtnStyle = active => ({
    padding:"7px 14px", borderRadius:"7px", fontSize:"12px", fontWeight:"700", cursor:"pointer",
    border:`1.5px solid ${active?"#2f9be0":"#e0e0e0"}`,
    backgroundColor:active?"#2f9be0":"#fff", color:active?"#fff":"#666", transition:"all 0.15s",
  });

  const SectionHead = ({title}) => (
    <div style={{ fontSize:"16px", fontWeight:"800", color:"#222", marginBottom:"6px", marginTop:"0", paddingBottom:"8px", borderBottom:"1px solid #f0f0f0" }}>{title}</div>
  );

  return (
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.45)", zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ backgroundColor:"#fff", borderRadius:"14px", width:"100%", maxWidth:"440px", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 48px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", borderBottom:"1px solid #f0f0f0" }}>
          <div>
            <div style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"3px" }}>Assign to {player.name}</div>
            <h2 style={{ fontSize:"15px", fontWeight:"800", color:"#222", margin:0 }}>{programName||"Rehab Program"}</h2>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", fontSize:"20px", lineHeight:1 }}>×</button>
        </div>

        <div style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:"20px" }}>

          {/* Start date */}
          <div>
            <SectionHead title="Start Date"/>
            <div style={{ fontSize:"13px", color:"#888", marginBottom:"10px" }}>When do you want this program to start?</div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
              {[["Today",0],["Tomorrow",1],["+1 Week",7]].map(([lbl,off])=>{
                const d = qDate(off);
                return <button key={lbl} onClick={()=>setStart(d)} style={selBtnStyle(startDate===d)}>{lbl}</button>;
              })}
            </div>
            <div>
              <div style={{ fontSize:"11px", fontWeight:"700", color:"#aaa", marginBottom:"4px", textTransform:"uppercase" }}>Custom date</div>
              <input type="date" value={startDate} onChange={e=>setStart(e.target.value)}
                style={{ ...inputStyle, maxWidth:"180px" }} onFocus={fo} onBlur={fb}/>
            </div>
          </div>

          {/* End date */}
          <div>
            <SectionHead title="End Date"/>
            <input type="date" value={endDate} onChange={e=>setEnd(e.target.value)}
              style={{ ...inputStyle, maxWidth:"180px" }} onFocus={fo} onBlur={fb}/>
          </div>

          {/* Frequency */}
          <div>
            <SectionHead title="Program Frequency"/>
            <div style={{ fontSize:"13px", color:"#888", marginBottom:"10px" }}>How often should they perform this program?</div>
            <div style={{ position:"relative", marginBottom:"12px" }}>
              <select value={freq} onChange={e=>setFreq(e.target.value)}
                style={{ ...inputStyle, cursor:"pointer", maxWidth:"220px", paddingRight:"28px", appearance:"none" }} onFocus={fo} onBlur={fb}>
                <option value="specific">On specific days</option>
                <option value="daily">Every day</option>
                <option value="alternate">Alternate days</option>
              </select>
              <ChevronDown size={13} style={{ position:"absolute", right:"9px", top:"50%", transform:"translateY(-50%)", color:"#aaa", pointerEvents:"none" }}/>
            </div>
            {freq==="specific" && (
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                  <button key={d} onClick={()=>toggleDay(d)} style={selBtnStyle(days.includes(d))}>{d}</button>
                ))}
              </div>
            )}
          </div>

          {/* Program options */}
          <div>
            <SectionHead title="Program Options"/>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:"13px", color:"#555" }}>Client recording setting</span>
                <div style={{ position:"relative" }}>
                  <select value={recording} onChange={e=>setRec(e.target.value)}
                    style={{ ...inputStyle, width:"auto", fontSize:"12px", padding:"5px 26px 5px 10px", cursor:"pointer", appearance:"none" }} onFocus={fo} onBlur={fb}>
                    <option>Optional</option><option>Required</option><option>Disabled</option>
                  </select>
                  <ChevronDown size={11} style={{ position:"absolute", right:"8px", top:"50%", transform:"translateY(-50%)", color:"#aaa", pointerEvents:"none" }}/>
                </div>
              </div>
              {[["Pain reporting",pain,setPain],["RPE reporting",rpe,setRpe],["Notifications enabled",notif,setNotif]].map(([lbl,val,set])=>(
                <div key={lbl} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"13px", color:"#555" }}>{lbl}</span>
                  <ToggleSwitch val={val} set={set}/>
                </div>
              ))}
            </div>
          </div>

          {/* Assign CTA */}
          <OBtn onClick={()=>onConfirm({startDate,endDate,freq,days,pain,rpe,notif,recording})}
            style={{ width:"100%", justifyContent:"center", padding:"13px" }}>
            <CheckCircle2 size={15}/> Assign to Profile
          </OBtn>
        </div>
      </div>
    </div>
  );
}

// ─── CREATE PROGRAM MODAL ────────────────────────────���────────────────────────
function CreateProgramModal({ player, onClose, onCreated, exercises, loading, error }) {
  const [tab,        setTab]       = useState("workout");
  const [progName,   setProgName]  = useState("");
  const [progNote,   setProgNote]  = useState("");
  const [addedExercises, setAddedExercises] = useState([]);
  const [selEx,      setSelEx]     = useState(null);
  const [exModal,    setExModal]   = useState(false);
  const [goals,      setGoals]     = useState("");
  const [assignOpen, setAssignOpen]= useState(false);

  const handleAdd    = ex  => { if(!addedExercises.some(e=>e._id===ex._id || e.id===ex.id)) setAddedExercises(p=>[...p,{...ex,sets:3,reps:10,rest:60,notes:""}]); };
  const handleRemove = id  => setAddedExercises(p=>p.filter(e=>e._id!==id && e.id!==id));
  const handleClick  = ex  => { setSelEx(ex); setExModal(true); };
  const handleSave   = upd => { setAddedExercises(p=>p.some(e=>(e._id || e.id)===(upd._id || upd.id))?p.map(e=>(e._id || e.id)===(upd._id || upd.id)?upd:e):[...p,upd]); setExModal(false); };

  const TABS = [
    { key:"weekly",  label:"⊙ Weekly Goals"    },
    { key:"workout", label:"🔗 Workout Program" },
    { key:"quick",   label:"⊙ Quick Exercises"  },
  ];

  const tabBtnStyle = active => ({
    padding:"12px 18px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"700",
    backgroundColor:"transparent", color:active?"#2f9be0":"#888",
    borderBottom:active?"2px solid #2f9be0":"2px solid transparent",
    marginBottom:"-1px", transition:"all 0.15s",
  });

  return (
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.4)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
      <div style={{ backgroundColor:"#fff", borderRadius:"14px", width:"100%", maxWidth:"940px", maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 48px rgba(0,0,0,0.18)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", borderBottom:"1px solid #f0f0f0", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:"10px", fontWeight:"700", color:"#aaa", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"3px" }}>Creating program for</div>
            <h2 style={{ fontSize:"18px", fontWeight:"800", color:"#222", margin:0 }}>{player.name}</h2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <OBtn onClick={()=>addedExercises.length?setAssignOpen(true):alert("Add at least one exercise first")}
              style={{ padding:"8px 16px", fontSize:"13px" }}>
              <CheckCircle2 size={13}/> Assign to Profile
            </OBtn>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", fontSize:"22px", lineHeight:1 }}>×</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #f0f0f0", paddingLeft:"8px", flexShrink:0 }}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={tabBtnStyle(tab===t.key)}>{t.label}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {tab==="weekly" && (
            <div style={{ padding:"20px 24px" }}>
              <p style={{ fontSize:"13px", color:"#888", marginBottom:"12px" }}>Set weekly rehabilitation goals for <strong style={{ color:"#222" }}>{player.name}</strong>.</p>
              <textarea value={goals} onChange={e=>setGoals(e.target.value)} rows={5}
                placeholder="e.g. Improve shoulder range of motion by 20°, reduce pain during overhead activities…"
                style={{ ...inputStyle, resize:"vertical" }} onFocus={fo} onBlur={fb}/>
            </div>
          )}

          {tab==="workout" && (
            <>
              <div style={{ display:"flex", gap:"12px", padding:"12px 16px", borderBottom:"1px solid #f0f0f0", flexShrink:0 }}>
                <input value={progName} onChange={e=>setProgName(e.target.value)}
                  placeholder="Program name (e.g. Shoulder Rehab Phase 1)"
                  style={inputStyle} onFocus={fo} onBlur={fb}/>
                <input value={progNote} onChange={e=>setProgNote(e.target.value)}
                  placeholder="Program notes (e.g. Light mobility only)"
                  style={inputStyle} onFocus={fo} onBlur={fb}/>
              </div>
              <div style={{ flex:1, overflow:"hidden" }}>
                <WorkoutLibrary added={addedExercises} onAdd={handleAdd} onRemove={handleRemove} onCardClick={handleClick} selectedId={selEx?._id || selEx?.id} exercises={exercises} loading={loading} error={error}/>
              </div>
            </>
          )}

          {tab==="quick" && (
            <div style={{ padding:"20px 24px", color:"#aaa", fontSize:"13px" }}>
              Quick exercises can be prescribed without a full program. Use the Workout Program tab to build a structured plan.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px", padding:"14px 24px", borderTop:"1px solid #f0f0f0", flexShrink:0 }}>
          <GhostBtn onClick={onClose}><ArrowLeft size={13}/> Cancel</GhostBtn>
          <OBtn onClick={()=>addedExercises.length?setAssignOpen(true):alert("Add at least one exercise to the workout")}>
            <Save size={13}/> Save Session
          </OBtn>
        </div>
      </div>

      {exModal && selEx && (
        <ExerciseModal exercise={selEx} existing={addedExercises.find(e=>(e._id || e.id)===(selEx._id || selEx.id))} onSave={handleSave} onClose={()=>setExModal(false)}/>
      )}
      {assignOpen && (
        <AssignModal player={player} programName={progName}
          onConfirm={assignment=>{ onCreated({name:progName||"Rehab Program",notes:progNote,exercises:addedExercises,goals},assignment); setAssignOpen(false); }}
          onClose={()=>setAssignOpen(false)}/>
      )}
    </div>
  );
}

// ─── PROGRAM REPORT ───────────────────────────────────────────────────────────
function ProgramReport({ player, program, assignment, onBack }) {
  const printRef = useRef();

  const handleDownload = () => {
    const daysStr = assignment.freq==="specific" ? assignment.days.join(", ") : assignment.freq==="daily" ? "Every day" : "Alternate days";
    const win = window.open("","_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>${program.name}</title>
    <style>*{box-sizing:border-box}body{font-family:sans-serif;padding:36px;color:#222;background:#fff;margin:0}
    h1{font-size:22px;font-weight:800;margin:0 0 4px}.sub{font-size:13px;color:#888;margin:0 0 22px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px}
    .meta{padding:12px 14px;border:1px solid #e8e8e8;border-radius:8px}
    .meta label{font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px}
    .meta span{font-size:13px;font-weight:700}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{background:#fafafa;padding:10px 12px;text-align:left;font-weight:700;border-bottom:2px solid #e8e8e8;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.4px}
    td{padding:10px 12px;border-bottom:1px solid #f5f5f5}
    .badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;background:#e8f3fb;color:#2f9be0;border:1px solid #cfe6f7}
    .footer{margin-top:18px;font-size:11px;color:#aaa}
    @media print{body{padding:24px}}</style>
    </head><body>${printRef.current.innerHTML}</body></html>`);
    win.document.close(); win.focus(); win.print();
  };

  const daysStr = assignment.freq==="specific" ? assignment.days.join(", ") : assignment.freq==="daily" ? "Every day" : "Alternate days";

  return (
    <div style={{ padding:"28px", maxWidth:"960px", margin:"0 auto" }}>
      {/* Toolbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"22px", flexWrap:"wrap", gap:"12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <GhostBtn onClick={onBack}><ArrowLeft size={13}/> Back</GhostBtn>
          <div>
            <h2 style={{ fontFamily:"'Barlow Condensed', sans-serif", fontSize:"20px", fontWeight:"800", color:"#222", margin:0 }}>{program.name}</h2>
            <div style={{ width:"32px", height:"3px", backgroundColor:"#2f9be0", borderRadius:"2px", marginTop:"5px" }}/>
          </div>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <GhostBtn onClick={()=>{}}><Edit2 size={13}/> Edit</GhostBtn>
          <OBtn onClick={handleDownload}><Download size={13}/> Download PDF</OBtn>
        </div>
      </div>

      {/* Printable content */}
      <div ref={printRef}>
        <h1 style={{ fontFamily:"'Barlow Condensed', sans-serif", fontSize:"22px", fontWeight:"800", margin:"0 0 4px" }}>{program.name}</h1>
        <p style={{ fontSize:"13px", color:"#888", margin:"0 0 22px" }}>
          Assigned to: <strong>{player.name}</strong> · {player.injury!=="—"?player.injury:player.team}
        </p>

        {/* Meta grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"12px", marginBottom:"22px" }}>
          {[
            ["Start Date",      assignment.startDate],
            ["End Date",        assignment.endDate||"Open-ended"],
            ["Frequency",       daysStr],
            ["Recording",       assignment.recording],
            ["Pain Reporting",  assignment.pain?"Yes":"No"],
            ["RPE Reporting",   assignment.rpe?"Yes (0–10)":"No"],
            ["Notifications",   assignment.notif?"Yes":"No"],
            ["Total Exercises", program.exercises.length],
            ["Team",            player.team],
          ].map(([lbl,val])=>(
            <div key={lbl} style={{ padding:"12px 14px", border:"1px solid #e8e8e8", borderRadius:"8px", backgroundColor:"#fff" }}>
              <div style={{ fontSize:"10px", color:"#aaa", textTransform:"uppercase", letterSpacing:"0.5px", display:"block", marginBottom:"3px" }}>{lbl}</div>
              <div style={{ fontSize:"13px", fontWeight:"700", color:"#222" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Exercise table with GIFs */}
        <div style={{ borderRadius:"10px", border:"1px solid #e8e8e8", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <thead>
              <tr style={{ backgroundColor:"#fafafa" }}>
                {["#","GIF","Exercise","Category","Sets","Reps","Rest","Notes"].map(h=>(
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:"700", borderBottom:"2px solid #e8e8e8", fontSize:"11px", color:"#888", textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {program.exercises.map((ex,i)=>(
                <tr key={ex._id || ex.id} style={{ backgroundColor:i%2===0?"#fff":"#fafafa" }}>
                  <td style={{ padding:"10px 12px", color:"#aaa", fontSize:"11px" }}>{i+1}</td>
                  <td style={{ padding:"10px 12px" }}>
                    {ex.gifUrl ? (
                      <img src={ex.gifUrl} alt={ex.name} style={{ width:"40px", height:"40px", borderRadius:"6px", objectFit:"cover" }}/>
                    ) : (
                      <div style={{ width:"40px", height:"40px", backgroundColor:"#f0f0f0", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:"#ccc" }}>—</div>
                    )}
                  </td>
                  <td style={{ padding:"10px 12px", fontWeight:"700", color:"#222" }}>{ex.name}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <Badge label={ex.category} bg="#e8f3fb" color="#2f9be0" border="#cfe6f7"/>
                  </td>
                  <td style={{ padding:"10px 12px", fontWeight:"800", color:"#2f9be0" }}>{ex.sets}</td>
                  <td style={{ padding:"10px 12px", fontWeight:"700", color:"#222" }}>{ex.reps}</td>
                  <td style={{ padding:"10px 12px", color:"#666" }}>{ex.rest}s</td>
                  <td style={{ padding:"10px 12px", color:"#aaa", fontSize:"12px" }}>{ex.notes||"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop:"18px", fontSize:"11px", color:"#aaa" }}>
          Generated by Palaestra Performance &amp; Rehab · {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function RehabProgram({ players: propPlayers }) {
  const players = propPlayers || DEMO_PLAYERS;

  const [expanded,     setExpanded]     = useState(null);
  const [creating,     setCreating]     = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);
  const [programs,     setPrograms]     = useState({});
  const [viewing,      setViewing]      = useState(null);
  const [exercises,    setExercises]    = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  // Fetch exercises on component mount
  useEffect(() => {
    const fetchExercisesData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await exitingExercises();
        console.log(res.data, "Fetched Data");
        setExercises(res.data.workouts || []);
      } catch (err) {
        setError("Failed to load exercises. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercisesData();
  }, []);

  const handleCreated = (program, assignment) => {
    setPrograms(prev=>({...prev,[activePlayer.id]:[...(prev[activePlayer.id]||[]),{program,assignment}]}));
    setCreating(false);
  };

  const openCreate = (player, e) => { e.stopPropagation(); setActivePlayer(player); setCreating(true); };

  // ── Report view ──
  if (viewing) return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f3f4f6" }}>
      <ProgramReport {...viewing} onBack={()=>setViewing(null)}/>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f3f4f6" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"28px" }}>

        {/* Page heading */}
        <PageBanner title="Rehab Program" sub="Assign & track rehab plans" />

        {/* Session card */}
        <div style={{ backgroundColor:"#fff", borderRadius:"10px", border:"1px solid #e8e8e8", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden" }}>

          {/* Card header */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"16px 20px", borderBottom:"1px solid #f0f0f0" }}>
            <Activity size={15} style={{ color:"#2f9be0" }}/>
            <span style={{ fontSize:"14px", fontWeight:"700", color:"#333" }}>Session Action — Weekly Goals &amp; Programs</span>
          </div>

          {/* Player rows */}
          {players.map((player,idx) => {
            const pp        = programs[player.id]||[];
            const isOpen    = expanded===player.id;
            const stColor   = STATUS_COLORS[player.status]||STATUS_COLORS.Available;
            const catColor  = CAT_COLORS[player.category]||CAT_COLORS.Senior;
            const isLast    = idx===players.length-1;

            return (
              <div key={player.id} style={{ borderBottom:isLast?"none":"1px solid #f0f0f0" }}>
                {/* Player row header */}
                <div onClick={()=>setExpanded(isOpen?null:player.id)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", cursor:"pointer", backgroundColor:isOpen?"#e8f3fb":"#fff", transition:"background 0.15s", borderLeft:isOpen?"3px solid #2f9be0":"3px solid transparent" }}
                  onMouseEnter={e=>{ if(!isOpen) e.currentTarget.style.backgroundColor="#fdf8f4"; }}
                  onMouseLeave={e=>{ if(!isOpen) e.currentTarget.style.backgroundColor="#fff"; }}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                    {/* Avatar */}
                    <div style={{ width:"40px", height:"40px", borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"800", backgroundColor:isOpen?"#2f9be0":(player.status==="Injured"?"#fff0f0":"#e8f3fb"), color:isOpen?"#fff":(player.status==="Injured"?"#cc3333":"#2f9be0"), border:`1.5px solid ${isOpen?"#2f9be0":(player.status==="Injured"?"#ffc5c5":"#cfe6f7")}` }}>
                      {initials(player.name)}
                    </div>
                    <div>
                      <div style={{ fontSize:"14px", fontWeight:"700", color:"#222" }}>{player.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"4px", flexWrap:"wrap" }}>
                        <Badge label={player.category} bg={catColor.bg} color={catColor.color} border={catColor.border}/>
                        <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                          <div style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:stColor.dot }}/>
                          <span style={{ fontSize:"10px", fontWeight:"700", color:stColor.color }}>{player.status}</span>
                        </div>
                        {player.injury&&player.injury!=="—"&&(
                          <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"10px", fontWeight:"600", color:"#cc3333" }}>
                            <AlertTriangle size={9}/>{player.injury}
                          </span>
                        )}
                        <span style={{ fontSize:"10px", color:"#aaa" }}>{player.team}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
                    {pp.length>0&&<Badge label={`${pp.length} program${pp.length>1?"s":""}`} bg="#f0faf0" color="#2e7d32" border="#b8e6b8"/>}
                    {isOpen?<ChevronUp size={16} style={{ color:"#2f9be0" }}/>:<ChevronRight size={16} style={{ color:"#aaa" }}/>}
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ backgroundColor:"#fffbf7", borderTop:"1px solid #ffe0b2", padding:"0 20px 18px 20px" }}>
                    <div style={{ paddingLeft:"54px", paddingTop:"14px" }}>
                      {pp.length===0 && (
                        <p style={{ fontSize:"12px", color:"#aaa", marginBottom:"12px" }}>No programs assigned yet.</p>
                      )}

                      {/* Program cards */}
                      {pp.length>0 && (
                        <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"14px" }}>
                          {pp.map((item,i)=>(
                            <div key={i} style={{ ...card({ padding:"14px 18px" }), display:"flex", alignItems:"center", justifyContent:"space-between", gap:"14px" }}>
                              <div>
                                <div style={{ fontSize:"14px", fontWeight:"700", color:"#222" }}>{item.program.name}</div>
                                <div style={{ fontSize:"11px", color:"#aaa", marginTop:"4px" }}>
                                  {item.program.exercises.length} exercise{item.program.exercises.length!==1?"s":""} · Start {item.assignment.startDate} · {item.assignment.freq==="specific"?item.assignment.days.join(", "):item.assignment.freq}
                                </div>
                              </div>
                              <button onClick={()=>setViewing({player,program:item.program,assignment:item.assignment})}
                                style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", fontWeight:"700", color:"#2e7d32", backgroundColor:"#f0faf0", border:"1px solid #b8e6b8", padding:"7px 14px", borderRadius:"7px", cursor:"pointer", flexShrink:0, transition:"background 0.15s" }}
                                onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#e8f5e9")}
                                onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#f0faf0")}
                              >
                                <CheckCircle2 size={12}/> View Report
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Create button */}
                      <button onClick={e=>openCreate(player,e)}
                        style={{ display:"inline-flex", alignItems:"center", gap:"6px", backgroundColor:"#2f9be0", color:"#fff", fontSize:"13px", fontWeight:"700", padding:"9px 18px", borderRadius:"8px", border:"none", cursor:"pointer", boxShadow:"0 2px 8px rgba(47, 155, 224,0.25)" }}
                        onMouseEnter={e=>(e.currentTarget.style.backgroundColor="#2380c2")}
                        onMouseLeave={e=>(e.currentTarget.style.backgroundColor="#2f9be0")}
                      >
                        <Plus size={13}/> Create Program
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {creating&&activePlayer&&(
        <CreateProgramModal player={activePlayer} onClose={()=>setCreating(false)} onCreated={handleCreated} exercises={exercises} loading={loading} error={error}/>
      )}
    </div>
  );
}
