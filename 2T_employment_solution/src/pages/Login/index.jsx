import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "~/Context/AppContext.jsx";

export default function Login() {
  const { setToken } = useContext(AppContext); // Get setToken from AppContext
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Track loading state

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); // Show loading modal

    console.log("Form Data:", formData);

    try {
      // Send login request to the backend API
      const response = await axios.post(
        "http://localhost:8000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If login is successful, save token and navigate
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      console.log("Login successful", response.data);
      setLoading(false); // Hide loading modal
      navigate("/"); // Navigate to the homepage or dashboard

    } catch (error) {
      setLoading(false); // Hide loading modal on error

      // Check if the error response has validation errors
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data.message) {
        setErrors({ general: [error.response.data.message] });
      } else {
        setErrors({ general: ["Đã có lỗi xảy ra, vui lòng thử lại."] });
      }
    }
  }

  return (
    <>
      {/* Loading Modal */}
      {loading && (
        <div className="loading-modal">
          <div className="loading-spinner"></div>
          <p>Đang tải...</p>
        </div>
      )}

      <h1 className="title">Login to your account</h1>

      <form onSubmit={handleLogin} className="w-1/2 mx-auto space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <p className="error">{errors.email[0]}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}
        </div>

        {/* Display general error */}
        {errors.general && <p className="error">{errors.general[0]}</p>}

        <button className="primary-btn">Login</button>
      </form>
    </>
  );
}
