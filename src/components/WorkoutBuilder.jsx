import { useState } from "react";
import { CheckCircle, Dumbbell, Target } from "lucide-react";

const exercisesList = [
  {
    id: 1,
    name: "Goblet Squats",
    category: "Lower Body Power",
    gif: "https://fitnessprogramer.com/wp-content/uploads/2023/01/Dumbbell-Goblet-Squat.gif",
    description: "Build explosive leg power for fast bowling & batting",
    muscle: "Quads, Glutes, Core",
  },
  {
    id: 2,
    name: "Dumbbell Lunges",
    category: "Leg Strength & Stability",
    gif: "https://burnfit.io/en/wp-content/uploads/sites/3/2026/01/DB_LUNGE-2.gif",
    description: "Improves single-leg strength and balance",
    muscle: "Quads, Hamstrings, Glutes",
  },
  {
    id: 3,
    name: "Push-ups (Diamond & Wide)",
    category: "Upper Body Strength",
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif",
    description: "Build chest, shoulders & triceps for powerful shots",
    muscle: "Chest, Shoulders, Triceps",
  },
  {
    id: 4,
    name: "Plank with Shoulder Taps",
    category: "Core Stability",
    gif: "https://burnfit.io/en/wp-content/uploads/sites/3/2026/01/SHD_TAP-1.gif",
    description: "Enhances core stability crucial for batting & bowling",
    muscle: "Core, Shoulders",
  },
  {
    id: 5,
    name: "Medicine Ball Rotational Throws",
    category: "Rotational Power",
    gif: "https://fitnessprogramer.com/wp-content/uploads/2023/12/Medicine-Ball-Rotational-Throw.gif",
    description: "Cricket-specific rotational power for batting",
    muscle: "Obliques, Core, Shoulders",
  },
  {
    id: 6,
    name: "Dead Hangs",
    category: "Grip & Shoulder Mobility",
    gif: "https://www.docteur-fitness.com/wp-content/uploads/2025/11/dead-hang-suspension-passive.gif",
    description: "Improves grip strength and shoulder stability",
    muscle: "Forearms, Shoulders, Back",
  },
  {
    id: 7,
    name: "Hip Flexor Stretch",
    category: "Mobility & Recovery",
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/08/Kneeling-Hip-Flexor-Stretch.gif",
    description: "Essential for fast bowlers and maintaining stride length",
    muscle: "Hip Flexors, Quads",
  },
  {
    id: 8,
    name: "Thoracic Rotation Stretch",
    category: "Mobility",
    gif: "https://fitnessprogramer.com/wp-content/uploads/2022/08/Kneeling-T-spine-Rotation.gif",
    description: "Improves upper body rotation for better batting swing",
    muscle: "Thoracic Spine, Obliques",
  },
];

const WorkoutBuilder = ({ onSave }) => {
  const [selected, setSelected] = useState([]);

  const toggleExercise = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((exId) => exId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const selectedExercises = exercisesList.filter((ex) =>
      selected.includes(ex.id)
    );
    onSave(selectedExercises);
    setSelected([]);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Exercise Grid — compact cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {exercisesList.map((exercise) => {
          const isSelected = selected.includes(exercise.id);

          return (
            <div
              key={exercise.id}
              onClick={() => toggleExercise(exercise.id)}
              style={{
                backgroundColor: isSelected ? "#e8f3fb" : "#ffffff",
                border: isSelected
                  ? "2px solid #2f9be0"
                  : "1.5px solid #e8e8e8",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.18s ease",
                boxShadow: isSelected
                  ? "0 2px 10px rgba(47, 155, 224,0.15)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  e.currentTarget.style.borderColor = "#2f9be0";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  e.currentTarget.style.borderColor = "#e8e8e8";
                e.currentTarget.style.boxShadow = isSelected
                  ? "0 2px 10px rgba(47, 155, 224,0.15)"
                  : "0 1px 3px rgba(0,0,0,0.05)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: "110px",
                  backgroundColor: "#f3f4f6",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={exercise.gif}
                  alt={exercise.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" fill="%23aaa" text-anchor="middle" dominant-baseline="middle"%3EExercise%3C/text%3E%3C/svg%3E';
                  }}
                />
                {/* Category badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "6px",
                    backgroundColor: "rgba(255,255,255,0.92)",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "2px 7px",
                    borderRadius: "20px",
                    color: "#2f9be0",
                    border: "1px solid #cfe6f7",
                  }}
                >
                  {exercise.category}
                </div>

                {/* Selected tick */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      backgroundColor: "#2f9be0",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle size={14} color="#fff" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "10px 12px 12px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "4px",
                    lineHeight: "1.3",
                  }}
                >
                  {exercise.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "4px",
                  }}
                >
                  <Target size={12} style={{ color: "#2f9be0", flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      fontWeight: "500",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {exercise.muscle}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "18px",
          borderTop: "1px solid #e8e8e8",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          {selected.length > 0 ? (
            <>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#333" }}>
                {selected.length}{" "}
                {selected.length === 1 ? "Exercise" : "Exercises"} selected
              </p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                Ready to save workout plan
              </p>
            </>
          ) : (
            <p style={{ fontSize: "13px", color: "#aaa", fontWeight: "500" }}>
              Select exercises above to get started
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={selected.length === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
            border: "none",
            cursor: selected.length > 0 ? "pointer" : "not-allowed",
            backgroundColor: selected.length > 0 ? "#2f9be0" : "#e0e0e0",
            color: selected.length > 0 ? "#ffffff" : "#aaa",
            transition: "background 0.15s",
            boxShadow:
              selected.length > 0 ? "0 2px 8px rgba(47, 155, 224,0.3)" : "none",
          }}
          onMouseEnter={(e) => {
            if (selected.length > 0)
              e.currentTarget.style.backgroundColor = "#2380c2";
          }}
          onMouseLeave={(e) => {
            if (selected.length > 0)
              e.currentTarget.style.backgroundColor = "#2f9be0";
          }}
        >
          <Dumbbell size={17} />
          Save Plan
        </button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
