import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";

const PURPLE = "#714B67";

function ProgressRing({ pct, size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={PURPLE} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed:   { label: "Done",     cls: "bg-green-100 text-green-700" },
    in_progress: { label: "Continue", cls: "bg-blue-100 text-blue-600"   },
    not_started: { label: "Start",    cls: "bg-gray-100 text-gray-500"   },
  };
  const { label, cls } = map[status] || map.not_started;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${cls}`}>
      {label}
    </span>
  );
}

function LessonTypePill({ type }) {
  if (type !== "intro") return null;
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-100 text-purple-700 flex-shrink-0">
      INTRO
    </span>
  );
}

export default function DashboardPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const { user, logout }      = useAuthStore();
  const navigate              = useNavigate();

  useEffect(() => {
    api.get("/progress/dashboard/")
      .then((res) => {
        setData(res.data);
        // Auto-expand first section
        if (res.data.sections?.length) {
          setExpanded({ [res.data.sections[0].id]: true });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: PURPLE }} />
        <p className="text-sm text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Could not load dashboard. Please refresh.</p>
    </div>
  );

  const pct = data.overall_progress || 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top nav ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PURPLE }}>
            O
          </div>
          <span className="font-semibold text-gray-800 text-sm">Innovation Odoo AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/plan")}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700 transition"
          >
            My Plan
          </button>
          <span className="text-xs text-gray-400">{user?.email}</span>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-xs text-gray-400 hover:text-gray-600 transition">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={pct} size={72} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-800">{pct}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900">
              Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {data.total_completed} of {data.total_files} lessons completed across 9 sections
            </p>
            {data.continue_learning && (
              <button
                onClick={() => navigate(`/course/${data.continue_learning.file_id}`)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white px-4 py-1.5 rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: PURPLE }}
              >
                Continue: {data.continue_learning.title}
                <span>→</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Sections ── */}
        <div className="space-y-3">
          {data.sections.map((section) => {
            const isOpen = !!expanded[section.id];
            const sectionPct = section.total_count
              ? Math.round((section.completed_count / section.total_count) * 100)
              : 0;

            return (
              <div key={section.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Section header */}
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                    style={{ backgroundColor: PURPLE }}
                  >
                    {section.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm">{section.name}</p>
                      {section.completed_count === section.total_count && section.total_count > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {section.completed_count}/{section.total_count} lessons · {section.estimated_hours}h
                    </p>
                    {/* Progress bar */}
                    <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden w-48">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${sectionPct}%`, backgroundColor: PURPLE }}
                      />
                    </div>
                  </div>

                  <span className="text-gray-300 flex-shrink-0 text-sm">{isOpen ? "▲" : "▼"}</span>
                </button>

                {/* Lesson list */}
                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {section.files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => navigate(`/course/${file.id}`)}
                        className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left group"
                      >
                        <span className="text-base flex-shrink-0">
                          {file.status === "completed" ? "✅" : file.status === "in_progress" ? "▶️" : "⚪"}
                        </span>
                        <span className={`text-sm flex-1 min-w-0 truncate ${
                          file.status === "completed" ? "text-gray-400 line-through" : "text-gray-700"
                        }`}>
                          {file.title}
                        </span>
                        <LessonTypePill type={file.lesson_type} />
                        <StatusBadge status={file.status} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
