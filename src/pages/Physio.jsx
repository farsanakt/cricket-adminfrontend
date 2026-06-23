import { useState } from "react";
import { PageBanner } from "../theme";
import PhysioSessionForm from "./PhysioSessionForm";
import PlayerMedicalRecord from "./PlayerMedicalRecord";
import {
  User, AlertTriangle, ArrowLeft, ChevronRight,
  Calendar, Clock, Activity, Moon, Zap, Heart,
  CheckCircle2, FileText, Plus, Target,
  Dumbbell, ClipboardCheck, Shield, Check, X,
} from "lucide-react";

const ALL_EXERCISES_LOOKUP = [
  { id: 1,  name: "Jumping Jacks" },     { id: 2,  name: "High Knees" },
  { id: 3,  name: "Goblet Squats" },     { id: 4,  name: "Dumbbell Lunges" },
  { id: 5,  name: "Push-ups" },          { id: 6,  name: "Plank" },
  { id: 7,  name: "Shoulder Taps" },     { id: 8,  name: "Glute Bridges" },
  { id: 9,  name: "Goblet Squat" },      { id: 10, name: "Med Ball Throws" },
  { id: 11, name: "Hip Flexor Stretch" },{ id: 12, name: "Thoracic Rotation" },
  { id: 13, name: "Lunges" },            { id: 14, name: "Push-ups Wide" },
  { id: 15, name: "Dead Hangs" },        { id: 16, name: "Foam Roll IT Band" },
];


const URINE_COLOURS = [
  { label: "Pale Straw",         hex: "#f5e97a" },
  { label: "Translucent Yellow", hex: "#f0c93a" },
  { label: "Dark Yellow",        hex: "#d4a017" },
  { label: "Amber",              hex: "#c47d0e" },
  { label: "Brown",              hex: "#8b5e15" },
];

const MOCK_PLAYERS = [
  {
    id: 1, name: "Arjun Menon", role: "Batsman", number: "01",
    reports: [
      { id: "r1", date: "2025-05-01", time: "08:30 AM", urineColour: "Pale Straw",
        soreness: 3, fatigue: 4, sleep: 7, injury: false, injuryFile: null,
        motivation: 8, ballsBowled: 0, rpe: 5, training: ["Batting","Fielding"], achesPain: false },
      { id: "r2", date: "2025-04-30", time: "09:10 AM", urineColour: "Dark Yellow",
        soreness: 6, fatigue: 7, sleep: 5, injury: false, injuryFile: null,
        motivation: 5, ballsBowled: 0, rpe: 7, training: ["Conditioning","Match"], achesPain: true },
    ],
  },
  {
    id: 2, name: "Rahul Das", role: "Bowler", number: "02",
    reports: [
      { id: "r3", date: "2025-05-01", time: "07:45 AM", urineColour: "Amber",
        soreness: 8, fatigue: 7, sleep: 4, injury: true, injuryFile: "shoulder_mri.pdf",
        motivation: 4, ballsBowled: 120, rpe: 9, training: ["Bowling"], achesPain: true },
    ],
  },
  {
    id: 3, name: "Vivek Pillai", role: "All-rounder", number: "03",
    reports: [
      { id: "r4", date: "2025-05-01", time: "08:00 AM", urineColour: "Translucent Yellow",
        soreness: 2, fatigue: 2, sleep: 8, injury: false, injuryFile: null,
        motivation: 9, ballsBowled: 45, rpe: 4, training: ["Strength","Bowling","Batting"], achesPain: false },
    ],
  },
  { id: 4, name: "Nikhil Krishnan", role: "Wicket-keeper", number: "04", reports: [] },
];

// ── Pending trainer workout plans ─────────────────────────────────────────────
const INITIAL_PENDING_PLANS = [
  {
    id: "plan1", trainerId: "t1", trainerName: "Rahul (Trainer)",
    playerId: 2, playerName: "Rahul Das", playerRole: "Bowler",
    planName: "Shoulder Rehab Phase 1", createdAt: "2025-05-01",
    exercises: [
      { name: "Resistance Band Pull-Apart", reps: "15 reps", sets: 3 },
      { name: "Pendulum Swings",            reps: "30 seconds", sets: 3 },
      { name: "Wall Slides",               reps: "12 reps", sets: 3 },
    ],
    notes: "Light shoulder mobility work only. No throwing.",
    status: "Pending", physioNote: "",
  },
  {
    id: "plan2", trainerId: "t1", trainerName: "Rahul (Trainer)",
    playerId: 1, playerName: "Arjun Menon", playerRole: "Batsman",
    planName: "Pre-Season Conditioning Week 1", createdAt: "2025-04-30",
    exercises: [
      { name: "Goblet Squats",        reps: "12 reps", sets: 3 },
      { name: "Dead Bug",             reps: "10 reps", sets: 3 },
      { name: "Single Leg Balance",   reps: "30 seconds", sets: 3 },
    ],
    notes: "Focus on stability and core activation.",
    status: "Pending", physioNote: "",
  },
];

// ── Injury clearance requests ─────────────────────────────────────────────────
const INITIAL_CLEARANCE_REQUESTS = [
  {
    id: "cr1", playerId: 2, playerName: "Rahul Das", playerRole: "Bowler",
    injuryType: "Shoulder Strain", bodyPart: "Right Shoulder",
    requestDate: "2025-05-02",
    playerNote: "Shoulder feels much better. No pain during light throwing. Ready to resume.",
    status: "Pending", appointment: null, physioNote: "",
  },
];

// ─── View constants ───────────────────────────────────────────────────────────
const V_PLAYERS          = "players";
const V_REPORTS          = "reports";
const V_DETAIL           = "detail";
const V_SESSION          = "session";
const V_PENDING_PLANS    = "pending_plans";
const V_PLAN_DETAIL      = "plan_detail";
const V_CLEARANCE        = "clearance";
const V_CLEARANCE_DETAIL = "clearance_detail";
const V_MEDICAL_RECORD   = "medical_record";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const card = (extra = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...extra,
});

const Badge = ({ label, bg, color, border }) => (
  <span style={{
    fontSize: "11px", fontWeight: "700", padding: "2px 9px",
    borderRadius: "20px", backgroundColor: bg, color,
    border: `1px solid ${border}`,
  }}>
    {label}
  </span>
);

const ScorePill = ({ value, max = 10 }) => {
  const pct   = value / max;
  const color = pct >= 0.7 ? "#cc3333" : pct >= 0.4 ? "#2f9be0" : "#2e7d32";
  return (
    <span style={{ fontSize: "13px", fontWeight: "700", color }}>
      {value}<span style={{ fontSize: "11px", color: "#aaa", fontWeight: "500" }}>/{max}</span>
    </span>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div style={{
    display: "flex", alignItems: "center",
    padding: "11px 0", borderBottom: "1px solid #f5f5f5", gap: "10px",
  }}>
    <Icon size={15} style={{ color: "#2f9be0", flexShrink: 0 }} />
    <span style={{ fontSize: "13px", color: "#888", width: "160px", flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: "13px", color: "#222", fontWeight: "600" }}>{value}</span>
  </div>
);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "20px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", marginBottom: "2px", fontFamily: "'Barlow Condensed', sans-serif" }}>{title}</h1>
    {sub && <p style={{ fontSize: "13px", color: "#888" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "4px" }} />
  </div>
);

const BackBtn = ({ label, onClick }) => (
  <button onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "6px",
      background: "none", border: "none", color: "#888",
      fontSize: "13px", fontWeight: "600", cursor: "pointer",
      marginBottom: "18px", padding: "0",
    }}
    onMouseEnter={e => (e.currentTarget.style.color = "#2f9be0")}
    onMouseLeave={e => (e.currentTarget.style.color = "#888")}
  >
    <ArrowLeft size={16} style={{ color: "inherit" }} /> {label}
  </button>
);

const OBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: "7px",
      padding: "9px 20px", backgroundColor: "#2f9be0",
      color: "#fff", border: "none", borderRadius: "8px",
      fontSize: "13px", fontWeight: "700", cursor: "pointer",
      boxShadow: "0 2px 8px rgba(47, 155, 224,0.28)", ...style,
    }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2380c2")}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = style.backgroundColor || "#2f9be0")}
  >
    {children}
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Physio = () => {
  const [players]             = useState(MOCK_PLAYERS);
  const [view,                  setView]                = useState(V_PLAYERS);
  const [activePlayer,          setActivePlayer]        = useState(null);
  const [activeReport,          setActiveReport]        = useState(null);
  const [savedSessions,         setSavedSessions]       = useState({});
  const [pendingPlans,          setPendingPlans]        = useState(INITIAL_PENDING_PLANS);
  const [clearanceRequests,     setClearanceRequests]   = useState(INITIAL_CLEARANCE_REQUESTS);
  const [activePlan,            setActivePlan]          = useState(null);
  const [activeClearance,       setActiveClearance]     = useState(null);
  const [physioNote,            setPhysioNote]          = useState("");
  const [apptDate,              setApptDate]            = useState("");
  const [apptTime,              setApptTime]            = useState("");
  const [toast,                 setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const hasInjury  = (p) => p.reports.some((r) => r.injury);
  const latestDate = (p) => p.reports.length ? p.reports[0].date : null;

  const pendingPlanCount      = pendingPlans.filter(p => p.status === "Pending").length;
  const pendingClearanceCount = clearanceRequests.filter(c => c.status === "Pending").length;

  const openPlayer = (player) => { setActivePlayer(player); setActiveReport(null); setView(V_REPORTS); };
  const openReport = (report) => { setActiveReport(report); setView(V_DETAIL); };

  const goBack = () => {
    if (view === V_SESSION)          { setView(V_DETAIL);   return; }
    if (view === V_MEDICAL_RECORD)   { setView(V_DETAIL);   return; }
    if (view === V_DETAIL)           { setView(V_REPORTS);  setActiveReport(null); return; }
    if (view === V_REPORTS)          { setView(V_PLAYERS);  setActivePlayer(null); return; }
    if (view === V_PLAN_DETAIL)      { setView(V_PENDING_PLANS); return; }
    if (view === V_CLEARANCE_DETAIL) { setView(V_CLEARANCE); return; }
  };

  const handleSaveSession = (data) => {
    setSavedSessions((p) => ({
      ...p,
      [activeReport.id]: { ...data, savedAt: new Date().toLocaleDateString("en-IN") },
    }));
    alert("✅ Session saved for " + activePlayer.name);
    setView(V_DETAIL);
  };



  const approvePlan = (planId, approved) => {
    setPendingPlans(prev => prev.map(p =>
      p.id === planId ? { ...p, status: approved ? "Approved" : "Rejected", physioNote } : p
    ));
    showToast(approved ? "✅ Plan approved & trainer notified." : "Plan rejected. Trainer notified.");
    setPhysioNote("");
    setView(V_PENDING_PLANS);
  };

  const createClearanceAppointment = (crId) => {
    if (!apptDate || !apptTime) { alert("Please set a date and time."); return; }
    setClearanceRequests(prev => prev.map(cr =>
      cr.id === crId ? { ...cr, status: "AppointmentCreated", appointment: { date: apptDate, time: apptTime } } : cr
    ));
    showToast("📅 Appointment created. Player, management & physio notified by email.");
    setApptDate(""); setApptTime("");
    setView(V_CLEARANCE);
  };

  const markReadyForPlaying = (crId) => {
    setClearanceRequests(prev => prev.map(cr =>
      cr.id === crId ? { ...cr, status: "ReadyForPlaying", physioNote } : cr
    ));
    showToast("✅ Player marked ready. Sent to Secretary for final approval.");
    setPhysioNote("");
    setView(V_CLEARANCE);
  };

  // ── SESSION FORM ──────────────────────────────────────────────────────────
  if (view === V_SESSION && activePlayer && activeReport) return (
    <PhysioSessionForm
      player={activePlayer}
      report={activeReport}
      onBack={goBack}
      onSave={handleSaveSession}
    />
  );

  // ── MEDICAL RECORD ─────────────────────────────────────────────────────────
  if (view === V_MEDICAL_RECORD && activePlayer && activeReport) return (
    <PlayerMedicalRecord
      player={activePlayer}
      report={activeReport}
      onBack={goBack}
    />
  );

console.log('hiii i am here i wha tabput is are theere i sma here ')

  // ── PENDING PLANS ─────────────────────────────────────────────────────────
  if (view === V_PENDING_PLANS) return (
    <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
      <BackBtn label="Physio Dashboard" onClick={() => setView(V_PLAYERS)} />
      <Heading title="Pending Plan Approvals" sub="Review and approve trainer workout plans for players" />

      {pendingPlans.length === 0 ? (
        <div style={card({ padding: "48px", textAlign: "center" })}>
          <CheckCircle2 size={36} style={{ color: "#b8e6b8", margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#555" }}>No pending plan approvals</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pendingPlans.map(plan => (
            <div key={plan.id}
              onClick={() => { setActivePlan(plan); setView(V_PLAN_DETAIL); }}
              style={card({
                padding: "18px 20px", cursor: "pointer", transition: "all 0.15s",
                borderLeft: plan.status === "Approved" ? "4px solid #2e7d32"
                  : plan.status === "Rejected" ? "4px solid #cc3333" : "4px solid #f9a825",
              })}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#222", marginBottom: "3px" }}>{plan.planName}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>For {plan.playerName} ({plan.playerRole}) · By {plan.trainerName} · {plan.createdAt}</div>
                  <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>{plan.exercises.length} exercises</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
                  <Badge
                    label={plan.status}
                    bg={plan.status === "Approved" ? "#f0faf0" : plan.status === "Rejected" ? "#fff0f0" : "#fff8e1"}
                    color={plan.status === "Approved" ? "#2e7d32" : plan.status === "Rejected" ? "#cc3333" : "#f9a825"}
                    border={plan.status === "Approved" ? "#b8e6b8" : plan.status === "Rejected" ? "#ffc5c5" : "#ffe082"}
                  />
                  <ChevronRight size={15} style={{ color: "#ccc" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── PLAN DETAIL ───────────────────────────────────────────────────────────
  if (view === V_PLAN_DETAIL && activePlan) {
    const plan = pendingPlans.find(p => p.id === activePlan.id) || activePlan;
    return (
      <div style={{ padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
        <BackBtn label="Pending Approvals" onClick={() => setView(V_PENDING_PLANS)} />
        <Heading title={plan.planName} sub={`By ${plan.trainerName} · For ${plan.playerName} · ${plan.createdAt}`} />

        <div style={card({ padding: "22px", marginBottom: "16px" })}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "14px", display: "flex", alignItems: "center", gap: "7px" }}>
            <Dumbbell size={14} style={{ color: "#2f9be0" }} /> Exercises ({plan.exercises.length})
          </div>
          {plan.exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderBottom: i < plan.exercises.length - 1 ? "1px solid #f5f5f5" : "none" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#e8f3fb", border: "1.5px solid #cfe6f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "#2f9be0", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>{ex.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{ex.reps} · {ex.sets} sets</div>
              </div>
            </div>
          ))}
          {plan.notes && (
            <div style={{ marginTop: "14px", padding: "12px 14px", backgroundColor: "#f9f9f9", borderRadius: "8px", fontSize: "13px", color: "#555", border: "1px solid #f0f0f0" }}>
              <b style={{ color: "#333" }}>Trainer Notes:</b> {plan.notes}
            </div>
          )}
        </div>

        {plan.status === "Pending" && (
          <div style={card({ padding: "22px", marginBottom: "16px" })}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "12px" }}>Physio Review Note</div>
            <textarea
              value={physioNote} onChange={e => setPhysioNote(e.target.value)}
              placeholder="Add your review notes (optional)..." rows={3}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", color: "#333", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", backgroundColor: "#f9f9f9", marginBottom: "14px" }}
              onFocus={e => (e.target.style.borderColor = "#2f9be0")}
              onBlur={e => (e.target.style.borderColor = "#e0e0e0")}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <OBtn onClick={() => approvePlan(plan.id, true)} style={{ flex: 1, justifyContent: "center" }}>
                <Check size={15} /> Approve Plan
              </OBtn>
              <button
                onClick={() => approvePlan(plan.id, false)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px 20px", backgroundColor: "#fff0f0", color: "#cc3333", border: "1.5px solid #ffc5c5", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ffe0e0")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff0f0")}
              >
                <X size={15} /> Reject Plan
              </button>
            </div>
          </div>
        )}

        {plan.status !== "Pending" && (
          <div style={{ ...card({ padding: "16px 20px" }), backgroundColor: plan.status === "Approved" ? "#f0faf0" : "#fff0f0", border: `1px solid ${plan.status === "Approved" ? "#b8e6b8" : "#ffc5c5"}` }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: plan.status === "Approved" ? "#2e7d32" : "#cc3333" }}>
              {plan.status === "Approved" ? "✅ Plan Approved" : "❌ Plan Rejected"}
            </div>
            {plan.physioNote && <div style={{ fontSize: "13px", color: "#666", marginTop: "6px" }}>{plan.physioNote}</div>}
          </div>
        )}
      </div>
    );
  }

  // ── CLEARANCE REQUESTS ────────────────────────────────────────────────────
  if (view === V_CLEARANCE) return (
    <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
      <BackBtn label="Physio Dashboard" onClick={() => setView(V_PLAYERS)} />
      <Heading title="Injury Clearance Requests" sub="Players requesting clearance to return to play" />

      {clearanceRequests.length === 0 ? (
        <div style={card({ padding: "48px", textAlign: "center" })}>
          <Shield size={36} style={{ color: "#b8e6b8", margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#555" }}>No clearance requests</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {clearanceRequests.map(cr => (
            <div key={cr.id}
              onClick={() => { setActiveClearance(cr); setView(V_CLEARANCE_DETAIL); }}
              style={card({
                padding: "18px 20px", cursor: "pointer", transition: "all 0.15s",
                borderLeft: cr.status === "ReadyForPlaying" ? "4px solid #2e7d32"
                  : cr.status === "AppointmentCreated" ? "4px solid #3b82f6" : "4px solid #f9a825",
              })}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <AlertTriangle size={14} style={{ color: "#cc3333" }} />
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>{cr.playerName}</span>
                    <span style={{ fontSize: "12px", color: "#888" }}>— {cr.playerRole}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{cr.injuryType} · {cr.bodyPart} · Requested {cr.requestDate}</div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "5px", fontStyle: "italic" }}>"{cr.playerNote.substring(0, 80)}..."</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
                  <Badge
                    label={cr.status === "AppointmentCreated" ? "Appt. Set" : cr.status === "ReadyForPlaying" ? "Ready →Secretary" : "Pending Review"}
                    bg={cr.status === "ReadyForPlaying" ? "#f0faf0" : cr.status === "AppointmentCreated" ? "#eff6ff" : "#fff8e1"}
                    color={cr.status === "ReadyForPlaying" ? "#2e7d32" : cr.status === "AppointmentCreated" ? "#3b82f6" : "#f9a825"}
                    border={cr.status === "ReadyForPlaying" ? "#b8e6b8" : cr.status === "AppointmentCreated" ? "#bfdbfe" : "#ffe082"}
                  />
                  <ChevronRight size={15} style={{ color: "#ccc" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── CLEARANCE DETAIL ──────────────────────────────────────────────────────
  if (view === V_CLEARANCE_DETAIL && activeClearance) {
    const cr = clearanceRequests.find(c => c.id === activeClearance.id) || activeClearance;
    return (
      <div style={{ padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
        <BackBtn label="Clearance Requests" onClick={() => setView(V_CLEARANCE)} />
        <Heading title={`Clearance: ${cr.playerName}`} sub={`${cr.injuryType} · ${cr.bodyPart}`} />

        {/* Player note */}
        <div style={card({ padding: "20px", marginBottom: "16px" })}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>Player&apos;s Statement</div>
          <div style={{ fontSize: "14px", color: "#444", lineHeight: "1.6", padding: "12px 16px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #f0f0f0", fontStyle: "italic" }}>
            "{cr.playerNote}"
          </div>
          <div style={{ fontSize: "12px", color: "#aaa", marginTop: "6px" }}>Submitted {cr.requestDate}</div>
        </div>

        {/* Create appointment */}
        {cr.status === "Pending" && (
          <div style={card({ padding: "22px", marginBottom: "16px" })}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "14px", display: "flex", alignItems: "center", gap: "7px" }}>
              <Calendar size={15} style={{ color: "#2f9be0" }} /> Create Appointment for Clearance
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "4px" }}>APPOINTMENT DATE</label>
                <input type="date" value={apptDate} onChange={e => setApptDate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#2f9be0")}
                  onBlur={e => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "4px" }}>TIME</label>
                <input type="time" value={apptTime} onChange={e => setApptTime(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#2f9be0")}
                  onBlur={e => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
            </div>
            <OBtn onClick={() => createClearanceAppointment(cr.id)} style={{ width: "100%", justifyContent: "center" }}>
              <Calendar size={15} /> Create Appointment for Clearance
            </OBtn>
            <div style={{ fontSize: "11px", color: "#aaa", marginTop: "8px", textAlign: "center" }}>📧 Player, management & physio will be notified by email.</div>
          </div>
        )}

        {/* After appointment */}
        {cr.status === "AppointmentCreated" && (
          <>
            <div style={{ ...card({ padding: "16px 20px", marginBottom: "16px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }) }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={16} style={{ color: "#3b82f6" }} />
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#1d4ed8" }}>Appointment Scheduled</span>
              </div>
              <div style={{ fontSize: "13px", color: "#3b82f6", marginTop: "4px" }}>{cr.appointment?.date} at {cr.appointment?.time}</div>
              <div style={{ fontSize: "11px", color: "#60a5fa", marginTop: "2px" }}>📧 Notifications sent to player, management & physio.</div>
            </div>

            <div style={card({ padding: "22px" })}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "12px" }}>After Assessment — Mark Player Ready</div>
              <textarea
                value={physioNote} onChange={e => setPhysioNote(e.target.value)}
                placeholder="Clinical notes for clearance decision..." rows={3}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", color: "#333", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", backgroundColor: "#f9f9f9", marginBottom: "12px" }}
                onFocus={e => (e.target.style.borderColor = "#2f9be0")}
                onBlur={e => (e.target.style.borderColor = "#e0e0e0")}
              />
              <OBtn onClick={() => markReadyForPlaying(cr.id)} style={{ width: "100%", justifyContent: "center", backgroundColor: "#2e7d32" }}>
                <CheckCircle2 size={15} /> Player Ready for Playing — Send to Secretary
              </OBtn>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "8px", textAlign: "center" }}>This will be forwarded to the Secretary for final approval.</div>
            </div>
          </>
        )}

        {cr.status === "ReadyForPlaying" && (
          <div style={{ ...card({ padding: "18px 20px", backgroundColor: "#f0faf0", border: "1px solid #b8e6b8", borderLeft: "4px solid #2e7d32" }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={18} style={{ color: "#2e7d32" }} />
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#2e7d32" }}>Sent to Secretary for Final Approval</span>
            </div>
            <div style={{ fontSize: "12px", color: "#4caf50", marginTop: "4px" }}>Awaiting Secretary sign-off. All parties will be notified.</div>
            {cr.physioNote && <div style={{ fontSize: "13px", color: "#555", marginTop: "8px", fontStyle: "italic" }}>"{cr.physioNote}"</div>}
          </div>
        )}
      </div>
    );
  }

  // ── PLAYER LIST ───────────────────────────────────────────────────────────
  if (view === V_PLAYERS) return (
    <div style={{ padding: "28px", maxWidth: "1000px", margin: "0 auto" }}>
      <PageBanner title="Physio Dashboard" sub="Player reports, plans & clearances" />

      {/* Alert cards — pending plan approvals & clearance requests */}
      {(pendingPlanCount > 0 || pendingClearanceCount > 0) && (
        <div style={{ display: "flex", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
          {pendingPlanCount > 0 && (
            <div
              onClick={() => setView(V_PENDING_PLANS)}
              style={{ ...card({ padding: "14px 18px", cursor: "pointer", borderLeft: "4px solid #f9a825", flex: 1, minWidth: "220px", transition: "all 0.15s" }) }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", backgroundColor: "#fff8e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ClipboardCheck size={17} style={{ color: "#f9a825" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#f9a825" }}>{pendingPlanCount}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Pending Plan Approvals</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: "#ccc" }} />
              </div>
            </div>
          )}

          {pendingClearanceCount > 0 && (
            <div
              onClick={() => setView(V_CLEARANCE)}
              style={{ ...card({ padding: "14px 18px", cursor: "pointer", borderLeft: "4px solid #cc3333", flex: 1, minWidth: "220px", transition: "all 0.15s" }) }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", backgroundColor: "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Shield size={17} style={{ color: "#cc3333" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#cc3333" }}>{pendingClearanceCount}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Injury Clearance Requests</div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: "#ccc" }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary stats */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "22px", flexWrap: "wrap" }}>
        {[
          { label: "Total Players",   value: players.length,                                                               color: "#2f9be0" },
          { label: "Reports Today",   value: players.filter((p) => p.reports.some((r) => r.date === "2025-05-01")).length, color: "#2e7d32" },
          { label: "Injured Players", value: players.filter(hasInjury).length,                                             color: "#cc3333" },
          { label: "No Report Today", value: players.filter((p) => !p.reports.some((r) => r.date === "2025-05-01")).length,color: "#888"    },
        ].map((s) => (
          <div key={s.label} style={{ ...card({ padding: "14px 20px", minWidth: "150px", borderLeft: `4px solid ${s.color}` }) }}>
            <span style={{ fontSize: "22px", fontWeight: "800", color: s.color, display: "block" }}>{s.value}</span>
            <span style={{ fontSize: "12px", color: "#888", fontWeight: "500" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Player list */}
      <div style={card({ overflow: "hidden" })}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "8px" }}>
          <User size={15} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#333" }}>Players</span>
        </div>

        {players.map((player, i) => {
          const injured = hasInjury(player);
          return (
            <div key={player.id} onClick={() => openPlayer(player)}
              style={{
                display: "flex", alignItems: "center", padding: "15px 22px",
                borderBottom: i < players.length - 1 ? "1px solid #f5f5f5" : "none",
                gap: "14px", cursor: "pointer", transition: "background 0.12s",
                borderLeft: injured ? "3px solid #cc3333" : "3px solid transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = injured ? "#fff8f8" : "#fdf8f4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                backgroundColor: injured ? "#fff0f0" : "#e8f3fb",
                border: `1.5px solid ${injured ? "#ffc5c5" : "#cfe6f7"}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <User size={18} style={{ color: injured ? "#cc3333" : "#2f9be0" }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>{player.name}</span>
                  {injured && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      fontSize: "10px", fontWeight: "700", color: "#cc3333",
                      backgroundColor: "#fff0f0", border: "1px solid #ffc5c5",
                      borderRadius: "20px", padding: "2px 8px",
                    }}>
                      <AlertTriangle size={10} /> Injured
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "1px" }}>{player.role}</div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {player.reports.length > 0 ? (
                  <>
                    <div style={{ fontSize: "12px", color: "#888" }}>{formatDate(latestDate(player))}</div>
                    <div style={{ fontSize: "11px", color: "#2f9be0", fontWeight: "600", marginTop: "2px" }}>
                      {player.reports.length} report{player.reports.length > 1 ? "s" : ""}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: "11px", color: "#bbb" }}>No reports yet</div>
                )}
              </div>

              <ChevronRight size={16} style={{ color: "#ccc", flexShrink: 0 }} />
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "28px", right: "28px", backgroundColor: "#2e7d32", color: "#fff", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(0,0,0,0.2)", zIndex: 999 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );

  // ── REPORT INBOX ─────────────────────────────────────────────────────────
  if (view === V_REPORTS) return (
    <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
      <BackBtn label="All Players" onClick={() => { setView(V_PLAYERS); setActivePlayer(null); }} />

      <div style={{ ...card({ padding: "18px 22px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }) }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          backgroundColor: hasInjury(activePlayer) ? "#fff0f0" : "#e8f3fb",
          border: `2px solid ${hasInjury(activePlayer) ? "#ffc5c5" : "#cfe6f7"}`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <User size={20} style={{ color: hasInjury(activePlayer) ? "#cc3333" : "#2f9be0" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "17px", fontWeight: "700", color: "#222" }}>{activePlayer.name}</span>
            {hasInjury(activePlayer) && <Badge label="Injured" bg="#fff0f0" color="#cc3333" border="#ffc5c5" />}
          </div>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
            {activePlayer.role} · {activePlayer.reports.length} daily report{activePlayer.reports.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {activePlayer.reports.length === 0 ? (
        <div style={{ ...card({ padding: "48px", textAlign: "center" }) }}>
          <FileText size={36} style={{ color: "#ddd", margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#555" }}>No reports submitted yet</p>
          <p style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Reports will appear here once the player submits them</p>
        </div>
      ) : (
        <div style={card({ overflow: "hidden" })}>
          <div style={{ padding: "12px 22px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={14} style={{ color: "#2f9be0" }} />
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>Daily Reports — Latest First</span>
          </div>

          {[...activePlayer.reports]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((report, i, arr) => {
              const high  = report.soreness >= 7 || report.fatigue >= 7;
              const rowBg = report.injury ? "#fff8f8" : "transparent";
              return (
                <div key={report.id} onClick={() => openReport(report)}
                  style={{
                    display: "flex", alignItems: "center", padding: "15px 22px",
                    borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : "none",
                    gap: "14px", cursor: "pointer",
                    borderLeft: report.injury ? "3px solid #cc3333" : "3px solid transparent",
                    backgroundColor: rowBg, transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = report.injury ? "#ffeded" : "#fdf8f4")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = rowBg)}
                >
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    backgroundColor: report.injury ? "#fff0f0" : (i === 0 ? "#e8f3fb" : "#f5f5f5"),
                    border: `1.5px solid ${report.injury ? "#ffc5c5" : (i === 0 ? "#cfe6f7" : "#e8e8e8")}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: report.injury ? "#cc3333" : (i === 0 ? "#2f9be0" : "#555") }}>
                      {new Date(report.date).getDate()}
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "600", textTransform: "uppercase", color: report.injury ? "#cc3333" : (i === 0 ? "#2f9be0" : "#aaa") }}>
                      {new Date(report.date).toLocaleString("en-IN", { month: "short" })}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: report.injury ? "#cc3333" : "#222" }}>
                        Daily Report — {formatDate(report.date)}
                      </span>
                      {i === 0 && !report.injury && <Badge label="Latest"    bg="#e8f3fb" color="#2f9be0" border="#cfe6f7" />}
                      {report.injury             && <Badge label="⚠ Injury"  bg="#fff0f0" color="#cc3333" border="#ffc5c5" />}
                      {high && !report.injury    && <Badge label="High Load" bg="#fff8e1" color="#f9a825" border="#ffe082" />}
                    </div>
                    <div style={{ display: "flex", gap: "16px", marginTop: "5px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "#888" }}>Soreness <b style={{ color: report.soreness >= 7 ? "#cc3333" : "#555" }}>{report.soreness}/10</b></span>
                      <span style={{ fontSize: "11px", color: "#888" }}>Fatigue  <b style={{ color: report.fatigue  >= 7 ? "#cc3333" : "#555" }}>{report.fatigue}/10</b></span>
                      <span style={{ fontSize: "11px", color: "#888" }}>Sleep    <b style={{ color: "#555" }}>{report.sleep}h</b></span>
                      <span style={{ fontSize: "11px", color: "#888" }}>RPE      <b style={{ color: "#555" }}>{report.rpe}/10</b></span>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#bbb" }}>{report.time}</span>
                    <ChevronRight size={15} style={{ color: report.injury ? "#ffc5c5" : "#ccc" }} />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );

  // ── REPORT DETAIL ─────────────────────────────────────────────────────────
  if (view === V_DETAIL) {
    const r       = activeReport;
    const session = savedSessions[r.id];
    const urineHex = URINE_COLOURS.find((c) => c.label === r.urineColour)?.hex || "#f5e97a";

    return (
      <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
        <BackBtn label={`${activePlayer.name}&apos;s Reports`} onClick={goBack} />

        {/* Report header */}
        <div style={{ ...card({ padding: "18px 22px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#e8f3fb", border: "1.5px solid #cfe6f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={18} style={{ color: "#2f9be0" }} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#222" }}>Daily Report</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{formatDate(r.date)} · {r.time} · {activePlayer.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {r.injury    && <Badge label="⚠ Injury Reported" bg="#fff0f0" color="#cc3333" border="#ffc5c5" />}
              {r.achesPain && !r.injury && <Badge label="Aches / Pain" bg="#fff8e1" color="#f9a825" border="#ffe082" />}
            </div>
            <button
              onClick={() => setView(V_MEDICAL_RECORD)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#2f9be0",
                color: "#fff",
                border: "none",
                fontSize: "18px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(47, 155, 224,0.28)",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2380c2")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2f9be0")}
              title="Add Medical Record"
            >
              +
            </button>
          </div>
        </div>

        {/* Metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {[
            { icon: Activity, label: "Soreness",     value: <ScorePill value={r.soreness} /> },
            { icon: Zap,      label: "Fatigue",      value: <ScorePill value={r.fatigue} /> },
            { icon: Moon,     label: "Sleep",        value: <span style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{r.sleep}h</span> },
            { icon: Heart,    label: "Motivation",   value: <ScorePill value={r.motivation} /> },
            { icon: Activity, label: "RPE",          value: <ScorePill value={r.rpe} /> },
            { icon: Target,   label: "Balls Bowled", value: <span style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{r.ballsBowled}</span> },
          ].map((m) => (
            <div key={m.label} style={card({ padding: "14px 16px" })}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <m.icon size={14} style={{ color: "#2f9be0" }} />
                <span style={{ fontSize: "11px", color: "#888", fontWeight: "500" }}>{m.label}</span>
              </div>
              {m.value}
            </div>
          ))}
        </div>

        {/* Detail rows */}
        <div style={{ ...card({ padding: "6px 22px 4px", marginBottom: "20px" }) }}>
          <DetailRow icon={Calendar}     label="Date"              value={formatDate(r.date)} />
          <DetailRow icon={Clock}        label="Submitted At"      value={r.time} />
          <DetailRow icon={Activity}     label="Urine Colour"
            value={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: urineHex, border: "1px solid #ddd" }} />
                {r.urineColour}
              </div>
            }
          />
          <DetailRow icon={CheckCircle2} label="Training Sessions"
            value={
              r.training.length > 0 ? (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {r.training.map((t) => (
                    <span key={t} style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7" }}>{t}</span>
                  ))}
                </div>
              ) : "None"
            }
          />
          {r.injuryFile && (
            <DetailRow icon={FileText} label="Injury Report"
              value={<span style={{ color: "#2f9be0", fontWeight: "600", textDecoration: "underline", cursor: "pointer" }}>{r.injuryFile}</span>}
            />
          )}
        </div>

        {/* Saved session summary */}
        {session && (
          <div style={{ ...card({ padding: "18px 22px", marginBottom: "20px", borderLeft: "4px solid #2e7d32" }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <CheckCircle2 size={17} style={{ color: "#2e7d32" }} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#2e7d32" }}>Session Saved — {session.savedAt}</span>
            </div>
            {session.sessionAction === "refer" && (
              <p style={{ fontSize: "13px", color: "#555" }}>Player referred to the medical/doctor team.</p>
            )}
            {session.sessionAction === "workout" && session.selectedExercises?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "6px" }}>
                {ALL_EXERCISES_LOOKUP
                  .filter((e) => session.selectedExercises.includes(e.id))
                  .map((e) => (
                    <span key={e.id} style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", backgroundColor: "#e8f3fb", color: "#b05a00", border: "1px solid #cfe6f7" }}>
                      {e.name}
                    </span>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Create Session CTA — only for injured reports */}
        {/* {r.injury && !session && (
          <div style={{ ...card({ padding: "20px 22px", borderLeft: "4px solid #cc3333" }) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertTriangle size={18} style={{ color: "#cc3333" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#cc3333" }}>Injury Detected</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "1px" }}>
                    Create a session to document treatment and assign a plan
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setView(V_SESSION);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  backgroundColor: "#2f9be0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(47, 155, 224,0.3)",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2380c2")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2f9be0")}
              >
                <Plus size={15} />
                Create Session
              </button>
            </div>
          </div>
        )} */}
      </div>
    );
  }

  return null;
};

export default Physio;
