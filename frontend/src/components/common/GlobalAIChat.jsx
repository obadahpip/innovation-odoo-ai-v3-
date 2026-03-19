import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";

const PURPLE = "#714B67";

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function GlobalAIChat() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [clearing, setClearing] = useState(false);
  const bottomRef = useRef(null);

  const hiddenOnRoute =
    location.pathname.startsWith("/course/") ||
    location.pathname.startsWith("/simulate/");

  useEffect(() => {
    if (!isAuthenticated || hiddenOnRoute) return;
    if (!open || historyLoaded) return;

    api.get("/content/ai/history/")
      .then((res) => {
        const history = res.data.messages || [];
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              role: "assistant",
              content:
                "Hi! I'm your Odoo learning assistant. Ask me about any topic, lesson, or Odoo feature and I'll point you in the right direction.",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch(() => {
        setMessages([
          {
            role: "assistant",
            content:
              "Hi! I'm your Odoo learning assistant. Ask me about any topic, lesson, or Odoo feature.",
            timestamp: new Date().toISOString(),
          },
        ]);
      })
      .finally(() => setHistoryLoaded(true));
  }, [open, historyLoaded, isAuthenticated, hiddenOnRoute]);

  useEffect(() => {
    if (!isAuthenticated || hiddenOnRoute) return;
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open, isAuthenticated, hiddenOnRoute]);

  if (!isAuthenticated || hiddenOnRoute) return null;

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");

    const userMsg = {
      role: "user",
      content: msg,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await api.post("/content/ai/chat/", {
        message: msg,
        history: newMessages.slice(-6).map(({ role, content }) => ({ role, content })),
      });

      const assistantMsg = {
        role: "assistant",
        content: res.data.reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);

      api.post("/content/ai/history/save/", {
        messages: finalMessages
          .slice(-20)
          .map(({ role, content, timestamp }) => ({ role, content, timestamp })),
      }).catch(() => {});
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't respond right now. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = async () => {
    setClearing(true);
    try {
      await api.post("/content/ai/history/clear/");
      setMessages([
        {
          role: "assistant",
          content: "Conversation cleared. How can I help you?",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
    } finally {
      setClearing(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "64px",
            right: 0,
            width: "320px",
            height: "460px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: PURPLE,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              AI
            </div>

            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
                Course assistant
              </div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                Ask about lessons or Odoo topics
              </div>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={clearConversation}
                disabled={clearing}
                title="Clear conversation"
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                {clearing ? "…" : "Clear"}
              </button>

              <button
                onClick={() => setOpen(false)}
                style={{
                  fontSize: "18px",
                  color: "#9ca3af",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {!historyLoaded && (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #e5e7eb",
                    borderTopColor: PURPLE,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "8px 12px",
                      borderRadius:
                        msg.role === "user"
                          ? "14px 14px 4px 14px"
                          : "14px 14px 14px 4px",
                      background: msg.role === "user" ? PURPLE : "#f3f4f6",
                      color: msg.role === "user" ? "white" : "#374151",
                      fontSize: "12.5px",
                      lineHeight: "1.5",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>

                {msg.timestamp && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#9ca3af",
                      marginTop: "2px",
                      textAlign: msg.role === "user" ? "right" : "left",
                      paddingLeft: msg.role === "assistant" ? "4px" : 0,
                      paddingRight: msg.role === "user" ? "4px" : 0,
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "14px 14px 14px 4px",
                    background: "#f3f4f6",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  {[0, 150, 300].map((d) => (
                    <div
                      key={d}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#9ca3af",
                        animation: "bounce 1s infinite",
                        animationDelay: `${d}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid #f3f4f6",
              display: "flex",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                fontSize: "12.5px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "8px 12px",
                outline: "none",
                background: "#f9fafb",
              }}
            />

            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                background: PURPLE,
                color: "white",
                fontSize: "12px",
                fontWeight: 600,
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                opacity: input.trim() && !loading ? 1 : 0.45,
                transition: "opacity 0.2s",
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: PURPLE,
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(113,75,103,0.4)",
          fontSize: "20px",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(113,75,103,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(113,75,103,0.4)";
        }}
        title="Ask the AI assistant"
      >
        {open ? "×" : "💬"}
      </button>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}