import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function PaymentPage() {
  const [plan, setPlan] = useState(null);
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/assessment/").then((res) => {
      if (!res.data.study_plan) return navigate("/plan-review");
      if (res.data.study_plan.status === "active") return navigate("/dashboard");
      setPlan(res.data.study_plan);
    }).catch(() => navigate("/plan-review"))
      .finally(() => setLoading(false));
  }, []);

  const handlePayCashOrCliq = async () => {
    setSubmitting(true);
    try {
      await api.post("/payment/initiate/", { method });
      navigate("/payment-pending");
    } catch (err) {
      alert("Failed to submit payment request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💳</div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-500 mt-1">Choose how you'd like to pay</p>
        </div>

        {/* Price summary */}
        <div
          className="rounded-xl p-5 text-white text-center mb-6"
          style={{ backgroundColor: "#714B67" }}
        >
          <p className="text-sm opacity-80 mb-1">Total Amount Due</p>
          <p className="text-4xl font-bold">{plan?.total_price} JOD</p>
          <p className="text-sm opacity-70 mt-1">{plan?.sections_ordered?.length} sections · Lifetime access</p>
        </div>

        {/* Payment methods */}
        <div className="space-y-3 mb-6">
          {/* PayPal / Card */}
          <button
            onClick={() => setMethod("card")}
            className={`w-full bg-white rounded-xl border-2 px-5 py-4 text-left transition ${
              method === "card" ? "border-[#714B67]" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-semibold text-gray-900">Card Payment (PayPal)</p>
                <p className="text-xs text-gray-400">Pay securely with credit or debit card via PayPal. Instant access.</p>
              </div>
              {method === "card" && <span className="ml-auto text-[#714B67] font-bold">✓</span>}
            </div>
          </button>

          {/* Cash */}
          <button
            onClick={() => setMethod("cash")}
            className={`w-full bg-white rounded-xl border-2 px-5 py-4 text-left transition ${
              method === "cash" ? "border-[#714B67]" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-semibold text-gray-900">Cash Payment</p>
                <p className="text-xs text-gray-400">Pay in person. Admin will verify within 24 hours.</p>
              </div>
              {method === "cash" && <span className="ml-auto text-[#714B67] font-bold">✓</span>}
            </div>
          </button>

          {/* CliQ */}
          <button
            onClick={() => setMethod("cliq")}
            className={`w-full bg-white rounded-xl border-2 px-5 py-4 text-left transition ${
              method === "cliq" ? "border-[#714B67]" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold text-gray-900">CliQ Transfer</p>
                <p className="text-xs text-gray-400">Transfer via CliQ. Admin will verify within 24 hours.</p>
              </div>
              {method === "cliq" && <span className="ml-auto text-[#714B67] font-bold">✓</span>}
            </div>
          </button>
        </div>

        {/* CliQ instructions */}
        {method === "cliq" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">CliQ Transfer Details</p>
            <p>Alias: <strong>innovation-odoo</strong></p>
            <p className="mt-1 text-xs text-blue-600">Please use your registered email as the transfer note so we can verify your payment.</p>
          </div>
        )}

        {/* Cash instructions */}
        {method === "cash" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-800">
            <p className="font-semibold mb-1">Cash Payment Instructions</p>
            <p>Contact us to arrange an in-person payment. Once received, your account will be activated within 24 hours.</p>
          </div>
        )}

        {/* Action button */}
        {method === "card" && (
          <button
            disabled
            className="w-full py-3 rounded-xl text-white font-semibold opacity-60 cursor-not-allowed"
            style={{ backgroundColor: "#714B67" }}
          >
            PayPal Coming Soon
          </button>
        )}

        {(method === "cash" || method === "cliq") && (
          <button
            onClick={handlePayCashOrCliq}
            disabled={submitting}
            className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: "#714B67" }}
          >
            {submitting ? "Submitting..." : "Submit Payment Request →"}
          </button>
        )}

        {!method && (
          <button disabled className="w-full py-3 rounded-xl text-white font-semibold opacity-30 cursor-not-allowed" style={{ backgroundColor: "#714B67" }}>
            Select a payment method
          </button>
        )}

        <button
          onClick={() => navigate("/plan-review")}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
        >
          ← Back to Plan
        </button>
      </div>
    </div>
  );
}