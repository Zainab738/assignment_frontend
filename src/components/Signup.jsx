import { useState } from "react";
import { userApi, postApi } from "../api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(" Signup form submitted:", { email, password });

    try {
      const res = await userApi.post("/signup", { email, password });
      console.log("Signup success:", res.data);
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);

      if (err.response && err.response.data) {
        const data = err.response.data;

        // check for Mongo duplicate key error
        if (
          data.error &&
          data.error.code === 11000 &&
          data.error.keyValue?.email
        ) {
          alert(
            `Signup failed: Email "${data.error.keyValue.email}" is already registered.`
          );
        } else if (data.message) {
          alert(`Signup failed: ${data.message}`);
        }
      } else {
        alert("Network error, please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Signup
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-2 text-sm text-blue-600"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default Signup;
