import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-8xl font-black mb-4" style={{ color: "#714B67" }}>404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 rounded-xl text-white font-semibold"
        style={{ backgroundColor: "#714B67" }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}