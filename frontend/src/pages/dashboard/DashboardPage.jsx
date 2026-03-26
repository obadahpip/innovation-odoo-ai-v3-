import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import LanguageSwitcher from '../../components/common/LanguageSwitcher';


// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const colors = ["#714B67", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            backgroundColor: colors[i % colors.length],
            animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.8}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Progress ring ─────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 64, stroke = 6 }) {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#714B67" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-60 bg-white border-r border-gray-200 p-4 space-y-3 hidden md:block flex-shrink-0">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
      </div>
      <div className="flex-1 p-6 space-y-4 max-w-4xl">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    completed:   { label: "Done",     cls: "bg-green-100 text-green-700" },
    in_progress: { label: "Continue", cls: "bg-blue-100 text-blue-600"   },
    not_started: { label: "Start",    cls: "bg-gray-100 text-gray-500"   },
  };
  const { label, cls } = map[status] || map.not_started;
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${cls}`}>{label}</span>;
}

// ── Milestone card ────────────────────────────────────────────────────────────
function MilestoneCard({ pct, onDismiss }) {
  const milestones = { 25: "🌱", 50: "⚡", 75: "🔥", 100: "🏆" };
  const messages   = { 25: "Quarter way there!", 50: "Halfway! Keep going!", 75: "Almost there!", 100: "You completed the course!" };
  const emoji = milestones[pct];
  if (!emoji) return null;
  return (
    <div className="bg-gradient-to-r from-brand to-brand-dark text-white rounded-2xl p-5 mb-4 flex items-center gap-4 shadow-lg">
      <span className="text-4xl">{emoji}</span>
      <div className="flex-1">
        <div className="font-bold text-lg">{pct}% Complete!</div>
        <div className="text-purple-100 text-sm">{messages[pct]}</div>
      </div>
      <button onClick={onDismiss} className="text-white/60 hover:text-white text-xl leading-none">×</button>
    </div>
  );
}

const FILTER_OPTIONS = ["All", "Not Started", "In Progress", "Completed", "Intro Only"];
const SECTION_ICONS  = ["⚙️","💰","🤝","🌐","🏭","👥","📣","🛠️","📊"];

export default function DashboardPage() {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState({});
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("All");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [confetti, setConfetti]       = useState(false);
  const [milestone, setMilestone]     = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef(null);
  const prevPct   = useRef(0);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // ── Keyboard shortcut Cmd/Ctrl+K ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Load dashboard data ───────────────────────────────────────────────────
  useEffect(() => {
    api.get("/progress/dashboard/")
      .then((res) => {
        setData(res.data);
        if (res.data.sections?.length) {
          setExpanded({ [res.data.sections[0].id]: true });
          setActiveSectionId(res.data.sections[0].id);
        }
        const pct = res.data.overall_progress || 0;
        const milestones = [25, 50, 75, 100];
        for (const m of milestones) {
          if (pct >= m && prevPct.current < m) {
            setMilestone(m);
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3500);
            break;
          }
        }
        prevPct.current = pct;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Section completion toasts ─────────────────────────────────────────────
  useEffect(() => {
    if (!data) return;
    data.sections.forEach((sec) => {
      if (sec.completed_count === sec.total_count && sec.total_count > 0) {
        const key = `section_toast_${sec.id}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          toast.success(`🎉 Section ${sec.number} complete: ${sec.name}!`, { duration: 5000 });
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3500);
        }
      }
    });
  }, [data]);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  // ── Filtered lessons ──────────────────────────────────────────────────────
  const filterLesson = useCallback((file) => {
    const q = search.toLowerCase();
    const matchSearch = !q || file.title.toLowerCase().includes(q);
    const matchFilter =
      filter === "All"         ? true :
      filter === "Not Started" ? file.status === "not_started" :
      filter === "In Progress" ? file.status === "in_progress" :
      filter === "Completed"   ? file.status === "completed"   :
      filter === "Intro Only"  ? file.lesson_type === "intro"  : true;
    return matchSearch && matchFilter;
  }, [search, filter]);

  const hasActiveFilter = search || filter !== "All";

  if (loading) return <DashboardSkeleton />;
  if (!data)   return <div className="min-h-screen flex items-center justify-center text-gray-500">Could not load dashboard.</div>;

  const pct = data.overall_progress || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Confetti active={confetti} />

      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1">☰</button>
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white text-xs font-bold">O</div>
          <span className="font-semibold text-gray-800 text-sm hidden sm:block">Innovation Odoo AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/profile")}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-brand hover:text-brand transition hidden sm:block">
            Profile
          </button>
          <LanguageSwitcher />

          {/* Method 1 — opens simulator in new tab, no specific lesson */}
          {/*<button
            onClick={() => {
              const erpBase = import.meta.env.VITE_ERP_URL || (window.location.origin + '/erp');
              window.open(erpBase + '/lessons', '_blank');
            }}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition hover:opacity-90"
            style={{ background: '#714B67' }}
          >
            Odoo Simulator
          </button>*/}
          <button onClick={() => { logout(); navigate("/login"); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition">Logout</button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar ──────────────────────────────────────────────── */}
        <aside className={`
          w-60 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col overflow-y-auto
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 fixed md:relative h-full z-30 md:z-auto
        `}>
          {/* User + progress ring */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ProgressRing pct={pct} size={52} stroke={5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{pct}%</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {user?.first_name || user?.email?.split("@")[0] || "Learner"}
                </div>
                <div className="text-xs text-gray-400">{data.total_completed}/{data.total_files} lessons</div>
              </div>
            </div>
          </div>

          {/* Section nav */}
          <nav className="flex-1 p-3 space-y-0.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Sections</div>
            {data.sections.map((sec, i) => {
              const isActive = activeSectionId === sec.id;
              return (
                <button key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setExpanded((p) => ({ ...p, [sec.id]: true }));
                    setSidebarOpen(false);
                    setTimeout(() => {
                      document.getElementById(`section-${sec.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-all ${
                    isActive ? "bg-brand/10 text-brand" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base flex-shrink-0">{SECTION_ICONS[i]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{sec.name}</div>
                    <div className="text-[10px] text-gray-400">{sec.completed_count}/{sec.total_count}</div>
                  </div>
                  {sec.completed_count === sec.total_count && sec.total_count > 0 && (
                    <span className="text-green-500 text-xs flex-shrink-0">✓</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick links */}
          <div className="p-3 border-t border-gray-100 space-y-1">
            {pct === 100 && (
              <button onClick={() => navigate("/certificate")}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-brand hover:bg-brand/5 transition font-medium">
                <span>🏆</span> My Certificate
              </button>
            )}
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">

            {milestone && (
              <MilestoneCard pct={milestone} onDismiss={() => setMilestone(null)} />
            )}

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5 flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <ProgressRing pct={pct} size={72} stroke={6} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{pct}%</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900">
                  Welcome back{user?.first_name ? `, ${user.first_name}` : ""}!
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {data.total_completed} of {data.total_files} lessons completed
                </p>
                {data.continue_learning && (
                  <button
                    onClick={() => navigate(`/course/${data.continue_learning.file_id}`)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-dark transition"
                  >
                    Continue: {data.continue_learning.title} →
                  </button>
                )}
                {pct === 100 && (
                  <button
                    onClick={() => navigate("/certificate")}
                    className="mt-3 ml-2 inline-flex items-center gap-2 text-sm font-medium text-brand border border-brand px-4 py-1.5 rounded-lg hover:bg-brand/5 transition"
                  >
                    🏆 View Certificate
                  </button>
                )}
              </div>
            </div>

            {/* Search + filter bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    ref={searchRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search lessons… (Ctrl+K)"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  />
                  {search && (
                    <button onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">×</button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                      filter === f
                        ? "bg-brand text-white border-brand"
                        : "border-gray-200 text-gray-500 hover:border-brand hover:text-brand"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {data.sections.map((section, si) => {
                const visibleFiles = section.files.filter(filterLesson);
                if (hasActiveFilter && visibleFiles.length === 0) return null;

                const isOpen      = !!expanded[section.id];
                const secPct      = section.total_count
                  ? Math.round((section.completed_count / section.total_count) * 100) : 0;
                const filesToShow = hasActiveFilter ? visibleFiles : (isOpen ? section.files : []);

                return (
                  <div key={section.id} id={`section-${section.id}`}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Section header */}
                    <button
                      onClick={() => toggle(section.id)}
                      className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-sm font-bold flex-shrink-0 text-white">
                        {section.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base">{SECTION_ICONS[si]}</span>
                          <p className="font-semibold text-gray-900 text-sm">{section.name}</p>
                          {section.completed_count === section.total_count && section.total_count > 0 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Complete ✓</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {section.completed_count}/{section.total_count} lessons · {section.estimated_hours}h
                        </p>
                        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden w-40">
                          <div className="h-full bg-brand rounded-full transition-all duration-700"
                            style={{ width: `${secPct}%` }} />
                        </div>
                      </div>
                      <span className="text-gray-300 flex-shrink-0 text-sm">{isOpen ? "▲" : "▼"}</span>
                    </button>

                    {/* Lesson list */}
                    {(isOpen || hasActiveFilter) && filesToShow.length > 0 && (
                      <div className="border-t border-gray-100 divide-y divide-gray-50">
                        {filesToShow.map((file) => (
                          <div key={file.id} className="flex items-center hover:bg-gray-50 transition group">
                            {/* Main lesson button → goes to CoursePage */}
                            <button
                              onClick={() => navigate(`/course/${file.id}`)}
                              className="flex-1 px-5 py-3 flex items-center gap-3 text-left min-w-0"
                            >
                              <span className="text-base flex-shrink-0">
                                {file.status === "completed" ? "✅" : file.status === "in_progress" ? "▶️" : "⚪"}
                              </span>
                              <span className={`text-sm flex-1 min-w-0 truncate ${
                                file.status === "completed" ? "text-gray-400 line-through" : "text-gray-700"
                              }`}>
                                {file.title}
                              </span>
                              {file.lesson_type === "intro" && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-100 text-purple-700 flex-shrink-0">INTRO</span>
                              )}
                              <StatusBadge status={file.status} />
                            </button>

                            {/* Method 2 — only for completed non-intro lessons */}
                            {/*{file.status === "completed" && file.lesson_type !== "intro" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/simulate/${file.id}`);
                                }}
                                className="flex-shrink-0 mr-3 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition hover:opacity-80 whitespace-nowrap"
                                style={{ color: '#714B67', borderColor: '#714B67', background: 'rgba(113,75,103,0.06)' }}
                                title="Practice this lesson in the Odoo Simulator"
                              >
                                Try on Simulator
                              </button>
                            )}*/}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No results within section */}
                    {hasActiveFilter && visibleFiles.length === 0 && isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-400 text-center">
                        No matching lessons in this section
                      </div>
                    )}

                  </div>
                );
              })}

              {/* No results at all */}
              {hasActiveFilter && data.sections.every(s => s.files.filter(filterLesson).length === 0) && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-medium">No lessons match your search</p>
                  <button onClick={() => { setSearch(""); setFilter("All"); }}
                    className="mt-3 text-sm text-brand hover:underline">Clear filters</button>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
