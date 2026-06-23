'use client';

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Plus, ChevronRight, ChevronLeft, MapPin,
  Calendar, Clock, Activity, User, Users, CheckCircle2,
  X, Edit2, Save, AlertCircle, Wifi, WifiOff, Navigation,
  FileText, MessageSquare, Star, Send, Eye, Shield,
  Target, TrendingUp, AlertTriangle,
} from "lucide-react";
import socket from "../socket";
import { getAllCoaches, getCoachLocations, createCoach } from "../api/coachApi";
import { PageBanner } from "../theme";

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
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

const OBtn = ({ children, onClick, style = {}, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 20px", backgroundColor: disabled ? "#e0e0e0" : "#2f9be0", color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 2px 8px rgba(47, 155, 224,0.28)", ...style }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = "#2380c2"; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = "#2f9be0"; }}
  >{children}</button>
);

const inputStyle = { width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

const InputF = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "4px", letterSpacing: "0.4px", textTransform: "uppercase" }}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle}
      onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
  </div>
);

const ACTIVITY_TYPES = ["Training", "Batting", "Bowling", "Fielding", "Fitness", "Net Practice", "Video Review", "Video Analysis", "Match Prep", "Meeting", "Other"];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Views
const V = {
  LIST: "list", DETAIL: "detail", ADD: "add", ATTENDANCE: "attendance",
  DAY_DETAIL: "day_detail", ACTIVITIES: "activities", GPS: "gps", ADD_ACTIVITY: "add_activity",
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ─── DISTANCE CALCULATION ─────────────────────────────────────────────────────
const distanceTo = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── GPS MAP WIDGET ───────────────────────────────────────────────────────────
function GpsWidget({ coach }) {
  const [live, setLive] = useState(coach.currentGps);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const startTracking = () => {
    if (!coach.isOnline) { setGeoError("Coach is offline. Cannot track."); return; }
    if (!navigator.geolocation) { setGeoError("Geolocation not supported."); return; }
    setTracking(true);
    const id = navigator.geolocation.watchPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Use coach's academy coordinates for geofencing
        const dist = distanceTo(lat, lng, coach.academyLatitude, coach.academyLongitude);
        const allowedRadius = coach.allowedRadius || 500; // Default 500m
        setLive({ 
          lat, 
          lng, 
          inGeofence: dist <= allowedRadius, 
          lastSeen: "Just now", 
          dist: Math.round(dist),
          radius: allowedRadius
        });
        setGeoError(null);
      },
      err => { setGeoError(err.message); setTracking(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setTracking(false);
    setWatchId(null);
  };

  useEffect(() => () => { if (watchId) navigator.geolocation.clearWatch(watchId); }, [watchId]);

  return (
    <div style={card({ padding: "22px" })}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}>
          <Navigation size={15} style={{ color: "#2f9be0" }} /> GPS Tracking & Geofencing
        </div>
        {!coach.isOnline ? (
          <button disabled style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "7px 14px", backgroundColor: "#e0e0e0", color: "#aaa", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "not-allowed" }}>
            <WifiOff size={13} /> Coach Offline
          </button>
        ) : !tracking ? (
          <OBtn onClick={startTracking} style={{ padding: "7px 14px", fontSize: "12px" }}>
            <Wifi size={13} /> Start Live Tracking
          </OBtn>
        ) : (
          <button onClick={stopTracking} style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "7px 14px", backgroundColor: "#fff0f0", color: "#cc3333", border: "1.5px solid #ffc5c5", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
            <WifiOff size={13} /> Stop Tracking
          </button>
        )}
      </div>

      {geoError && (
        <div style={{ padding: "10px 14px", backgroundColor: "#fff0f0", border: "1px solid #ffc5c5", borderRadius: "8px", fontSize: "12px", color: "#cc3333", marginBottom: "14px" }}>
          ⚠ {geoError}
        </div>
      )}

      {/* Geofence info */}
      <div style={{ padding: "14px 16px", backgroundColor: "#f9f9f9", borderRadius: "9px", border: "1px solid #e8e8e8", marginBottom: "14px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Geofence Zone</div>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#222", marginBottom: "2px" }}>{coach.academyName || "Academy"}</div>
        <div style={{ fontSize: "12px", color: "#888" }}>Radius: {live.radius || 500}m · Lat {coach.academyLatitude?.toFixed(4)}, Lng {coach.academyLongitude?.toFixed(4)}</div>
      </div>

      {/* Status */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "16px" }}>
        <div style={{ padding: "14px 16px", backgroundColor: live.inGeofence ? "#f0faf0" : "#fff0f0", border: `1px solid ${live.inGeofence ? "#b8e6b8" : "#ffc5c5"}`, borderRadius: "9px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: live.inGeofence ? "#2e7d32" : "#cc3333", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>
            {live.inGeofence ? "✓ Inside Zone" : "✗ Outside Zone"}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Last: {live.lastSeen}</div>
        </div>
        <div style={{ padding: "14px 16px", backgroundColor: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "9px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>Coordinates</div>
          {live.lat ? (
            <div style={{ fontSize: "12px", color: "#333", fontFamily: "monospace" }}>{live.lat.toFixed(5)}, {live.lng.toFixed(5)}</div>
          ) : (
            <div style={{ fontSize: "12px", color: "#aaa" }}>Not available</div>
          )}
          {live.dist !== undefined && <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{live.dist}m from zone</div>}
        </div>
      </div>

      {/* Visual geofence map (SVG mock) */}
      <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #e8e8e8", backgroundColor: "#e8f4f8", position: "relative", height: "180px" }}>
        <svg width="100%" height="180" style={{ display: "block" }}>
          {[0, 1, 2, 3, 4, 5].map(i => <line key={`h${i}`} x1="0" y1={i * 36} x2="100%" y2={i * 36} stroke="#c8dde8" strokeWidth="0.5" />)}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <line key={`v${i}`} x1={`${i * 12.5}%`} y1="0" x2={`${i * 12.5}%`} y2="180" stroke="#c8dde8" strokeWidth="0.5" />)}
          <circle cx="50%" cy="90" r="60" fill="rgba(47, 155, 224,0.08)" stroke="#2f9be0" strokeWidth="2" strokeDasharray="6 3" />
          <text x="50%" y="50" textAnchor="middle" fontSize="10" fill="#2f9be0" fontWeight="700">{coach.academyName || "Zone"}</text>
          <text x="50%" y="62" textAnchor="middle" fontSize="9" fill="#888">{live.radius || 500}m radius</text>
          <circle cx="50%" cy="90" r="5" fill="#2f9be0" />
          <circle cx="50%" cy="90" r="12" fill="rgba(47, 155, 224,0.2)" />
          {live.lat && (
            <>
              <circle cx={live.inGeofence ? "52%" : "72%"} cy={live.inGeofence ? "88" : "55"} r="7" fill={live.inGeofence ? "#2e7d32" : "#cc3333"} />
              <circle cx={live.inGeofence ? "52%" : "72%"} cy={live.inGeofence ? "88" : "55"} r="14" fill={live.inGeofence ? "rgba(46,125,50,0.15)" : "rgba(204,51,51,0.15)"}>
                {tracking && <animate attributeName="r" values="7;18;7" dur="2s" repeatCount="indefinite" />}
              </circle>
              <text x={live.inGeofence ? "52%" : "72%"} y={live.inGeofence ? "108" : "75"} textAnchor="middle" fontSize="9" fill="#333" fontWeight="600">{coach.name?.split(" ")[0]}</text>
            </>
          )}
        </svg>
        {tracking && (
          <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", alignItems: "center", gap: "5px", backgroundColor: "rgba(46,125,50,0.9)", color: "#fff", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#fff" }}></div>
            LIVE
          </div>
        )}
        {!live.lat && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "6px" }}>
            <WifiOff size={20} style={{ color: "#aaa" }} />
            <span style={{ fontSize: "12px", color: "#aaa" }}>No GPS signal</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ATTENDANCE CALENDAR ──────────────────────────────────────────────────────
function AttendanceCalendar({ coach, onDayClick }) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const presentDays = Object.values(coach.attendance || {}).filter(a => a.present).length;
  const totalDays = Object.keys(coach.attendance || {}).length;

  return (
    <div style={card({ padding: "22px" })}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}>
          <Calendar size={15} style={{ color: "#2f9be0" }} /> Attendance Calendar
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button onClick={prevMonth} style={{ width: "28px", height: "28px", borderRadius: "7px", border: "1px solid #e0e0e0", backgroundColor: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} style={{ color: "#555" }} /></button>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#222", minWidth: "120px", textAlign: "center" }}>{MONTHS[calMonth]} {calYear}</span>
          <button onClick={nextMonth} style={{ width: "28px", height: "28px", borderRadius: "7px", border: "1px solid #e0e0e0", backgroundColor: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} style={{ color: "#555" }} /></button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {[
          { label: "Present", value: presentDays, color: "#2e7d32", bg: "#f0faf0", border: "#b8e6b8" },
          { label: "Absent", value: totalDays - presentDays, color: "#cc3333", bg: "#fff0f0", border: "#ffc5c5" },
          { label: "Rate", value: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) + "%" : "—", color: "#2f9be0", bg: "#e8f3fb", border: "#cfe6f7" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: "10px", backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "6px" }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: "700", color: "#aaa", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const key = dateKey(calYear, calMonth, day);
          const att = (coach.attendance || {})[key];
          const isToday = key === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const hasData = !!att;
          const isPresent = att?.present;
          const hasActivities = ((coach.activities || {})[key] || []).length > 0;

          return (
            <div key={day}
              onClick={() => hasData && onDayClick(key, att)}
              style={{
                aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                borderRadius: "8px", cursor: hasData ? "pointer" : "default",
                backgroundColor: isToday ? "#e8f3fb" : isPresent ? "#f0faf0" : hasData ? "#fff0f0" : "#fafafa",
                border: `1.5px solid ${isToday ? "#2f9be0" : isPresent ? "#b8e6b8" : hasData ? "#ffc5c5" : "#f0f0f0"}`,
                transition: "all 0.12s", position: "relative",
              }}
              onMouseEnter={e => { if (hasData) e.currentTarget.style.transform = "scale(1.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <span style={{ fontSize: "13px", fontWeight: isToday ? "800" : "600", color: isToday ? "#2f9be0" : isPresent ? "#2e7d32" : hasData ? "#cc3333" : "#bbb" }}>{day}</span>
              {hasActivities && isPresent && (
                <div style={{ position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#2f9be0" }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "14px", marginTop: "14px", flexWrap: "wrap" }}>
        {[
          { color: "#2e7d32", bg: "#f0faf0", label: "Present" },
          { color: "#cc3333", bg: "#fff0f0", label: "Absent" },
          { color: "#2f9be0", bg: "#e8f3fb", label: "Today" },
          { color: "#2f9be0", bg: "#2f9be0", label: "Has activities", dot: true },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {l.dot ? <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: l.color }} /> : <div style={{ width: "12px", height: "12px", borderRadius: "4px", backgroundColor: l.bg, border: `1.5px solid ${l.color}` }} />}
            <span style={{ fontSize: "11px", color: "#666" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADD ACTIVITY FORM ────────────────────────────────────────────────────────
function AddActivityForm({ date, onSave, onCancel }) {
  const [form, setForm] = useState({ time: "09:00", type: "Training", description: "", players: "", duration: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={card({ padding: "22px" })}>
      <div style={{ fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "16px", display: "flex", alignItems: "center", gap: "7px" }}>
        <Plus size={14} style={{ color: "#2f9be0" }} /> Add Activity for {date}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "12px" }}>
        <InputF label="Time" type="time" value={form.time} onChange={e => set("time", e.target.value)} />
        <div>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Type</label>
          <select value={form.type} onChange={e => set("type", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")}>
            {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Description</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="What was covered in this session..." rows={3}
          style={{ ...inputStyle, resize: "none" }}
          onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "16px" }}>
        <InputF label="Players / Group" value={form.players} onChange={e => set("players", e.target.value)} placeholder="e.g. Arjun Menon, Full Squad" />
        <InputF label="Duration" value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 60 min" />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <OBtn onClick={() => { if (!form.description.trim()) { alert("Enter a description."); return; } onSave({ ...form, id: `act_${Date.now()}`, feedback: null }); }} style={{ flex: 1, justifyContent: "center" }}>
          <Save size={14} /> Save Activity
        </OBtn>
        <button onClick={onCancel} style={{ flex: 1, padding: "10px", backgroundColor: "#fff", color: "#555", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
        >Cancel</button>
      </div>
    </div>
  );
}

// ─── MAIN COACHES COMPONENT ───────────────────────────────────────────────────
export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [view, setView] = useState(V.LIST);
  const [activeCoach, setActiveCoach] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedAtt, setSelectedAtt] = useState(null);
  const [showAddAct, setShowAddAct] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackFor, setFeedbackFor] = useState(null);
  const [toast, setToast] = useState(null);
  const [showOnlyOnline, setShowOnlyOnline] = useState(true);

  // Add coach form with academy details
  const [addForm, setAddForm] = useState({ 
    name: "", 
    role: "", 
    phone: "", 
    email: "", 
    teams: "",
    academyName: "",
    academyLatitude: "",
    academyLongitude: "",
    allowedRadius: "500"
  });

  const setAF = (k, v) => setAddForm(f => ({ ...f, [k]: v }));
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    fetchCoaches();

    socket.on("coachLocationUpdated", (liveLocation) => {
      setCoaches((prev) =>
        prev.map((coach) => {
          if (coach._id === liveLocation._id) {
            // Recalculate geofence status
            const dist = distanceTo(
              liveLocation.currentLatitude,
              liveLocation.currentLongitude,
              coach.academyLatitude,
              coach.academyLongitude
            );
            const allowedRadius = coach.allowedRadius || 500;
            const insideAcademy = dist <= allowedRadius;

            return {
              ...coach,
              currentLatitude: liveLocation.currentLatitude,
              currentLongitude: liveLocation.currentLongitude,
              currentGps: {
                lat: liveLocation.currentLatitude,
                lng: liveLocation.currentLongitude,
                inGeofence: insideAcademy,
                lastSeen: liveLocation.lastSeen,
              },
              isOnline: liveLocation.isOnline,
              insideAcademy: insideAcademy,
              lastSeen: liveLocation.lastSeen,
              status: liveLocation.isOnline
                ? (insideAcademy ? "Inside Academy" : "Outside Academy")
                : "Offline",
            };
          }
          return coach;
        })
      );
    });

    return () => {
      socket.off("coachLocationUpdated");
    };
  }, []);

  const fetchCoaches = async () => {
    try {
      const coachRes = await getAllCoaches();
      const locationRes = await getCoachLocations();

      const locations = locationRes.data;

      const formatted = coachRes.data.map((coach) => {
        // Calculate distance from current location to academy
        const dist = distanceTo(
          coach.currentLatitude,
          coach.currentLongitude,
          coach.academyLatitude,
          coach.academyLongitude
        );
        const allowedRadius = coach.allowedRadius || 500;
        const insideAcademy = dist <= allowedRadius;

        return {
          ...coach,
          id: coach._id,
          avatar:
            coach.name
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase(),
          teams: coach.teams || [],
          attendance: {},
          activities: {},
          gpsHistory: [],
          status: coach.isOnline
            ? (insideAcademy ? "Inside Academy" : "Outside Academy")
            : "Offline",
          currentGps: {
            lat: coach.currentLatitude,
            lng: coach.currentLongitude,
            inGeofence: insideAcademy,
            lastSeen: coach.lastSeen,
          },
          isOnline: coach.isOnline,
          insideAcademy: insideAcademy,
          lastSeen: coach.lastSeen,
        };
      });

      setCoaches(formatted);
    } catch (error) {
      console.error("[v0] Error fetching coaches:", error);
      showToast("Error loading coaches");
    }
  };

  const openCoach = (coach) => { setActiveCoach(coach); setActiveTab("overview"); setView(V.DETAIL); };

  const handleAddCoach = async () => {
    if (!addForm.name.trim() || !addForm.role.trim()) {
      alert("Name and role are required.");
      return;
    }

    if (!addForm.academyName.trim()) {
      alert("Academy name is required.");
      return;
    }

    if (!addForm.academyLatitude || !addForm.academyLongitude) {
      alert("Academy latitude and longitude are required.");
      return;
    }

    try {
      // Create coach with all academy details
      const newCoachData = {
        name: addForm.name,
        role: addForm.role,
        phone: addForm.phone,
        email: addForm.email,
        teams: addForm.teams ? addForm.teams.split(",").map(t => t.trim()) : [],
        academyName: addForm.academyName,
        academyLatitude: parseFloat(addForm.academyLatitude),
        academyLongitude: parseFloat(addForm.academyLongitude),
        allowedRadius: parseInt(addForm.allowedRadius) || 500,
        currentLatitude: parseFloat(addForm.academyLatitude),
        currentLongitude: parseFloat(addForm.academyLongitude),
        isOnline: false,
        insideAcademy: true,
      };

      // Send to backend
      await createCoach(newCoachData);

      // Reset form
      setAddForm({ 
        name: "", 
        role: "", 
        phone: "", 
        email: "", 
        teams: "",
        academyName: "",
        academyLatitude: "",
        academyLongitude: "",
        allowedRadius: "500"
      });

      // Refresh coaches list
      await fetchCoaches();
      setView(V.LIST);
      showToast("✅ Coach added successfully.");
    } catch (error) {
      console.error("[v0] Error adding coach:", error);
      showToast("Error adding coach");
    }
  };

  const handleDayClick = (key, att) => {
    setSelectedDay(key);
    setSelectedAtt(att);
    setShowAddAct(false);
    setView(V.DAY_DETAIL);
  };

  const handleAddActivity = (act) => {
    setCoaches(prev => prev.map(c => {
      if (c.id !== activeCoach.id) return c;
      const activities = { ...c.activities };
      activities[selectedDay] = [...(activities[selectedDay] || []), act];
      return { ...c, activities };
    }));
    setActiveCoach(prev => {
      const activities = { ...prev.activities };
      activities[selectedDay] = [...(activities[selectedDay] || []), act];
      return { ...prev, activities };
    });
    setShowAddAct(false);
    showToast("✅ Activity added.");
  };

  const submitFeedback = (actId) => {
    if (!feedbackInput.trim()) return;
    setFeedbackMap(prev => ({ ...prev, [actId]: feedbackInput }));
    setFeedbackInput("");
    setFeedbackFor(null);
    showToast("✅ Feedback submitted.");
  };

  // ── ADD COACH ──
  if (view === V.ADD) return (
    <div style={{ padding: "28px", maxWidth: "700px", margin: "0 auto" }}>
      <BackBtn label="All Coaches" onClick={() => setView(V.LIST)} />
      <Heading title="Add New Coach" sub="Register a coach with academy details" />
      <div style={card({ padding: "24px" })}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "14px" }}>
          <InputF label="Full Name" value={addForm.name} onChange={e => setAF("name", e.target.value)} placeholder="e.g. Suresh Kumar" />
          <InputF label="Role/Title" value={addForm.role} onChange={e => setAF("role", e.target.value)} placeholder="e.g. Head Coach" />
          <InputF label="Phone" value={addForm.phone} onChange={e => setAF("phone", e.target.value)} placeholder="+91 98765 00000" />
          <InputF label="Email" value={addForm.email} onChange={e => setAF("email", e.target.value)} placeholder="coach@academy.in" type="email" />
        </div>
        
        {/* Academy Details */}
        <div style={{ marginBottom: "14px", padding: "14px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #e8e8e8" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#888", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Academy Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "14px" }}>
            <InputF label="Academy Name" value={addForm.academyName} onChange={e => setAF("academyName", e.target.value)} placeholder="e.g. Calicut Cricket Academy" />
            <InputF label="Allowed Radius (m)" value={addForm.allowedRadius} onChange={e => setAF("allowedRadius", e.target.value)} placeholder="500" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            <InputF label="Academy Latitude" value={addForm.academyLatitude} onChange={e => setAF("academyLatitude", e.target.value)} placeholder="e.g. 11.2005" type="number" step="0.0001" />
            <InputF label="Academy Longitude" value={addForm.academyLongitude} onChange={e => setAF("academyLongitude", e.target.value)} placeholder="e.g. 75.9557" type="number" step="0.0001" />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <InputF label="Teams (comma separated)" value={addForm.teams} onChange={e => setAF("teams", e.target.value)} placeholder="e.g. Kerala Cricket Academy, Mumbai Strikers" />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <OBtn onClick={handleAddCoach} style={{ flex: 1, justifyContent: "center" }}><Plus size={14} /> Add Coach</OBtn>
          <button onClick={() => setView(V.LIST)} style={{ flex: 1, padding: "10px", backgroundColor: "#fff", color: "#555", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );

  // ── DAY DETAIL ──
  if (view === V.DAY_DETAIL && selectedDay && activeCoach) {
    const c = coaches.find(x => x.id === activeCoach.id) || activeCoach;
    const dayActivities = c.activities[selectedDay] || [];
    const att = selectedAtt;
    const d = new Date(selectedDay);
    const label = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    return (
      <div style={{ padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
        <BackBtn label="Attendance Calendar" onClick={() => setView(V.DETAIL)} />
        <Heading title={label} sub={`${c.name} · ${c.role}`} />

        <div style={{ ...card({ padding: "18px 20px", marginBottom: "16px", borderLeft: att.present ? "4px solid #2e7d32" : "4px solid #cc3333" }), backgroundColor: att.present ? "#f0faf0" : "#fff0f0", border: `1px solid ${att.present ? "#b8e6b8" : "#ffc5c5"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {att.present ? <CheckCircle2 size={18} style={{ color: "#2e7d32" }} /> : <X size={18} style={{ color: "#cc3333" }} />}
            <span style={{ fontSize: "15px", fontWeight: "700", color: att.present ? "#2e7d32" : "#cc3333" }}>{att.present ? "Present" : "Absent"}</span>
            {att.checkin && <span style={{ fontSize: "12px", color: "#666" }}>Check-in: <b>{att.checkin}</b></span>}
            {att.checkout && <span style={{ fontSize: "12px", color: "#666" }}>Check-out: <b>{att.checkout}</b></span>}
            {att.location && <span style={{ fontSize: "12px", color: "#666" }}><MapPin size={11} style={{ display: "inline" }} /> {att.location}</span>}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>Activities ({dayActivities.length})</div>
          {att.present && <OBtn onClick={() => setShowAddAct(v => !v)} style={{ padding: "7px 14px", fontSize: "12px" }}><Plus size={13} /> Add Activity</OBtn>}
        </div>

        {showAddAct && (
          <div style={{ marginBottom: "16px" }}>
            <AddActivityForm date={selectedDay} onSave={handleAddActivity} onCancel={() => setShowAddAct(false)} />
          </div>
        )}

        {dayActivities.length === 0 ? (
          <div style={card({ padding: "32px", textAlign: "center" })}>
            <Activity size={28} style={{ color: "#ddd", margin: "0 auto 10px", display: "block" }} />
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#aaa" }}>No activities logged for this day</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {dayActivities.map((act) => {
              const fb = feedbackMap[act.id] || act.feedback;
              return (
                <div key={act.id} style={card({ padding: "18px 20px", borderLeft: "4px solid #2f9be0" })}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>{act.type}</span>
                        <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7" }}>{act.time}</span>
                        {act.duration && <span style={{ fontSize: "11px", color: "#888" }}>{act.duration}</span>}
                      </div>
                      <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.5" }}>{act.description}</div>
                      {act.players && <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>👥 {Array.isArray(act.players) ? act.players.join(", ") : act.players}</div>}
                    </div>
                  </div>

                  {fb ? (
                    <div style={{ marginTop: "10px", padding: "10px 14px", backgroundColor: "#f0faf0", border: "1px solid #b8e6b8", borderRadius: "8px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <MessageSquare size={14} style={{ color: "#2e7d32", flexShrink: 0, marginTop: "1px" }} />
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "700", color: "#2e7d32", marginBottom: "2px" }}>Client Feedback</div>
                        <div style={{ fontSize: "13px", color: "#444" }}>{fb}</div>
                      </div>
                    </div>
                  ) : (
                    feedbackFor === act.id ? (
                      <div style={{ marginTop: "10px" }}>
                        <textarea value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder="Enter client feedback..." rows={2}
                          style={{ ...inputStyle, resize: "none", marginBottom: "8px" }}
                          onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <OBtn onClick={() => submitFeedback(act.id)} style={{ flex: 1, justifyContent: "center", padding: "7px 14px", fontSize: "12px" }}><Send size={13} /> Send</OBtn>
                          <button onClick={() => setFeedbackFor(null)} style={{ flex: 1, padding: "7px 14px", backgroundColor: "#fff", color: "#555", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { setFeedbackFor(act.id); setFeedbackInput(""); }} style={{ marginTop: "10px", fontSize: "12px", color: "#2f9be0", background: "none", border: "none", cursor: "pointer", fontWeight: "600", padding: "0" }}>
                        <MessageSquare size={13} style={{ display: "inline", marginRight: "4px" }} /> Add feedback
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── DETAIL VIEW ──
  if (view === V.DETAIL && activeCoach) {
    const c = coaches.find(x => x.id === activeCoach.id) || activeCoach;

    return (
      <div style={{ padding: "28px", maxWidth: "1000px", margin: "0 auto" }}>
        <BackBtn label="All Coaches" onClick={() => setView(V.LIST)} />

        {/* Header */}
        <div style={{ ...card({ padding: "24px", marginBottom: "24px" }), display: "flex", alignItems: "flex-start", gap: "20px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "12px", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
            {c.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#222", margin: 0, marginBottom: "4px", fontFamily: "'Barlow Condensed', sans-serif" }}>{c.name}</h2>
            <p style={{ fontSize: "14px", color: "#888", margin: 0, marginBottom: "12px" }}>{c.role}</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#666" }}>
                <User size={14} /> {c.phone || "—"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#666" }}>
                <FileText size={14} /> {c.email || "—"}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "20px", backgroundColor: c.isOnline ? "#f0faf0" : "#fff0f0", border: `1px solid ${c.isOnline ? "#b8e6b8" : "#ffc5c5"}`, marginBottom: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: c.isOnline ? "#2e7d32" : "#cc3333" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", color: c.isOnline ? "#2e7d32" : "#cc3333" }}>{c.isOnline ? "Online" : "Offline"}</span>
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>Last seen: {c.lastSeen}</div>
            <div style={{ fontSize: "12px", color: c.insideAcademy ? "#2e7d32" : "#cc3333", fontWeight: "600", marginTop: "4px" }}>
              {c.insideAcademy ? "✓ Inside Zone" : "✗ Outside Zone"}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", borderBottom: "1px solid #e8e8e8", paddingBottom: "0" }}>
          {["overview", "attendance", "gps"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 16px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? "3px solid #2f9be0" : "3px solid transparent",
                fontSize: "13px",
                fontWeight: "700",
                color: activeTab === tab ? "#2f9be0" : "#888",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div style={card({ padding: "18px 20px" })}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>Academy</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>{c.academyName || "—"}</div>
                {c.academyLatitude && (
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "8px", fontFamily: "monospace" }}>
                    {c.academyLatitude?.toFixed(5)}, {c.academyLongitude?.toFixed(5)}
                  </div>
                )}
              </div>
              <div style={card({ padding: "18px 20px" })}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>Current Location</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>
                  {c.currentLatitude ? `${c.currentLatitude?.toFixed(5)}, ${c.currentLongitude?.toFixed(5)}` : "—"}
                </div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>
                  Allowed radius: {c.allowedRadius || 500}m
                </div>
              </div>
            </div>

            {c.teams && c.teams.length > 0 && (
              <div style={card({ padding: "18px 20px", marginBottom: "20px" })}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>Teams</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {c.teams.map((team, i) => (
                    <span key={i} style={{ padding: "4px 10px", backgroundColor: "#f0f0f0", border: "1px solid #e0e0e0", borderRadius: "20px", fontSize: "12px", color: "#555" }}>
                      {team}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <AttendanceCalendar coach={c} onDayClick={handleDayClick} />
        )}

        {/* GPS Tab */}
        {activeTab === "gps" && (
          <GpsWidget coach={c} />
        )}
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div style={{ padding: "28px", maxWidth: "1200px", margin: "0 auto" }}>
      <PageBanner title="Coach Dashboard" sub="Coaches, attendance & GPS" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "24px" }}>
        <OBtn onClick={() => setView(V.ADD)}>
          <Plus size={14} /> Add Coach
        </OBtn>
      </div>

      {toast && (
        <div style={{ padding: "12px 16px", backgroundColor: "#f0faf0", border: "1px solid #b8e6b8", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", color: "#2e7d32", fontWeight: "600" }}>
          {toast}
        </div>
      )}

      {coaches.length === 0 ? (
        <div style={card({ padding: "80px 40px", textAlign: "center" })}>
          <Users size={48} style={{ color: "#ddd", margin: "0 auto 16px", display: "block" }} />
          <p style={{ fontSize: "16px", fontWeight: "700", color: "#aaa", marginBottom: "16px" }}>No coaches yet</p>
          <OBtn onClick={() => setView(V.ADD)}><Plus size={14} /> Add your first coach</OBtn>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
            <button
              onClick={() => setShowOnlyOnline(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: showOnlyOnline ? "#2f9be0" : "#f0f0f0",
                color: showOnlyOnline ? "#fff" : "#666",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => !showOnlyOnline && (e.currentTarget.style.backgroundColor = "#e8e8e8")}
              onMouseLeave={e => !showOnlyOnline && (e.currentTarget.style.backgroundColor = "#f0f0f0")}
            >
              <Wifi size={13} style={{ display: "inline", marginRight: "6px" }} /> Online Only
            </button>
            <button
              onClick={() => setShowOnlyOnline(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: !showOnlyOnline ? "#2f9be0" : "#f0f0f0",
                color: !showOnlyOnline ? "#fff" : "#666",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => showOnlyOnline && (e.currentTarget.style.backgroundColor = "#e8e8e8")}
              onMouseLeave={e => showOnlyOnline && (e.currentTarget.style.backgroundColor = "#f0f0f0")}
            >
              <WifiOff size={13} style={{ display: "inline", marginRight: "6px" }} /> All Coaches
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {coaches.filter(c => !showOnlyOnline || c.isOnline).map((coach) => (
            <div
              key={coach._id}
              onClick={() => openCoach(coach)}
              style={{
                ...card({ padding: "20px" }),
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
                  {coach.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#222", margin: 0, marginBottom: "2px" }}>{coach.name}</h3>
                  <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{coach.role}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "16px", backgroundColor: coach.isOnline ? "#f0faf0" : "#fff0f0", border: `1px solid ${coach.isOnline ? "#b8e6b8" : "#ffc5c5"}` }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: coach.isOnline ? "#2e7d32" : "#cc3333" }} />
                  <span style={{ fontSize: "10px", fontWeight: "700", color: coach.isOnline ? "#2e7d32" : "#cc3333" }}>{coach.isOnline ? "Online" : "Offline"}</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "16px", backgroundColor: coach.insideAcademy ? "#f0faf0" : "#fff0f0", border: `1px solid ${coach.insideAcademy ? "#b8e6b8" : "#ffc5c5"}` }}>
                  <MapPin size={10} style={{ color: coach.insideAcademy ? "#2e7d32" : "#cc3333" }} />
                  <span style={{ fontSize: "10px", fontWeight: "700", color: coach.insideAcademy ? "#2e7d32" : "#cc3333" }}>{coach.insideAcademy ? "Inside" : "Outside"}</span>
                </div>
              </div>

              <div style={{ fontSize: "11px", color: "#888", paddingTop: "10px", borderTop: "1px solid #e8e8e8" }}>
                {coach.academyName && <div>{coach.academyName}</div>}
                <div>Last seen: {coach.lastSeen || "Never"}</div>
              </div>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
}
