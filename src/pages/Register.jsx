import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api-service";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      const response = await userAPI.register(formData);

      if (response.data) {
        navigate("/login");
      }

    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Registration failed");
      } else {
        setError(detail || "Registration failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-6 rounded-lg shadow">

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
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 12 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            minLength={12}
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="student">Student</option>
            <option value="employee">Employee</option>
            <option value="freelancer">Freelancer</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
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