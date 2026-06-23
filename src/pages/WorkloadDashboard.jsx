import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const WorkloadDashboard = ({ currentSections }) => {
  // Calculate workload metrics
  const workloadMetrics = useMemo(() => {
    let totalDuration = 0;
    let totalReps = 0;
    let totalSets = 0;
    let workoutCount = 0;
    const exerciseTypes = {};

    currentSections.forEach((section) => {
      section.workouts.forEach((workout) => {
        totalDuration += parseInt(workout.duration) || 0;
        totalReps += parseInt(workout.reps) || 0;
        totalSets += parseInt(workout.sets) || 0;
        workoutCount += 1;

        // Count exercise types
        const type = workout.name || "Unknown";
        exerciseTypes[type] = (exerciseTypes[type] || 0) + 1;
      });
    });

    // Prepare chart data
    const weekData = Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      load: Math.floor(Math.random() * 800 + 200),
      acwr: (Math.random() * 0.5 + 0.7).toFixed(2),
    }));

    const activityDistribution = Object.entries(exerciseTypes).map(([name, count]) => ({
      name,
      value: count,
    }));

    const plannedVsReported = Array.from({ length: 4 }, (_, i) => ({
      week: `Week ${i + 1}`,
      planned: Math.floor(Math.random() * 600 + 400),
      reported: Math.floor(Math.random() * 600 + 300),
    }));

    return {
      totalDuration,
      totalReps,
      totalSets,
      workoutCount,
      weekData,
      activityDistribution,
      plannedVsReported,
    };
  }, [currentSections]);

  const COLORS = ["#2f9be0", "#ffc107", "#4caf50", "#2196f3", "#9c27b0"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "12px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e8e8e8",
            padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#888", fontWeight: "600", marginBottom: "4px" }}>
            Total Duration
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#222" }}>
            {workloadMetrics.totalDuration} <span style={{ fontSize: "12px", color: "#aaa" }}>min</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e8e8e8",
            padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#888", fontWeight: "600", marginBottom: "4px" }}>
            Workouts
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#222" }}>
            {workloadMetrics.workoutCount}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e8e8e8",
            padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#888", fontWeight: "600", marginBottom: "4px" }}>
            Total Reps
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#222" }}>
            {workloadMetrics.totalReps}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e8e8e8",
            padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "11px", color: "#888", fontWeight: "600", marginBottom: "4px" }}>
            Total Sets
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#222" }}>
            {workloadMetrics.totalSets}
          </div>
        </div>
      </div>

      {/* Workload Line Chart */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e8e8e8",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <TrendingUp size={18} style={{ color: "#2f9be0" }} />
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>
            Weekly Workload
          </h3>
        </div>

        {workloadMetrics.weekData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workloadMetrics.weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#999" style={{ fontSize: "12px" }} />
              <YAxis stroke="#999" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="load"
                stroke="#2f9be0"
                strokeWidth={2}
                dot={{ fill: "#2f9be0", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="acwr"
                stroke="#4caf50"
                strokeWidth={2}
                yAxisId="right"
                dot={{ fill: "#4caf50", r: 4 }}
              />
              <YAxis yAxisId="right" orientation="right" stroke="#999" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              fontSize: "13px",
            }}
          >
            No data available
          </div>
        )}
      </div>

      {/* Planned vs Reported */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e8e8e8",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <TrendingUp size={18} style={{ color: "#2f9be0" }} />
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>
            Planned vs Reported
          </h3>
        </div>

        {workloadMetrics.plannedVsReported.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadMetrics.plannedVsReported}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#999" style={{ fontSize: "12px" }} />
              <YAxis stroke="#999" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="planned" fill="#2f9be0" />
              <Bar dataKey="reported" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              fontSize: "13px",
            }}
          >
            No data available
          </div>
        )}
      </div>

      {/* Activity Distribution */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e8e8e8",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <TrendingUp size={18} style={{ color: "#2f9be0" }} />
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>
            Distribution of Exercises
          </h3>
        </div>

        {workloadMetrics.activityDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workloadMetrics.activityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {workloadMetrics.activityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              fontSize: "13px",
            }}
          >
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkloadDashboard;
