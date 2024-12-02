import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "~/Context/AppContext.jsx";
import Button from "~/components/Button";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Import Eye and Eye Slash icons
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import routesConfig from "~/config/routes";

const cx = classNames.bind(styles);

export default function Login() {
  const { setToken } = useContext(AppContext); // Get setToken from AppContext
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Track loading state
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

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
    <div className={cx("container")}>
      {/* Loading Modal */}
      {loading && (
        <div className={cx('loading-modal')}>
          <div className={cx('loading-spinner')}></div>
          <p>Đang tải...</p>
        </div>
      )}

      <h1 className={cx("htitle")}>Welcome Back!</h1>

      <h4 className={cx("htitledecr")}>Log in now to find the right job with the right salary.</h4>

      <form onSubmit={handleLogin} className={cx("form")}>
        <div className={cx("formcomp")}>
          <label htmlFor="email">Email address</label>
          <input
            className={cx("input")}
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <p className={cx("error")}>Please enter your email address in format: yourname@domain.com</p>}
        </div>

        <div className={cx("formcomp")}>
          <label htmlFor="password">Password</label>
          <div className={cx("input-container")}>
            <div className={cx("input")}>
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Enter your Password"
                className={cx("password")}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span onClick={togglePasswordVisibility} className={cx("icon")}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />} {/* Toggle icon */}
              </span>
            </div>
          </div>
          {errors.password && <p className={cx("error")}>Make sure your password contains at least 6 characters and 1 number.</p>}
        </div>

        <Link to={routesConfig.sendemail} className={cx("formforget")}>Forget password?</Link>
        {/* Display general error */}
        {errors.general && <p className={cx("error")}>{errors.general[0]}</p>}

        <Button className={cx("primary-btn")}>Log in</Button>

        <div className={cx("botgroup")}>
          <div className={cx('group')}> 
            <p> Do not have an account? <Link to={routesConfig.register} className={cx("link")}> Sign up now</Link></p>              
          </div>
          <div className={cx('group')}>
            <p> Are you a recruiter?  <Link to={routesConfig.login} className={cx("link")}> Log in here</Link> </p>            
          </div>
        </div>
      </form>
    </div>
  );
}