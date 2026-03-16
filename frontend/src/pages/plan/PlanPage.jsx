import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

const PURPLE = "#714B67";

function ChecklistLesson({ lesson, onToggle }) {
  return (
    <button
      onClick={() => onToggle(lesson.file_id)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left group"
    >
      <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition ${
        lesson.checked ? "border-transparent" : "border-gray-300 group-hover:border-purple-300"
      }`}
        style={lesson.checked ? { backgroundColor: PURPLE } : {}}
      >
        {lesson.checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${lesson.checked ? "line-through text-gray-400" : "text-gray-700"}`}>
          {lesson.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{lesson.section_name}</p>
      </div>
      {lesson.lesson_type === "intro" && (
        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-100 text-purple-700 flex-shrink-0">
          INTRO
        </span>
      )}
    </button>
  );
}

export default function PlanPage() {
  const navigate = useNavigate();

  const [plan, setPlan]         = useState(null);   // { has_plan, lessons, chat_history }
  const [loading, setLoading]   = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get("/assessment/plan/")
      .then((res) => {
        setPlan(res.data);
        if (res.data.chat_history?.length) {
          setMessages(res.data.chat_history);
          setChatStarted(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const startChat = () => {
    setChatStarted(true);
    setMessages([{
      role: "assistant",
      content: "Hi! I'll help you build a personalized Odoo study plan. Let's start — what's your role or job title?",
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    const msg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setChatLoading(true);

    try {
      const res = await api.post("/assessment/plan/chat/", { message: msg });
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
      if (res.data.is_complete && res.data.lessons?.length) {
        setPlan((p) => ({ ...p, has_plan: true, lessons: res.data.lessons }));
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleLesson = async (fileId) => {
    try {
      const res = await api.patch(`/assessment/plan/toggle/${fileId}/`);
      setPlan((p) => ({ ...p, lessons: res.data.lessons }));
    } catch {}
  };

  const resetPlan = async () => {
    await api.post("/assessment/plan/reset/").catch(() => {});
    setPlan({ has_plan: false, lessons: [], chat_history: [] });
    setMessages([]);
    setChatStarted(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: PURPLE }} />
    </div>
  );

  const checkedCount = plan?.lessons?.filter((l) => l.checked).length || 0;
  const totalCount   = plan?.lessons?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-sm text-gray-400 hover:text-gray-700 transition">
            ← Dashboard
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-800">My Study Plan</span>
        </div>
        {plan?.has_plan && (
          <button onClick={resetPlan} className="text-xs text-gray-400 hover:text-red-500 transition">
            Reset plan
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── No plan yet ── */}
        {!plan?.has_plan && !chatStarted && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Build your study plan</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Chat with the AI to get a personalized list of lessons based on your role and goals. Completely optional — you can learn in any order from the dashboard.
            </p>
            <button
              onClick={startChat}
              className="px-6 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              Generate my plan
            </button>
            <p className="mt-4 text-xs text-gray-400">
              Or{" "}
              <button onClick={() => navigate("/dashboard")} className="underline hover:text-gray-600">
                go straight to the dashboard
              </button>{" "}
              and start any lesson you like.
            </p>
          </div>
        )}

        {/* ── Chat (generating plan) ── */}
        {chatStarted && !plan?.has_plan && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PURPLE }}>
                AI
              </div>
              <span className="text-sm font-medium text-gray-700">Plan advisor</span>
              <span className="text-xs text-gray-400 ml-auto">Answering a few questions to build your plan</span>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto px-5 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-700 rounded-bl-sm"
                    }`}
                    style={msg.role === "user" ? { backgroundColor: PURPLE } : {}}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((d) => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your answer..."
                className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-300 bg-gray-50"
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || chatLoading}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: PURPLE }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* ── Plan generated ── */}
        {plan?.has_plan && plan.lessons?.length > 0 && (
          <>
            {/* Plan header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Your study plan</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {checkedCount} of {totalCount} lessons completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: PURPLE }}>
                  {totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-400">done</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
                  backgroundColor: PURPLE,
                }}
              />
            </div>

            {/* Lesson checklist */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {plan.lessons.map((lesson) => (
                  <ChecklistLesson
                    key={lesson.file_id}
                    lesson={lesson}
                    onToggle={toggleLesson}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Click any lesson to mark it done, or{" "}
              <button
                onClick={() => navigate("/dashboard")}
                className="underline hover:text-gray-600"
              >
                open the full dashboard
              </button>{" "}
              to start learning.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
