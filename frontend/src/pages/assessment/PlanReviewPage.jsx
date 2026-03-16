import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function PlanReviewPage() {
  const [plan, setPlan] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/assessment/").then((res) => {
      if (!res.data.study_plan) {
        navigate("/assessment");
        return;
      }
      setPlan(res.data.study_plan);
      setSections(res.data.study_plan.sections_detail || []);
    }).catch(() => navigate("/assessment"))
      .finally(() => setLoading(false));
  }, []);

  const removeSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...sections];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSections(updated);
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSections(updated);
  };

  const totalPrice = sections.reduce((sum, s) => sum + (s.price || 0), 0);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await api.post("/assessment/finalize/", {
        sections_ordered: sections.map((s) => s.id),
      });
      navigate("/payment");
    } catch (err) {
      alert("Failed to save plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading your plan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📋</div>
          <h1 className="text-2xl font-bold text-gray-900">Your Learning Plan</h1>
          <p className="text-gray-500 mt-1">Review and customize your sections before payment</p>
        </div>

        {/* Section Cards */}
        <div className="space-y-3 mb-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4 shadow-sm"
            >
              {/* Order badge */}
              <div
                className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#714B67" }}
              >
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{section.name}</p>
                <p className="text-xs text-gray-400">{section.file_count} lessons · {section.price} JOD</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === sections.length - 1}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeSection(section.id)}
                  className="p-1.5 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition ml-1"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No sections selected. Go back and retake the assessment.
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total sections</span>
            <span className="font-semibold text-gray-900">{sections.length}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Total price</span>
            <span className="text-xl font-bold" style={{ color: "#714B67" }}>{totalPrice.toFixed(2)} JOD</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={saving || sections.length === 0}
          className="w-full py-3 rounded-xl text-white font-semibold text-base transition hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: "#714B67" }}
        >
          {saving ? "Saving..." : "Confirm Plan & Proceed to Payment →"}
        </button>

        <button
          onClick={() => navigate("/assessment")}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
        >
          ← Retake Assessment
        </button>
      </div>
    </div>
  );
}