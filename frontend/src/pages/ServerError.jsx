import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-8xl font-black mb-4" style={{ color: "#714B67" }}>500</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>
      <p className="text-gray-500 mb-8">We're having trouble on our end. Please try again in a moment.</p>
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