import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userApi } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await userApi.post("/login", { email, password });
      console.log("Login Response:", res.data);

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      setIsError(false);
      setMessage("Login successful!");
      // short delay so user sees success message
      setTimeout(() => navigate("/feed"), 1200);
    } catch (err) {
      console.error("Login Error:", err);
      setIsError(true);
      // Try to pull message from backend first
      const backendMsg =
        err.response?.data?.error || err.response?.data?.message;

      setMessage(backendMsg || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`py-2 rounded text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F26B72] hover:bg-[#e55a61]"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center mt-2">
            <div className="w-6 h-6 border-4 border-t-transparent border-[#F26B72] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Message */}
        {message && (
          <p
            className={`mt-2 text-center font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Signup redirect */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-500 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
