import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import toast from "react-hot-toast";
import OdooPanel from "../../components/course/OdooPanel";

const PURPLE = "#714B67";

// ── Skeleton loader ───────────────────────────────────────────────────────────
function CourseSkeleton() {
  return (
    <div className="flex flex-col bg-gray-100 overflow-hidden" style={{ height: "100dvh" }}>
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-shrink-0 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>
      <div className="h-1 bg-gray-200 flex-shrink-0">
        <div className="h-full w-1/4 bg-gray-300 rounded" />
      </div>
      <div className="flex flex-1 overflow-hidden animate-pulse">
        <div className="w-56 bg-white border-r border-gray-200 p-3 space-y-2 hidden md:block flex-shrink-0">
          {[...Array(8)].map((_, i) => <div key={i} className="h-7 bg-gray-200 rounded-lg" />)}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden bg-white p-6 gap-4">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-7 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Keyboard shortcut modal ───────────────────────────────────────────────────
function ShortcutModal({ onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center">×</button>
        </div>
        <div className="space-y-3">
          {[
            { keys: ["←"],   desc: "Previous slide" },
            { keys: ["→"],   desc: "Next slide" },
            { keys: ["Esc"], desc: "Exit lesson" },
            { keys: ["?"],   desc: "Show shortcuts" },
          ].map(({ keys, desc }) => (
            <div key={desc} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{desc}</span>
              <div className="flex gap-1">
                {keys.map((k) => (
                  <kbd key={k} className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded font-mono">{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Exit confirmation dialog ──────────────────────────────────────────────────
function ExitDialog({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🚪</div>
        <h3 className="font-bold text-gray-900 mb-2">Exit lesson?</h3>
        <p className="text-sm text-gray-500 mb-5">Your progress is saved. You can resume from where you left off.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}  className="flex-1 btn-secondary text-sm min-h-[44px]">Stay</button>
          <button onClick={onConfirm} className="flex-1 btn-primary text-sm min-h-[44px]">Exit</button>
        </div>
      </div>
    </div>
  );
}

// ── Table of Contents sidebar ─────────────────────────────────────────────────
function ToCPanel({ slides, currentIndex, passedIndex, onSelect, collapsed, onToggle }) {
  return (
    <div className={`flex-shrink-0 bg-white border-r border-gray-200 flex-col transition-all duration-200 hidden md:flex
      ${collapsed ? "w-10" : "w-56"}`}>
      <button onClick={onToggle}
        className="flex items-center justify-center h-11 border-b border-gray-100 text-gray-400 hover:text-gray-600 transition flex-shrink-0 min-h-[44px]"
        title={collapsed ? "Expand" : "Collapse"}>
        {collapsed ? "›" : "‹"}
      </button>
      {!collapsed && (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Contents</div>
            {slides.map((slide, i) => {
              const isCurrent = i === currentIndex;
              const isPassed  = i <= passedIndex;
              return (
                <button key={slide.id} onClick={() => onSelect(i)}
                  className={`w-full flex items-start gap-2 px-2 py-2 rounded-lg text-left transition-all min-h-[44px] ${
                    isCurrent ? "bg-brand/10 text-brand" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span className="flex-shrink-0 mt-0.5 text-xs">
                    {isPassed && !isCurrent ? "✓" : isCurrent ? "▶" : "○"}
                  </span>
                  <span className={`text-xs leading-snug line-clamp-2 ${
                    isCurrent ? "font-semibold" : isPassed ? "text-gray-400" : ""
                  }`}>
                    {slide.is_intro ? "📖 " : ""}{slide.is_conclusion ? "✅ " : ""}{slide.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI bottom sheet (mobile) ──────────────────────────────────────────────────
function AIBottomSheet({ slide, currentSlide, totalSlides, open, onClose }) {
  const [mode, setMode]         = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => { setMode(null); setMessages([]); setQuestion(""); }, [slide?.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSimplify = async () => {
    setMode("simplify"); setLoading(true); setMessages([]);
    try {
      const res = await api.post("/content/slides/simplify/", { slide_id: slide.id });
      setMessages([{ role: "assistant", content: res.data.simplified }]);
    } catch {
      setMessages([{ role: "assistant", content: "Sorry, couldn't simplify right now." }]);
    } finally { setLoading(false); }
  };

  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion("");
    setMode("ask");
    const newMessages = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await api.post("/content/slides/ask/", {
        slide_id: slide.id, question: q, history: newMessages.slice(-4),
      });
      setMessages([...newMessages, { role: "assistant", content: res.data.answer }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, couldn't respond." }]);
    } finally { setLoading(false); }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl lg:hidden flex flex-col"
        style={{ maxHeight: "75dvh" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PURPLE }}>AI</div>
          <span className="text-sm font-medium text-gray-700">AI Tutor</span>
          <span className="text-xs text-gray-400 ml-auto">Slide {currentSlide}/{totalSlides}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2 w-8 h-8 flex items-center justify-center text-lg">×</button>
        </div>
        <div className="px-4 py-3 flex gap-2 border-b border-gray-100 flex-shrink-0">
          <button onClick={handleSimplify} disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-xs font-medium border transition disabled:opacity-50 min-h-[44px]"
            style={mode === "simplify" ? { backgroundColor: PURPLE, color: "white", borderColor: PURPLE } : { borderColor: "#e5e7eb", color: "#374151" }}>
            Simplify this
          </button>
          <button onClick={() => { setMode("ask"); setMessages([]); }} disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-xs font-medium border transition disabled:opacity-50 min-h-[44px]"
            style={mode === "ask" ? { backgroundColor: PURPLE, color: "white", borderColor: PURPLE } : { borderColor: "#e5e7eb", color: "#374151" }}>
            Ask a question
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {!mode && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-8">
              <div className="text-2xl">💡</div>
              <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">Simplify this slide or ask a question about it.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                msg.role === "user" ? "text-white" : "bg-gray-100 text-gray-700"
              }`} style={msg.role === "user" ? { backgroundColor: PURPLE } : {}}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl px-3 py-2 flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {mode === "ask" && (
          <div className="px-4 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input value={question} onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
              placeholder="Ask about this slide…"
              className="flex-1 text-xs px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            />
            <button onClick={handleAsk} disabled={!question.trim() || loading}
              className="px-3 rounded-lg text-white text-xs font-medium disabled:opacity-40 min-h-[44px] min-w-[44px]"
              style={{ backgroundColor: PURPLE }}>
              →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── AI panel (desktop sidebar) ────────────────────────────────────────────────
function AIPanel({ slide, currentSlide, totalSlides }) {
  const [mode, setMode]         = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => { setMode(null); setMessages([]); setQuestion(""); }, [slide?.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const handleSimplify = async () => {
    setMode("simplify"); setLoading(true); setMessages([]);
    try {
      const res = await api.post("/content/slides/simplify/", { slide_id: slide.id });
      setMessages([{ role: "assistant", content: res.data.simplified }]);
    } catch {
      setMessages([{ role: "assistant", content: "Sorry, couldn't simplify right now. Please try again." }]);
    } finally { setLoading(false); }
  };

  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion("");
    setMode("ask");
    const newMessages = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await api.post("/content/slides/ask/", {
        slide_id: slide.id, question: q, history: newMessages.slice(-4),
      });
      setMessages([...newMessages, { role: "assistant", content: res.data.answer }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, couldn't respond. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2 min-h-[44px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PURPLE }}>AI</div>
        <span className="text-sm font-medium text-gray-700">AI Tutor</span>
        <span className="text-xs text-gray-400 ml-auto">Slide {currentSlide}/{totalSlides}</span>
      </div>
      <div className="px-4 py-3 flex gap-2 border-b border-gray-100 bg-white">
        <button onClick={handleSimplify} disabled={loading}
          className="flex-1 py-2 rounded-lg text-xs font-medium border transition disabled:opacity-50 min-h-[44px]"
          style={mode === "simplify" ? { backgroundColor: PURPLE, color: "white", borderColor: PURPLE } : { borderColor: "#e5e7eb", color: "#374151" }}>
          Simplify this
        </button>
        <button onClick={() => { setMode("ask"); setMessages([]); }} disabled={loading}
          className="flex-1 py-2 rounded-lg text-xs font-medium border transition disabled:opacity-50 min-h-[44px]"
          style={mode === "ask" ? { backgroundColor: PURPLE, color: "white", borderColor: PURPLE } : { borderColor: "#e5e7eb", color: "#374151" }}>
          Ask a question
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {!mode && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="text-2xl">💡</div>
            <p className="text-xs text-gray-400 max-w-[180px] leading-relaxed">Use the buttons above to simplify this slide or ask a question about it.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
              msg.role === "user" ? "text-white" : "bg-white border border-gray-200 text-gray-700"
            }`} style={msg.role === "user" ? { backgroundColor: PURPLE } : {}}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {mode === "ask" && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white flex gap-2">
          <input value={question} onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
            placeholder="Ask about this slide…"
            className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
          />
          <button onClick={handleAsk} disabled={!question.trim() || loading}
            className="px-3 py-2 rounded-lg text-white text-xs font-medium transition hover:opacity-90 disabled:opacity-40 min-h-[44px] min-w-[44px]"
            style={{ backgroundColor: PURPLE }}>
            →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Markdown renderer ─────────────────────────────────────────────────────────
function SlideContent({ text }) {
  if (!text) return null;
  return (
    <div className="space-y-2">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: PURPLE }} />
              <span className="text-gray-700 text-sm leading-relaxed">{renderInline(line.replace(/^[\s•\-]+/, ""))}</span>
            </div>
          );
        }
        return <p key={i} className="text-gray-700 text-sm leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
      : part
  );
}

// ── Main CoursePage ───────────────────────────────────────────────────────────
export default function CoursePage() {
  const { fileId } = useParams();
  const navigate   = useNavigate();

  const [lesson,         setLesson]        = useState(null);
  const [slides,         setSlides]        = useState([]);
  const [currentIndex,   setCurrentIndex]  = useState(0);
  const [passedIndex,    setPassedIndex]   = useState(0);
  const [loading,        setLoading]       = useState(true);
  const [error,          setError]         = useState(null);
  const [showComplete,   setShowComplete]  = useState(false);
  const [tocCollapsed,   setTocCollapsed]  = useState(false);
  const [showShortcuts,  setShowShortcuts] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [aiSheetOpen,    setAiSheetOpen]   = useState(false);

  // ── V3: Odoo task state ──────────────────────────────────────────────────
  const [odooPath, setOdooPath] = useState('');
  const [odooTask, setOdooTask] = useState('');

  // ── Load lesson ──────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get(`/content/files/${fileId}/`),
      api.get(`/content/files/${fileId}/slides/`),
    ])
      .then(([lessonRes, slidesRes]) => {
        setLesson(lessonRes.data);
        const s = slidesRes.data.slides || [];
        setSlides(s);

        // ── V3: read odoo task fields from slides response ─────────────────
        setOdooPath(slidesRes.data.odoo_path || '');
        setOdooTask(slidesRes.data.odoo_task || '');

        api.get("/progress/dashboard/")
          .then((res) => {
            const allFiles     = res.data.sections?.flatMap((sec) => sec.files) || [];
            const fileProgress = allFiles.find((f) => f.id === parseInt(fileId));
            if (fileProgress?.last_slide_index) {
              const idx = Math.min(fileProgress.last_slide_index, s.length - 1);
              setCurrentIndex(idx);
              setPassedIndex(idx);
            }
          })
          .catch(() => {});
        api.post("/progress/update/", { file_id: parseInt(fileId), slide_index: 0 }).catch(() => {});
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          toast.error("Lesson not found.");
          navigate("/dashboard");
        } else {
          setError("Could not load this lesson. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [fileId]);

  // ── Navigation ───────────────────────────────────────────────────────────
  const goTo = useCallback((index) => {
    setCurrentIndex(index);
    setPassedIndex((p) => Math.max(p, index));
    api.post("/progress/update/", { file_id: parseInt(fileId), slide_index: index }).catch(() => {});
  }, [fileId]);

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      goTo(currentIndex + 1);
    } else {
      api.post("/progress/update/", {
        file_id: parseInt(fileId), slide_index: currentIndex, completed: true,
      }).catch(() => {});
      setShowComplete(true);
    }
  }, [currentIndex, slides.length, fileId, goTo]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (showExitDialog || showShortcuts) return;
      if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); handlePrev(); }
      if (e.key === "?")          { setShowShortcuts(true); }
      if (e.key === "Escape")     { setShowExitDialog(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNext, handlePrev, showExitDialog, showShortcuts]);

  // ── Early returns ────────────────────────────────────────────────────────
  if (loading) return <CourseSkeleton />;

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Couldn't load lesson</h2>
      <p className="text-gray-500 text-sm mb-6">{error}</p>
      <div className="flex gap-3">
        <button onClick={() => window.location.reload()} className="btn-primary text-sm min-h-[44px]">Retry</button>
        <button onClick={() => navigate("/dashboard")}   className="btn-secondary text-sm min-h-[44px]">Dashboard</button>
      </div>
    </div>
  );

  // ── Lesson complete screen (V3) ──────────────────────────────────────────
  if (showComplete) {
    const isIntro = lesson?.lesson_type === "intro";

    return (
      <div className="min-h-screen bg-gray-50 overflow-y-auto">
        {/* Top bar — back nav */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-400 hover:text-gray-700 transition flex items-center gap-1"
          >
            ← Dashboard
          </button>
          <span className="text-sm font-medium text-gray-600 truncate max-w-xs">{lesson?.title}</span>
          <div className="w-20" />
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

          {/* Celebration header */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
            <p className="text-sm text-gray-500">
              You finished <strong>{lesson?.title}</strong>.
            </p>
            {isIntro && (
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 btn-primary min-h-[44px] px-8"
              >
                Back to Dashboard
              </button>
            )}
          </div>

          {/* V3: OdooPanel — only for non-intro lessons */}
          {!isIntro && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Now practise in Odoo
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <OdooPanel
                fileId={fileId}
                odooPath={odooPath}
                odooTask={odooTask}
              />

              <div className="text-center pb-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm text-gray-400 hover:text-gray-600 transition underline"
                >
                  Skip — Back to Dashboard
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    );
  }

  const slide    = slides[currentIndex];
  const progress = slides.length > 0 ? ((currentIndex + 1) / slides.length) * 100 : 0;

  return (
    <div className="flex flex-col bg-gray-100 overflow-hidden" style={{ height: "100dvh" }}>

      {showShortcuts  && <ShortcutModal onClose={() => setShowShortcuts(false)} />}
      {showExitDialog && <ExitDialog onConfirm={() => navigate("/dashboard")} onCancel={() => setShowExitDialog(false)} />}

      {/* Mobile AI bottom sheet */}
      <AIBottomSheet
        slide={slide}
        currentSlide={currentIndex + 1}
        totalSlides={slides.length}
        open={aiSheetOpen}
        onClose={() => setAiSheetOpen(false)}
      />

      {/* ── Breadcrumb bar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 py-0 flex items-center justify-between flex-shrink-0 min-h-[44px]">
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0 py-2">
          <button onClick={() => navigate("/dashboard")}
            className="hover:text-gray-800 transition flex-shrink-0 min-h-[44px] flex items-center">
            Dashboard
          </button>
          <span className="flex-shrink-0">›</span>
          <span className="text-gray-800 font-medium truncate text-xs sm:text-sm">{lesson?.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-xs text-gray-400 hidden sm:block">{currentIndex + 1} / {slides.length}</span>
          <button onClick={() => setAiSheetOpen(true)}
            className="lg:hidden text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-brand hover:text-brand transition min-h-[44px] flex items-center">
            💡 AI
          </button>
          <button onClick={() => setShowShortcuts(true)}
            className="text-xs text-gray-400 hover:text-gray-600 transition hidden sm:flex items-center min-h-[44px] px-1"
            title="Keyboard shortcuts">?</button>
          <button onClick={() => setShowExitDialog(true)}
            className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center min-h-[44px] px-1">
            ✕ Exit
          </button>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="h-1 bg-gray-200 flex-shrink-0">
        <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: PURPLE }} />
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ToC sidebar — desktop only */}
        <ToCPanel
          slides={slides}
          currentIndex={currentIndex}
          passedIndex={passedIndex}
          onSelect={goTo}
          collapsed={tocCollapsed}
          onToggle={() => setTocCollapsed((c) => !c)}
        />

        {/* Slide viewer */}
        <div className="flex flex-col overflow-hidden flex-1 bg-white">

          {/* Slide badge */}
          <div className="flex-shrink-0 px-4 sm:px-8 pt-4 sm:pt-6 pb-2">
            {slide?.is_intro      && <span className="text-xs font-semibold px-2 py-1 rounded-md bg-purple-100 text-purple-700">Introduction</span>}
            {slide?.is_conclusion && <span className="text-xs font-semibold px-2 py-1 rounded-md bg-green-100 text-green-700">Key Takeaways</span>}
            {!slide?.is_intro && !slide?.is_conclusion && (
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-500">Slide {slide?.slide_number}</span>
            )}
          </div>

          {/* Slide content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-4">
            {slide ? (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 leading-snug">{slide.title}</h2>
                <SlideContent text={slide.content} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">No slides available.</p>
              </div>
            )}
          </div>

          {/* Slide dots */}
          {slides.length > 1 && (
            <div className="flex-shrink-0 px-4 sm:px-8 py-3 flex items-center gap-1.5 overflow-x-auto bg-white">
              {slides.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className="flex-shrink-0 rounded-full transition-all duration-200 min-w-[6px] min-h-[20px] flex items-center"
                  style={{
                    width: i === currentIndex ? "20px" : "6px",
                    height: "6px",
                    backgroundColor: i <= passedIndex ? PURPLE : "#d1d5db",
                    opacity: i === currentIndex ? 1 : i <= passedIndex ? 0.5 : 0.3,
                  }}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex-shrink-0 px-4 sm:px-8 py-3 border-t border-gray-200 bg-white flex items-center gap-3">
            <button onClick={handlePrev} disabled={currentIndex === 0}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition min-h-[44px]">
              ← Prev
            </button>
            <div className="flex-1 text-center hidden sm:block">
              <span className="text-xs text-gray-400">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">?</kbd> for shortcuts
              </span>
            </div>
            <button onClick={handleNext}
              className="px-5 sm:px-6 py-2.5 text-sm text-white rounded-lg font-medium transition hover:opacity-90 min-h-[44px]"
              style={{ backgroundColor: PURPLE }}>
              {currentIndex === slides.length - 1 ? "Complete ✓" : "Next →"}
            </button>
          </div>
        </div>

        {/* AI panel — desktop only */}
        <div className="border-l border-gray-200 overflow-hidden hidden lg:block flex-shrink-0" style={{ width: "35%" }}>
          {slide && <AIPanel slide={slide} currentSlide={currentIndex + 1} totalSlides={slides.length} />}
        </div>

      </div>
    </div>
  );
}