import { useState } from "react";
import { userApi } from "../api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await userApi.post("/signup", { email, password, username });
      console.log("Signup success:", res.data);

      setIsError(false);
      setMessage("Signup successful! Please login.");
      // short delay then go to login
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Signup failed:", err);
      setIsError(true);

      if (err.response && err.response.data) {
        const data = err.response.data;

        // handle Mongo duplicate key error (email already registered)
        if (
          data.error &&
          data.error.code === 11000 &&
          data.error.keyValue?.email
        ) {
          setMessage(
            `Email "${data.error.keyValue.email}" is already registered.`
          );
        } else if (data.error || data.message) {
          setMessage(data.error || data.message);
        } else {
          setMessage("Signup failed. Please try again.");
        }
      } else {
        setMessage("Network error, please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-lg text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#F26B72] hover:bg-[#e55a61]"
          }`}
        >
          {isLoading ? "Signing up..." : "Signup"}
        </button>

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

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-2 text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default Signup;
