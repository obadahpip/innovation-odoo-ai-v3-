import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

export default function CertificatePage() {
  const navigate           = useNavigate();
  const { user }           = useAuthStore();
  const certRef            = useRef(null);
  const [cert, setCert]    = useState(null);
  const [loading, setLoading]     = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // First check they actually finished
    api.get("/progress/dashboard/").then((res) => {
      const pct = res.data.overall_progress || 0;
      if (pct < 100) {
        toast.error("Complete all 81 lessons to unlock your certificate.");
        navigate("/dashboard");
        return;
      }
      // Fetch or generate certificate
      return api.post("/progress/certificate/generate/").then((r) => {
        setCert(r.data);
      });
    }).catch(() => {
      toast.error("Could not load certificate.");
      navigate("/dashboard");
    }).finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF       = (await import("jspdf")).default;

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf     = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Innovation-Odoo-AI-Certificate-${cert?.certificate_id?.slice(0, 8) || "cert"}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (err) {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-brand rounded-full animate-spin" />
    </div>
  );

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "Learner";
  const issueDate   = cert?.issued_at
    ? new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6 w-full max-w-3xl justify-between">
        <button onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition">
          ← Back to Dashboard
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {downloading ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Downloading...</>
          ) : (
            <><span>⬇</span> Download PDF</>
          )}
        </button>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Top accent bar */}
        <div className="h-3 bg-gradient-to-r from-brand to-brand-dark" />

        <div className="px-16 py-12 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-xl">O</div>
            <span className="font-semibold text-gray-700 text-lg">Innovation Odoo AI</span>
          </div>

          {/* Certificate header */}
          <div className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
            Certificate of Completion
          </div>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-8" />

          {/* This certifies */}
          <p className="text-gray-400 text-sm mb-3">This certifies that</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Georgia, serif" }}>
            {displayName}
          </h1>
          <p className="text-gray-400 text-sm mb-3">has successfully completed</p>
          <h2 className="text-2xl font-semibold text-brand mb-2">
            Odoo ERP Complete Learning Path
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            81 lessons · 9 sections · AI-powered tutoring
          </p>

          {/* Trophy */}
          <div className="text-6xl mb-8">🏆</div>

          {/* Meta row */}
          <div className="flex items-center justify-center gap-12 text-center mb-8">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Date Issued</div>
              <div className="font-semibold text-gray-700 mt-1">{issueDate}</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Total Hours</div>
              <div className="font-semibold text-gray-700 mt-1">~30 hours</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Certificate ID</div>
              <div className="font-mono text-xs text-gray-500 mt-1">
                {cert?.certificate_id?.slice(0, 16).toUpperCase() || "—"}
              </div>
            </div>
          </div>

          {/* Signature line */}
          <div className="border-t border-gray-100 pt-6 flex justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-brand mb-1" style={{ fontFamily: "Georgia, serif" }}>
                Innovation Odoo AI
              </div>
              <div className="text-xs text-gray-400">Authorised by the Platform</div>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-3 bg-gradient-to-r from-brand to-brand-dark" />
      </div>

      <p className="text-xs text-gray-400 mt-4">Certificate ID: {cert?.certificate_id || "—"}</p>
    </div>
  );
}
