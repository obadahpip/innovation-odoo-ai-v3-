import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function PaymentPendingPage() {
  const [payment, setPayment] = useState(null);
  const navigate = useNavigate();

  const checkStatus = async () => {
    try {
      const res = await api.get("/payment/status/");
      setPayment(res.data);
      if (res.data.status === "paid") {
        navigate("/dashboard");
      }
    } catch {}
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // poll every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Pending Verification</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your {payment?.method === "cliq" ? "CliQ transfer" : "cash payment"} of{" "}
          <strong>{payment?.amount} JOD</strong> is being reviewed. You'll get access within 24 hours once confirmed.
        </p>

        {payment?.method === "cliq" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 text-left mb-6">
            <p className="font-semibold mb-1">Reminder</p>
            <p>Transfer to CliQ alias: <strong>innovation-odoo</strong></p>
            <p className="text-xs mt-1 text-blue-600">Use your email as the transfer note.</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Checking status automatically every 60 seconds...
        </div>

        <button
          onClick={checkStatus}
          className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Check Now
        </button>
      </div>
    </div>
  );
}