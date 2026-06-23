import { useState, useEffect } from "react";
import { CheckCircle, Dumbbell, Plus, Edit2, Trash2, X } from "lucide-react";
import { PageBanner } from "../theme";
import { exitingExercises } from "../api/authApi";   // <-- your existing import

// If you have other API functions, import them too
// import { addExercise, updateExercise, deleteExercise } from "../api/authApi";

const ExerciseManager = () => {
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    jointArea: "",
    position: "",
    gif: "",
    description: "",
    muscle: "",
    difficulty: "",
    duration: "",
    reps: "",
  });

  // Fetch exercises
  const fetchExercises = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await exitingExercises();
      console.log(res.data, "Fetched Data");

      // FIXED: Backend returns { success, count, workouts: [...] }
      setExercises(res.data.workouts || []);
    } catch (err) {
      setError("Failed to load exercises. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // ====================== ADD ======================
  const handleAddExercise = async (newExercise) => {
    try {
      // Replace with your actual API call if available
      const res = await fetch("/api/exercises", {   // ← Change base URL if needed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExercise),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add");

      setExercises((prev) => [...prev, data.data || data]);
      alert("Exercise added successfully!");
    } catch (err) {
      alert("Failed to add exercise: " + err.message);
    }
  };

  // ====================== UPDATE ======================
  const handleEditExercise = async (updatedExercise) => {
    try {
      const res = await fetch(`/api/exercises/${updatedExercise._id || updatedExercise.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExercise),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      setExercises((prev) =>
        prev.map((ex) =>
          ex._id === (data.data?._id || updatedExercise._id) ? (data.data || updatedExercise) : ex
        )
      );
      alert("Exercise updated successfully!");
    } catch (err) {
      alert("Failed to update exercise: " + err.message);
    }
  };

  // ====================== DELETE ======================
  const handleDeleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;

    try {
      const res = await fetch(`/api/exercises/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setExercises((prev) => prev.filter((ex) => ex._id !== id && ex.id !== id));
      setSelected((prev) => prev.filter((exId) => exId !== id));
      alert("Exercise deleted successfully!");
    } catch (err) {
      alert("Failed to delete exercise: " + err.message);
    }
  };

  const openAddModal = () => {
    setEditingExercise(null);
    setFormData({
      name: "", category: "", jointArea: "", position: "", gif: "",
      description: "", muscle: "", difficulty: "", duration: "", reps: ""
    });
    setShowModal(true);
  };

  const openEditModal = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name || "",
      category: exercise.category || "",
      jointArea: exercise.jointArea || "",
      position: exercise.position || "",
      gif: exercise.gifUrl || exercise.gif || "",           // Handle both field names
      description: exercise.description || "",
      muscle: exercise.muscle || "",
      difficulty: exercise.difficulty || "",
      duration: exercise.duration || "",
      reps: exercise.reps || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExercise(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };

    if (editingExercise) {
      await handleEditExercise({ ...payload, _id: editingExercise._id });
    } else {
      await handleAddExercise(payload);
    }

    closeModal();
  };

  const toggleExercise = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((exId) => exId !== id) : [...prev, id]
    );
  };

  const handleSaveWorkout = () => {
    const selectedExercises = exercises.filter((ex) => selected.includes(ex._id || ex.id));
    console.log("Selected Workout Plan:", selectedExercises);
    alert(`Workout Plan Saved! ${selected.length} exercises.`);
    setSelected([]);
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ width: "100%", padding: "16px" }}>
      <PageBanner title="Exercises" sub="Workout & exercise library" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0, color: "#222", fontFamily: "'Barlow Condensed', sans-serif" }}>Exercise Library</h2>
        <button onClick={openAddModal} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "#2f9be0", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
          <Plus size={20} />
          Add New Exercise
        </button>
      </div>

      {/* Exercise Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {exercises.map((exercise) => {
          const id = exercise._id || exercise.id;
          const isSelected = selected.includes(id);

          return (
            <div key={id} style={{ backgroundColor: isSelected ? "#e8f3fb" : "#ffffff", border: isSelected ? "2px solid #2f9be0" : "1.5px solid #e8e8e8", borderRadius: "12px", overflow: "hidden", position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ height: "130px", backgroundColor: "#f3f4f6", position: "relative" }}>
                <img src={exercise.gifUrl || exercise.gif} alt={exercise.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" fill="%23aaa" text-anchor="middle" dominant-baseline="middle"%3ENo GIF%3C/text%3E%3C/svg%3E'; }} />

                {isSelected && (
                  <div style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: "#2f9be0", borderRadius: "50%", padding: "2px" }}>
                    <CheckCircle size={20} color="#fff" />
                  </div>
                )}
              </div>

              <div style={{ padding: "12px", cursor: "pointer" }} onClick={() => toggleExercise(id)}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ fontWeight: "700", fontSize: "15px", flex: 1, minWidth: 0 }}>{exercise.name}</div>
                  <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(exercise); }} title="Edit" style={{ background: "#e8f3fb", border: "none", width: "28px", height: "28px", borderRadius: "7px", display: "grid", placeItems: "center", cursor: "pointer" }}>
                      <Edit2 size={14} color="#2f9be0" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteExercise(id); }} title="Delete" style={{ background: "#fdecec", border: "none", width: "28px", height: "28px", borderRadius: "7px", display: "grid", placeItems: "center", cursor: "pointer" }}>
                      <Trash2 size={14} color="#cc3333" />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#2f9be0", marginBottom: "8px" }}>{exercise.category}</div>

                {exercise.jointArea && <div style={{ fontSize: "12px", color: "#555" }}><strong>Joint/Area:</strong> {exercise.jointArea}</div>}
                {exercise.position && <div style={{ fontSize: "12px", color: "#555" }}><strong>Position:</strong> {exercise.position}</div>}

                <div style={{ fontSize: "12.5px", color: "#666", marginTop: "8px" }}>{exercise.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <button onClick={handleSaveWorkout} style={{ backgroundColor: "#2f9be0", color: "white", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <Dumbbell size={20} />
            Save Selected as Workout Plan ({selected.length})
          </button>
        </div>
      )}

      {/* Modal remains same as before (with extra fields) */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={closeModal}>
          <div style={{ background: "white", borderRadius: "12px", width: "90%", maxWidth: "520px", maxHeight: "92vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>{editingExercise ? "Edit Exercise" : "Add New Exercise"}</h3>
              <button onClick={closeModal}><X size={26} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Exercise Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Joint / Area</label>
                <input type="text" name="jointArea" value={formData.jointArea} onChange={handleInputChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Position</label>
                <input type="text" name="position" value={formData.position} onChange={handleInputChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>GIF URL *</label>
                <input type="url" name="gif" value={formData.gif} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Muscle Groups</label>
                <input type="text" name="muscle" value={formData.muscle} onChange={handleInputChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "8px", background: "white" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "12px", backgroundColor: "#2f9be0", color: "white", border: "none", borderRadius: "8px", fontWeight: "700" }}>
                  {editingExercise ? "Update Exercise" : "Add Exercise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseManager;