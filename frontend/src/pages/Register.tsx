import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../services/api";
import axios, { AxiosError } from "axios";

interface RegisterProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Register = ({ setIsLoggedIn }: RegisterProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser({ username, email, password });
      // After successful registration, also log the user in
      const loginResponse = await loginUser({ email, password });
      localStorage.setItem("token", loginResponse.access_token);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      // Handle backend error response format
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        // Check for specific error cases
        if (axiosError.response?.status === 409) {
          setError(
            "This email is already registered. Please log in instead or use a different email."
          );
        } else if (axiosError.response?.status === 400) {
          setError(
            "Invalid registration information. Please check your details and try again."
          );
        } else if (axiosError.response?.data) {
          const backendError = axiosError.response.data as Record<
            string,
            unknown
          >;
          if (typeof backendError === "string") {
            setError(backendError);
          } else if (backendError.message) {
            setError(
              Array.isArray(backendError.message)
                ? (backendError.message as string[]).join(", ")
                : (backendError.message as string)
            );
          } else if (backendError.error) {
            setError(backendError.error as string);
          } else {
            setError("Registration failed. Please try again.");
          }
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Sign Up</h1>
          <p className="mt-2 text-gray-400">
            Create your account to start booking movies
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-400 hover:text-purple-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
