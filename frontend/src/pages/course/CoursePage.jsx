import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";

const PURPLE = "#714B67";

// ── Markdown-lite renderer (bold, bullet lines) ───────────────────────────────
function SlideContent({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        // Bullet
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: PURPLE }} />
              <span className="text-gray-700 text-sm leading-relaxed">
                {renderInline(line.replace(/^[\s•\-]+/, ""))}
              </span>
            </div>
          );
        }
        return (
          <p key={i} className="text-gray-700 text-sm leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
      : part
  );
}

// ── AI panel ─────────────────────────────────────────────────────────────────
function AIPanel({ slide, fileId, currentSlide, totalSlides }) {
  const [mode, setMode]         = useState(null); // null | "simplify" | "ask"
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  // Reset panel when slide changes
  useEffect(() => {
    setMode(null);
    setMessages([]);
    setQuestion("");
  }, [slide?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSimplify = async () => {
    setMode("simplify");
    setLoading(true);
    setMessages([]);
    try {
      const res = await api.post("/content/slides/simplify/", { slide_id: slide.id });
      setMessages([{ role: "assistant", content: res.data.simplified }]);
    } catch {
      setMessages([{ role: "assistant", content: "Sorry, couldn't simplify right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
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
        slide_id: slide.id,
        question: q,
        history: newMessages.slice(-4),
      });
      setMessages([...newMessages, { role: "assistant", content: res.data.answer }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, couldn't respond. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* AI header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PURPLE }}>
          AI
        </div>
        <span className="text-sm font-medium text-gray-700">AI Tutor</span>
        <span className="text-xs text-gray-400 ml-auto">Slide {currentSlide}/{totalSlides}</span>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 flex gap-2 border-b border-gray-100 bg-white">
        <button
          onClick={handleSimplify}
          disabled={loading}
          className="flex-1 py-2 rounded-lg text-xs font-medium border transition disabled:opacity-50"
          style={mode === "simplify"
            ? { backgroundColor: PURPLE, color: "white", borderColor: PURPLE }
            : { borderColor: "#e5e7eb", color: "#374151" }}
        >
          Simplify this
        </button>
        <button
          onClick={() => { setMode("ask"); setMessages([]); }}
          disabled={loading}
          className="flex-1 py-2 rounded-lg text-xs font-medium border transition disabled:opacity-50"
          style={mode === "ask"
            ? { backgroundColor: PURPLE, color: "white", borderColor: PURPLE }
            : { borderColor: "#e5e7eb", color: "#374151" }}
        >
          Ask a question
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {!mode && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="text-2xl">💡</div>
            <p className="text-xs text-gray-400 max-w-[180px] leading-relaxed">
              Use the buttons above to simplify this slide or ask a question about it.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
              msg.role === "user"
                ? "text-white rounded-br-sm"
                : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm shadow-sm"
            }`}
              style={msg.role === "user" ? { backgroundColor: PURPLE } : {}}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Ask input */}
      {(mode === "ask" || !mode) && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
              placeholder="Ask about this slide..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-300 bg-gray-50"
            />
            <button
              onClick={handleAsk}
              disabled={!question.trim() || loading}
              className="px-3 py-2 rounded-lg text-white text-xs font-medium transition hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: PURPLE }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main CoursePage ───────────────────────────────────────────────────────────
export default function CoursePage() {
  const { fileId }   = useParams();
  const navigate     = useNavigate();

  const [lesson,       setLesson]       = useState(null);
  const [slides,       setSlides]       = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/content/files/${fileId}/`),
      api.get(`/content/files/${fileId}/slides/`),
    ])
      .then(([lessonRes, slidesRes]) => {
        setLesson(lessonRes.data);
        setSlides(slidesRes.data.slides || []);
        // Resume from last slide
        api.get("/progress/dashboard/")
          .then((res) => {
            const allFiles = res.data.sections?.flatMap((s) => s.files) || [];
            const fileProgress = allFiles.find((f) => f.id === parseInt(fileId));
            if (fileProgress?.last_slide_index) {
              setCurrentIndex(Math.min(fileProgress.last_slide_index, (slidesRes.data.slides?.length || 1) - 1));
            }
          })
          .catch(() => {});
        // Mark in progress
        api.post("/progress/update/", { file_id: parseInt(fileId), slide_index: 0 }).catch(() => {});
      })
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [fileId]);

  const goTo = (index) => {
    setCurrentIndex(index);
    api.post("/progress/update/", { file_id: parseInt(fileId), slide_index: index }).catch(() => {});
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      goTo(currentIndex + 1);
    } else {
      api.post("/progress/update/", {
        file_id: parseInt(fileId),
        slide_index: currentIndex,
        completed: true,
      }).catch(() => {});
      setShowComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: PURPLE }} />
    </div>
  );

  const slide   = slides[currentIndex];
  const progress = slides.length > 0 ? ((currentIndex + 1) / slides.length) * 100 : 0;

  // ── Lesson complete overlay ──
  if (showComplete) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
        <p className="text-sm text-gray-500 mb-6">You finished <strong>{lesson?.title}</strong>.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: PURPLE }}
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <button onClick={() => navigate("/dashboard")} className="hover:text-gray-800 transition flex-shrink-0">
            Dashboard
          </button>
          <span className="flex-shrink-0">›</span>
          <span className="text-gray-800 font-medium truncate">{lesson?.title}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          {/* Slide progress pill */}
          <span className="text-xs text-gray-400">
            {currentIndex + 1} / {slides.length}
          </span>
          <button onClick={() => navigate("/dashboard")} className="text-xs text-gray-400 hover:text-gray-600 transition">
            ✕ Exit
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1 bg-gray-200 flex-shrink-0">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: PURPLE }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Slide viewer (65%) */}
        <div className="flex flex-col overflow-hidden" style={{ width: "65%" }}>

          {/* Slide type badge */}
          <div className="flex-shrink-0 px-8 pt-6 pb-2">
            {slide?.is_intro && (
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-purple-100 text-purple-700">
                Introduction
              </span>
            )}
            {slide?.is_conclusion && (
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-green-100 text-green-700">
                Key Takeaways
              </span>
            )}
            {!slide?.is_intro && !slide?.is_conclusion && (
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-500">
                Slide {slide?.slide_number}
              </span>
            )}
          </div>

          {/* Slide content */}
          <div className="flex-1 overflow-y-auto px-8 pb-4">
            {slide ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
                  {slide.title}
                </h2>
                <SlideContent text={slide.content} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">No slides available for this lesson.</p>
              </div>
            )}
          </div>

          {/* Slide dots */}
          {slides.length > 1 && (
            <div className="flex-shrink-0 px-8 py-3 flex items-center gap-1.5 overflow-x-auto">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="flex-shrink-0 rounded-full transition-all duration-200"
                  style={{
                    width: i === currentIndex ? "20px" : "6px",
                    height: "6px",
                    backgroundColor: i === currentIndex ? PURPLE : "#d1d5db",
                  }}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex-shrink-0 px-8 py-4 border-t border-gray-200 bg-white flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>
            <div className="flex-1" />
            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm text-white rounded-lg font-medium transition hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              {currentIndex === slides.length - 1 ? "Complete lesson ✓" : "Next →"}
            </button>
          </div>
        </div>

        {/* RIGHT — AI panel (35%) */}
        <div className="border-l border-gray-200 overflow-hidden" style={{ width: "35%" }}>
          {slide && (
            <AIPanel
              slide={slide}
              fileId={fileId}
              currentSlide={currentIndex + 1}
              totalSlides={slides.length}
            />
          )}
        </div>

      </div>
    </div>
  );
}
