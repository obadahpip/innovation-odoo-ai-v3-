import { useState } from "react";
import api from "../api/axios";

export default function QuizModal({ fileId, onClose, onPass }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load questions on mount
  useState(() => {
    api.get(`/assessment/quiz/${fileId}/`)
      .then(res => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load quiz.");
        setLoading(false);
      });
  }, [fileId]);

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/assessment/quiz/submit/", {
        file_id: fileId,
        answers,
      });
      setResults(res.data);
    } catch {
      setError("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between"
          style={{ backgroundColor: "#714B67" }}>
          <h2 className="text-white text-xl font-bold">Lesson Quiz</h2>
          <button onClick={onClose} className="text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6">
          {loading && (
            <p className="text-center text-gray-500">Loading questions...</p>
          )}

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Questions */}
          {!loading && !results && questions.map((q, idx) => (
            <div key={q.id} className="mb-6">
              <p className="font-semibold text-gray-800 mb-3">
                {idx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, option)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm
                      ${answers[q.id] === option
                        ? "border-purple-600 bg-purple-50 font-medium"
                        : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          {!loading && !results && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-bold mt-2 disabled:opacity-50"
              style={{ backgroundColor: "#714B67" }}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}

          {/* Results */}
          {results && (
            <div className="text-center">
              <div className={`text-6xl mb-4`}>
                {results.passed ? "🎉" : "📚"}
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {results.score} / {results.total} correct
              </h3>
              <p className={`text-lg font-semibold mb-6 ${results.passed ? "text-green-600" : "text-orange-500"}`}>
                {results.passed ? "Passed! Great work." : "Keep studying — you've got this."}
              </p>

              {/* Per-question breakdown */}
              <div className="text-left space-y-4 mb-6">
                {results.results.map((r, idx) => (
                  <div key={r.question_id}
                    className={`p-4 rounded-xl border-2 ${r.is_correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
                    <p className="font-semibold text-gray-800 text-sm mb-1">
                      {idx + 1}. {r.question}
                    </p>
                    <p className="text-sm">
                      Your answer: <span className={r.is_correct ? "text-green-700 font-medium" : "text-red-600 font-medium"}>{r.selected || "—"}</span>
                    </p>
                    {!r.is_correct && (
                      <p className="text-sm text-green-700">Correct: <span className="font-medium">{r.correct_answer}</span></p>
                    )}
                    {r.explanation && (
                      <p className="text-xs text-gray-500 mt-1 italic">{r.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={results.passed ? onPass : onClose}
                className="w-full py-3 rounded-xl text-white font-bold"
                style={{ backgroundColor: "#714B67" }}
              >
                {results.passed ? "Continue to Next Lesson →" : "Close & Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}