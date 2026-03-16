import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function AssessmentPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Odoo onboarding specialist. I'll ask you a few questions to build a personalized learning plan just for you. Let's start — what's your job role, and what do you want to achieve with Odoo?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Check if assessment already done
  useEffect(() => {
    api.get("/assessment/").then((res) => {
      if (res.data.is_finalized && res.data.study_plan) {
        navigate("/plan-review");
      }
    }).catch(() => {});
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post("/assessment/message/", { message: userMsg });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);

      if (res.data.is_complete) {
        setIsComplete(true);
        setStudyPlan(res.data.study_plan);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: "#714B67" }}>
          AI
        </div>
        <div>
          <p className="font-semibold text-gray-900">Odoo Onboarding Specialist</p>
          <p className="text-xs text-green-500 font-medium">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 flex-shrink-0" style={{ backgroundColor: "#714B67" }}>
                AI
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
              }`}
              style={msg.role === "user" ? { backgroundColor: "#714B67" } : {}}
            >
              {msg.content.replace(/\{"plan":\s*\[[\d,\s]+\],\s*"rationale":\s*"[^"]*"\}/g, '').trim()}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0" style={{ backgroundColor: "#714B67" }}>
              AI
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Completion banner */}
        {isComplete && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-semibold text-green-800 mb-1">Your learning plan is ready!</p>
            <p className="text-green-600 text-sm mb-4">
              We've selected {studyPlan?.sections_ordered?.length} sections for you — total:{" "}
              <strong>{studyPlan?.total_price} JOD</strong>
            </p>
            <button
              onClick={() => navigate("/plan-review")}
              className="px-6 py-2 rounded-lg text-white font-medium text-sm transition hover:opacity-90"
              style={{ backgroundColor: "#714B67" }}
            >
              Review My Plan →
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!isComplete && (
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-3xl mx-auto flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send)"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50"
              style={{ "--tw-ring-color": "#714B67" }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl text-white font-medium text-sm transition hover:opacity-90 disabled:opacity-40 flex-shrink-0"
              style={{ backgroundColor: "#714B67" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}