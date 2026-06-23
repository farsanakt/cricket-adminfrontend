import { useState, useEffect } from "react";
import { getPlayer } from "../api/authApi";
import {
  Users, User, Stethoscope, Dumbbell, Apple, ShieldCheck,
  ArrowLeft, ClipboardList, ChevronRight, AlertTriangle,
  CheckCircle2, Send, Calendar, X,
} from "lucide-react";

import DailyReportForm from "../components/DailyReportForm";
import { PageBanner } from "../theme";

// ─── STYLES & HELPERS ─────────────────────────────────────────────────────
const card = (x = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...x,
});

const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "22px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>{title}</h1>
    {sub && <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "6px" }} />
  </div>
);

const BackBtn = ({ label, onClick }) => (
  <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#888", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: "18px", padding: "0" }}
    onMouseEnter={e => (e.currentTarget.style.color = "#2f9be0")}
    onMouseLeave={e => (e.currentTarget.style.color = "#888")}
  ><ArrowLeft size={15} /> {label}</button>
);

const OBtn = ({ children, onClick, style = {}, variant = "primary" }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 22px",
    backgroundColor: variant === "danger" ? "#cc3333" : "#2f9be0",
    color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", ...style
  }}>
    {children}
  </button>
);

// Views
const V = { INFO: "info", TEAM: "team", INJURIES: "injuries", INJ_DETAIL: "inj_detail", DAILY_PROGRESS: "daily_progress" };

export default function Players() {
  const [view, setView] = useState(V.INFO);
  const [player, setPlayer] = useState(null);
  const [injuries, setInjuries] = useState([]);
  const [activeInj, setActiveInj] = useState(null);
  const [reqNote, setReqNote] = useState("");
  const [toast, setToast] = useState(null);
  const playerId = localStorage.getItem("userId")


  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Real Player Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPlayer(playerId);
        console.log('Player Data Received:', res.data);
        setPlayer(res.data);

        if (res.data?.injuries?.length > 0) {
          setInjuries(res.data.injuries);
        }
      } catch (err) {
        console.error("Failed to fetch player data", err);
      }
    };

    fetchData();
  }, []);

  const requestClearance = (injId) => {
    if (!reqNote.trim()) {
      alert("Please describe your current condition.");
      return;
    }
    setInjuries(prev => prev.map(inj =>
      inj.id === injId
        ? { ...inj, status: "ClearanceRequested", clearanceRequest: { note: reqNote, date: new Date().toLocaleDateString("en-IN") } }
        : inj
    ));
    setReqNote("");
    setActiveInj(prev => ({ ...prev, status: "ClearanceRequested", clearanceRequest: { note: reqNote, date: new Date().toLocaleDateString("en-IN") } }));
    showToast("Clearance request sent to Physio & Management.");
  };

  const openInjury = (inj) => {
    setActiveInj(inj);
    setView(V.INJ_DETAIL);
  };

  // ─── INJURY DETAIL VIEW (Updated to match your new image) ───────────────
  if (view === V.INJ_DETAIL && activeInj) {
    const inj = injuries.find(i => i.id === activeInj.id) || activeInj;

    return (
      <div style={{ padding: "28px", maxWidth: "700px", margin: "0 auto" }}>
        <BackBtn label="My Injuries" onClick={() => setView(V.INJURIES)} />

        {/* Injury Header Card */}
        <div style={card({ padding: "24px", marginBottom: "20px", borderLeft: "5px solid #2f9be0" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 6px 0", fontFamily: "'Barlow Condensed', sans-serif" }}>{inj.type}</h2>
              <p style={{ color: "#666", margin: 0 }}>{inj.bodyPart} · Reported {inj.dateReported}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: "#fff8e1", color: "#f9a825" }}>
                {inj.severity}
              </span>
              <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: "#fff0f0", color: "#cc3333" }}>
                Active Injury
              </span>
            </div>
          </div>

          {inj.description && (
            <div style={{ marginTop: "16px", padding: "14px", background: "#f9f9f9", borderRadius: "8px", borderLeft: "4px solid #2f9be0" }}>
              {inj.description}
            </div>
          )}
        </div>

        {/* Clearance Request Section - Matching Image */}
        <div style={card({ padding: "24px" })}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Send size={20} style={{ color: "#2f9be0" }} />
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>Request Clearance for Playing</h3>
          </div>

          <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
            Describe your current condition and why you feel ready to return to play. This request will be sent to your Physio and Management.
          </p>

          <textarea
            value={reqNote}
            onChange={e => setReqNote(e.target.value)}
            placeholder="e.g. Shoulder feels much better, no pain during light throwing. Ready to resume."
            rows={4}
            style={{ width: "100%", padding: "14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", resize: "vertical", marginBottom: "20px" }}
          />

          <OBtn onClick={() => requestClearance(inj.id)} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            <Send size={18} /> Send Clearance Request
          </OBtn>
        </div>
      </div>
    );
  }

  // ─── INJURIES LIST ─────────────────────────────────────────────────────
  if (view === V.INJURIES) {
    return (
      <div style={{ padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
        <BackBtn label="Player Info" onClick={() => setView(V.INFO)} />
        <Heading title="My Injuries" sub="Track your injury status and request playing clearance" />

        {injuries.length === 0 ? (
          <div style={card({ padding: "60px", textAlign: "center" })}>
            <CheckCircle2 size={40} style={{ color: "#4ade80" }} />
            <p style={{ marginTop: "16px", fontSize: "16px", fontWeight: "600" }}>No active injuries</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {injuries.map(inj => (
              <div key={inj.id} onClick={() => openInjury(inj)}
                style={card({ padding: "18px 20px", cursor: "pointer" })}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px" }}>{inj.type}</div>
                    <div style={{ fontSize: "13px", color: "#666" }}>{inj.bodyPart} · {inj.dateReported}</div>
                  </div>
                  <ChevronRight size={20} style={{ color: "#999" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── TEAM VIEW ─────────────────────────────────────────────────────────
  if (view === V.TEAM) {
    const teamMembers = [
      { number: "01", name: "Arjun Menon", role: "Batsman" },
      { number: "02", name: "Rahul Das", role: "Bowler" },
      { number: "03", name: "Vivek Pillai", role: "All-rounder" },
      { number: "04", name: "Nikhil K", role: "Wicket-keeper" },
    ];

    return (
      <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>
        <BackBtn label="Player Info" onClick={() => setView(V.INFO)} />
        <Heading title="Team Members" />

        <div style={card({ overflow: "hidden" })}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontWeight: "700", color: "#333" }}>
            {teamMembers.length} Players
          </div>
          {teamMembers.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: i < teamMembers.length - 1 ? "1px solid #f5f5f5" : "none", gap: "16px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#e8f3fb", border: "2px solid #cfe6f7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#2f9be0" }}>
                {m.number}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700" }}>{m.name}</div>
                <div style={{ fontSize: "13px", color: "#666" }}>{m.role}</div>
              </div>
              <ChevronRight size={18} style={{ color: "#ccc" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── DAILY PROGRESS ────────────────────────────────────────────────────
  if (view === V.DAILY_PROGRESS) {
    return <DailyReportForm onBack={() => setView(V.INFO)} />;
  }

  // ─── MAIN INFO VIEW ────────────────────────────────────────────────────
  if (!player) return <div style={{ padding: "50px", textAlign: "center" }}>Loading player information...</div>;

  const team = player.team || {};
  const activeInjuriesCount = injuries.filter(i => i.status !== "Cleared").length;

  return (
    <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>
      <PageBanner title={player?.name || "My Profile"} sub="Player overview" />

      {/* Team Info Card */}
      <div style={card({ overflow: "hidden", marginBottom: "20px" })}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#e8f3fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={22} style={{ color: "#2f9be0" }} />
          </div>
          <div>
            <div style={{ fontSize: "17px", fontWeight: "700" }}>{team.name || "Kerala Cricket Academy"}</div>
            <div style={{ fontSize: "13px", color: "#666" }}>Team Overview</div>
          </div>
        </div>

        <div style={{ padding: "12px 24px" }}>
          {[
            { icon: ShieldCheck, label: "Team", value: team.name || "Kerala Cricket Academy" },
            { icon: Stethoscope, label: "Physio", value: team.physio?.name || "Dr. Arun" },
            { icon: Dumbbell, label: "Trainer", value: team.trainer?.name || "Rahul" },
            { icon: Apple, label: "Nutritionist", value: team.nutritionist?.name || "Anjali" },
            { icon: User, label: "Coach", value: team.coach },
          ].map((row, i) => {
            const Icon = row.icon;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "13px 0", borderBottom: i < 4 ? "1px solid #f5f5f5" : "none", gap: "14px" }}>
                <Icon size={18} style={{ color: "#2f9be0" }} />
                <span style={{ width: "110px", color: "#555", fontWeight: "500" }}>{row.label}</span>
                <span style={{ fontWeight: "600", color: "#222" }}>{row.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Injuries Banner */}
      {activeInjuriesCount > 0 && (
        <div style={{ ...card({ padding: "14px 20px", backgroundColor: "#fff0f0", border: "1px solid #ffc5c5", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={18} style={{ color: "#cc3333" }} />
            <span style={{ fontWeight: "700", color: "#cc3333" }}>
              {activeInjuriesCount} active injur{activeInjuriesCount > 1 ? "ies" : "y"} on record
            </span>
          </div>
          <button onClick={() => setView(V.INJURIES)} style={{ color: "#2f9be0", fontWeight: "700", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
            View & Request Clearance →
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button onClick={() => setView(V.TEAM)} style={{ padding: "11px 22px", background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={16} /> View Team
        </button>

        <OBtn onClick={() => setView(V.INJURIES)} variant="danger">
          <AlertTriangle size={16} /> My Injuries
        </OBtn>

        <OBtn onClick={() => setView(V.DAILY_PROGRESS)}>
          <ClipboardList size={16} /> Daily Progress
        </OBtn>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: "28px", right: "28px", backgroundColor: toast.type === "success" ? "#2e7d32" : "#cc3333", color: "#fff", padding: "12px 20px", borderRadius: "10px", boxShadow: "0 4px 14px rgba(0,0,0,0.2)", zIndex: 999 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}