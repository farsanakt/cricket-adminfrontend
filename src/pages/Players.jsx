import { useState } from "react";
import DailyReportForm from "../components/DailyReportForm";
import {
  Users,
  User,
  Stethoscope,
  Dumbbell,
  Apple,
  ShieldCheck,
  ArrowLeft,
  ClipboardList,
  ChevronRight,
  Droplets,
  Weight,
  Ruler,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Activity,
} from "lucide-react";
import { PageBanner } from "../theme";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const TEAMS = [
  {
    id: 1,
    name: "Kerala Cricket Academy",
    shortName: "KCA",
    physio: "Dr. Arun",
    trainer: "Rahul",
    nutritionist: "Anjali",
    coach: "Suresh",
    players: [
      {
        id: 101,
        name: "Arjun Menon",
        number: "01",
        role: "Batsman",
        age: 23,
        weight: 72,
        height: 178,
        bloodGroup: "B+",
        dob: "2001-04-15",
        phone: "+91 98765 43210",
        email: "arjun.menon@kca.in",
        location: "Kozhikode, Kerala",
        dominantHand: "Right",
        battingStyle: "Right-hand bat",
        bowlingStyle: "Right-arm medium",
        joinedDate: "2022-01-10",
        status: "Active",
        injury: false,
      },
      {
        id: 102,
        name: "Rahul Das",
        number: "02",
        role: "Bowler",
        age: 25,
        weight: 80,
        height: 185,
        bloodGroup: "O+",
        dob: "1999-08-22",
        phone: "+91 91234 56789",
        email: "rahul.das@kca.in",
        location: "Thrissur, Kerala",
        dominantHand: "Right",
        battingStyle: "Right-hand bat",
        bowlingStyle: "Right-arm fast",
        joinedDate: "2021-06-01",
        status: "Injured",
        injury: true,
      },
      {
        id: 103,
        name: "Vivek Pillai",
        number: "03",
        role: "All-rounder",
        age: 22,
        weight: 75,
        height: 180,
        bloodGroup: "A+",
        dob: "2002-11-05",
        phone: "+91 99887 76655",
        email: "vivek.pillai@kca.in",
        location: "Kochi, Kerala",
        dominantHand: "Left",
        battingStyle: "Left-hand bat",
        bowlingStyle: "Left-arm spin",
        joinedDate: "2023-03-15",
        status: "Active",
        injury: false,
      },
      {
        id: 104,
        name: "Nikhil Krishnan",
        number: "04",
        role: "Wicket-keeper",
        age: 24,
        weight: 68,
        height: 172,
        bloodGroup: "AB+",
        dob: "2000-02-28",
        phone: "+91 94455 66778",
        email: "nikhil.k@kca.in",
        location: "Thiruvananthapuram, Kerala",
        dominantHand: "Right",
        battingStyle: "Right-hand bat",
        bowlingStyle: "—",
        joinedDate: "2022-07-20",
        status: "Active",
        injury: false,
      },
    ],
  },
  {
    id: 2,
    name: "Mumbai Strikers",
    shortName: "MBS",
    physio: "Dr. Priya",
    trainer: "Sanjay",
    nutritionist: "Meera",
    coach: "Vikram",
    players: [
      {
        id: 201,
        name: "Rohit Sharma Jr.",
        number: "11",
        role: "Batsman",
        age: 26,
        weight: 78,
        height: 182,
        bloodGroup: "O-",
        dob: "1998-07-30",
        phone: "+91 97766 55443",
        email: "rohit.jr@mbs.in",
        location: "Mumbai, Maharashtra",
        dominantHand: "Right",
        battingStyle: "Right-hand bat",
        bowlingStyle: "Right-arm off-break",
        joinedDate: "2020-09-01",
        status: "Active",
        injury: false,
      },
      {
        id: 202,
        name: "Aditya Kulkarni",
        number: "12",
        role: "Bowler",
        age: 21,
        weight: 70,
        height: 176,
        bloodGroup: "B-",
        dob: "2003-03-11",
        phone: "+91 95544 33221",
        email: "aditya.k@mbs.in",
        location: "Pune, Maharashtra",
        dominantHand: "Right",
        battingStyle: "Right-hand bat",
        bowlingStyle: "Right-arm fast-medium",
        joinedDate: "2023-01-15",
        status: "Active",
        injury: false,
      },
    ],
  },
  {
    id: 3,
    name: "Delhi Dynamos",
    shortName: "DLD",
    physio: "Dr. Ramesh",
    trainer: "Amit",
    nutritionist: "Sunita",
    coach: "Pankaj",
    players: [
      {
        id: 301,
        name: "Kartik Verma",
        number: "21",
        role: "All-rounder",
        age: 27,
        weight: 82,
        height: 183,
        bloodGroup: "A-",
        dob: "1997-12-04",
        phone: "+91 98800 11223",
        email: "kartik.v@dld.in",
        location: "New Delhi",
        dominantHand: "Right",
        battingStyle: "Right-hand bat",
        bowlingStyle: "Right-arm medium-fast",
        joinedDate: "2019-04-10",
        status: "Active",
        injury: false,
      },
    ],
  },
];

// ─────────────────────────────────────────────
// VIEW CONSTANTS
// ─────────────────────────────────────────────
const V_TEAMS  = "teams";
const V_ROSTER = "roster";
const V_PLAYER = "player";
const V_FORM   = "form";

// ─────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────
const card = (extra = {}) => ({
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  border: "1px solid #e8e8e8",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  ...extra,
});

const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "22px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", marginBottom: "2px", fontFamily: "'Barlow Condensed', sans-serif" }}>
      {title}
    </h1>
    {sub && <p style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "4px" }} />
  </div>
);

const BackBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "6px",
      background: "none", border: "none", color: "#888",
      fontSize: "13px", fontWeight: "600", cursor: "pointer",
      marginBottom: "18px", padding: "0",
    }}
  >
    <ArrowLeft size={16} style={{ color: "#888" }} />
    {label}
  </button>
);

const StaffPill = ({ icon: Icon, label }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "5px",
    fontSize: "12px", color: "#666", fontWeight: "500",
    backgroundColor: "#f9f9f9", border: "1px solid #ebebeb",
    borderRadius: "20px", padding: "3px 10px",
  }}>
    <Icon size={12} style={{ color: "#2f9be0" }} />
    {label}
  </div>
);

const DetailField = ({ icon: Icon, label, value }) => (
  <div style={{
    display: "flex", alignItems: "flex-start",
    padding: "12px 0", borderBottom: "1px solid #f5f5f5", gap: "10px",
  }}>
    <Icon size={15} style={{ color: "#2f9be0", flexShrink: 0, marginTop: "1px" }} />
    <span style={{ fontSize: "12px", color: "#888", width: "140px", flexShrink: 0, fontWeight: "500" }}>
      {label}
    </span>
    <span style={{ fontSize: "13px", color: "#222", fontWeight: "600" }}>{value}</span>
  </div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Players = () => {
  const [view, setView]               = useState(V_TEAMS);
  const [activeTeam, setActiveTeam]   = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);

  // ── VIEW: DAILY FORM ──
  if (view === V_FORM) {
    return (
      <DailyReportForm
        onBack={() => setView(V_PLAYER)}
      />
    );
  }

  // ── VIEW: TEAM CARDS ──
  if (view === V_TEAMS) return (
    <div style={{ padding: "28px", maxWidth: "1000px", margin: "0 auto" }}>
      <PageBanner title="Players" sub="Teams & player registry" />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
      }}>
        {TEAMS.map((team) => {
          const injured = team.players.filter((p) => p.injury).length;
          return (
            <div
              key={team.id}
              onClick={() => { setActiveTeam(team); setView(V_ROSTER); }}
              style={{
                ...card({
                  padding: "0",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2f9be0";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(47, 155, 224,0.14)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e8e8e8";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Card top stripe */}
              <div style={{
                height: "6px",
                background: "linear-gradient(90deg, #2f9be0, #2380c2)",
              }} />

              {/* Card body */}
              <div style={{ padding: "20px 22px" }}>
                {/* Team name row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "10px",
                      backgroundColor: "#e8f3fb", border: "1.5px solid #cfe6f7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: "800", color: "#2f9be0",
                      flexShrink: 0,
                    }}>
                      {team.shortName}
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>
                        {team.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#888", marginTop: "1px" }}>
                        {team.players.length} player{team.players.length !== 1 ? "s" : ""}
                        {injured > 0 && (
                          <span style={{ color: "#cc3333", fontWeight: "700", marginLeft: "6px" }}>
                            · {injured} injured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "#ccc", flexShrink: 0 }} />
                </div>

                {/* Staff pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <StaffPill icon={ShieldCheck}  label={`Coach: ${team.coach}`} />
                  <StaffPill icon={Stethoscope}  label={`Physio: ${team.physio}`} />
                  <StaffPill icon={Dumbbell}     label={`Trainer: ${team.trainer}`} />
                  <StaffPill icon={Apple}        label={`Nutritionist: ${team.nutritionist}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── VIEW: PLAYER ROSTER ──
  if (view === V_ROSTER) return (
    <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>
      <BackBtn label="All Teams" onClick={() => { setView(V_TEAMS); setActiveTeam(null); }} />
      <Heading title={activeTeam.name} sub={`${activeTeam.players.length} registered players`} />

      {/* Team staff card */}
      <div style={{ ...card({ padding: "14px 20px", marginBottom: "20px" }), display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "#aaa", fontWeight: "600", marginRight: "4px" }}>STAFF</span>
        <StaffPill icon={ShieldCheck}  label={`Coach: ${activeTeam.coach}`} />
        <StaffPill icon={Stethoscope}  label={`Physio: ${activeTeam.physio}`} />
        <StaffPill icon={Dumbbell}     label={`Trainer: ${activeTeam.trainer}`} />
        <StaffPill icon={Apple}        label={`Nutritionist: ${activeTeam.nutritionist}`} />
      </div>

      {/* Players list */}
      <div style={card({ overflow: "hidden" })}>
        <div style={{ padding: "13px 22px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "7px" }}>
          <Users size={15} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>
            {activeTeam.players.length} Players
          </span>
        </div>

        {activeTeam.players.map((player, i) => (
          <div
            key={player.id}
            onClick={() => { setActivePlayer(player); setView(V_PLAYER); }}
            style={{
              display: "flex", alignItems: "center",
              padding: "14px 22px",
              borderBottom: i < activeTeam.players.length - 1 ? "1px solid #f5f5f5" : "none",
              gap: "14px", cursor: "pointer", transition: "background 0.12s",
              borderLeft: player.injury ? "3px solid #cc3333" : "3px solid transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* number badge */}
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              backgroundColor: player.injury ? "#fff0f0" : "#e8f3fb",
              border: `1.5px solid ${player.injury ? "#ffc5c5" : "#cfe6f7"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "800",
              color: player.injury ? "#cc3333" : "#2f9be0",
              flexShrink: 0,
            }}>
              {player.number}
            </div>

            {/* name + role */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>
                  {player.name}
                </span>
                {player.injury && (
                  <span style={{
                    fontSize: "10px", fontWeight: "700", color: "#cc3333",
                    backgroundColor: "#fff0f0", border: "1px solid #ffc5c5",
                    borderRadius: "20px", padding: "2px 8px",
                  }}>
                    Injured
                  </span>
                )}
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "1px" }}>
                {player.role} · {player.battingStyle}
              </div>
            </div>

            {/* quick stats */}
            <div style={{ display: "flex", gap: "16px", flexShrink: 0 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{player.age}</div>
                <div style={{ fontSize: "10px", color: "#aaa" }}>Age</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{player.height}cm</div>
                <div style={{ fontSize: "10px", color: "#aaa" }}>Height</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{player.weight}kg</div>
                <div style={{ fontSize: "10px", color: "#aaa" }}>Weight</div>
              </div>
            </div>

            <ChevronRight size={15} style={{ color: "#ccc", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );

  // ── VIEW: PLAYER DETAIL ──
  if (view === V_PLAYER) return (
    <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>
      <BackBtn
        label={`${activeTeam.name} — Players`}
        onClick={() => { setView(V_ROSTER); setActivePlayer(null); }}
      />

      {/* Profile hero card */}
      <div style={{ ...card({ padding: "24px", marginBottom: "20px" }) }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "18px", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            backgroundColor: activePlayer.injury ? "#fff0f0" : "#e8f3fb",
            border: `2px solid ${activePlayer.injury ? "#ffc5c5" : "#cfe6f7"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <User size={28} style={{ color: activePlayer.injury ? "#cc3333" : "#2f9be0" }} />
          </div>

          {/* Name block */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {activePlayer.name}
              </h2>
              <span style={{
                fontSize: "11px", fontWeight: "700", padding: "3px 10px",
                borderRadius: "20px",
                backgroundColor: activePlayer.status === "Injured" ? "#fff0f0" : "#f0faf0",
                color: activePlayer.status === "Injured" ? "#cc3333" : "#2e7d32",
                border: `1px solid ${activePlayer.status === "Injured" ? "#ffc5c5" : "#b8e6b8"}`,
              }}>
                {activePlayer.status}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
              #{activePlayer.number} · {activePlayer.role} · {activeTeam.name}
            </div>

            {/* Stat pills row */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              {[
                { label: "Age",        value: `${activePlayer.age} yrs` },
                { label: "Height",     value: `${activePlayer.height} cm` },
                { label: "Weight",     value: `${activePlayer.weight} kg` },
                { label: "Blood",      value: activePlayer.bloodGroup },
                { label: "Hand",       value: activePlayer.dominantHand },
              ].map((s) => (
                <div key={s.label} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "8px 14px", backgroundColor: "#f9f9f9",
                  border: "1px solid #ebebeb", borderRadius: "8px",
                }}>
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#222" }}>{s.value}</span>
                  <span style={{ fontSize: "10px", color: "#aaa", marginTop: "1px" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column detail section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>

        {/* Personal Info */}
        <div style={card({ padding: "6px 20px 4px", overflow: "hidden" })}>
          <div style={{ padding: "13px 0 10px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
            <User size={14} style={{ color: "#2f9be0" }} />
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>Personal Info</span>
          </div>
          <DetailField icon={Calendar}  label="Date of Birth"  value={new Date(activePlayer.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
          <DetailField icon={Droplets}  label="Blood Group"    value={activePlayer.bloodGroup} />
          <DetailField icon={Ruler}     label="Height"         value={`${activePlayer.height} cm`} />
          <DetailField icon={Weight}    label="Weight"         value={`${activePlayer.weight} kg`} />
          <DetailField icon={MapPin}    label="Location"       value={activePlayer.location} />
        </div>

        {/* Cricket Info */}
        <div style={card({ padding: "6px 20px 4px", overflow: "hidden" })}>
          <div style={{ padding: "13px 0 10px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
            <Activity size={14} style={{ color: "#2f9be0" }} />
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>Cricket Info</span>
          </div>
          <DetailField icon={ShieldCheck} label="Role"            value={activePlayer.role} />
          <DetailField icon={Activity}    label="Batting Style"   value={activePlayer.battingStyle} />
          <DetailField icon={Activity}    label="Bowling Style"   value={activePlayer.bowlingStyle} />
          <DetailField icon={Users}       label="Dominant Hand"   value={activePlayer.dominantHand} />
          <DetailField icon={Calendar}    label="Joined"          value={new Date(activePlayer.joinedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
        </div>
      </div>

      {/* Contact Info */}
      <div style={{ ...card({ padding: "6px 20px 4px", marginBottom: "20px" }) }}>
        <div style={{ padding: "13px 0 10px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
          <Phone size={14} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>Contact</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0" }}>
          <DetailField icon={Phone} label="Phone" value={activePlayer.phone} />
          <DetailField icon={Mail}  label="Email" value={activePlayer.email} />
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {/* <button
          onClick={() => setView(V_FORM)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "11px 22px", backgroundColor: "#2f9be0",
            color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "14px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(47, 155, 224,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2380c2")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2f9be0")}
        >
          <ClipboardList size={16} />
          Daily Progress
        </button> */}
{/* 
        <button
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "11px 22px", backgroundColor: "#fff",
            color: "#555", border: "1.5px solid #e0e0e0",
            borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
        >
          <Activity size={16} />
          View Reports
        </button> */}
      </div>
    </div>
  );

  return null;
};

export default Players;