import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { registerWithCredentials } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await registerWithCredentials(
        formData.name,
        formData.email,
        formData.password,
        formData.type,
      );

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="w-full max-w-md p-6 rounded-lg shadow bg-white">

        <h1 className="text-2xl font-bold mb-4">
          Create Account
        </h1>

        {error && (
          <p className="text-red-500 mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
            autoComplete="name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
            autoComplete="email"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 12 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg pr-12"
              required
              minLength={12}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="student">Student</option>
            <option value="employee">Employee</option>
            <option value="freelancer">Freelancer</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;