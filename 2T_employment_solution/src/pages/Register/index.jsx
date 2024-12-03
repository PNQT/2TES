import {  useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
// import { AppContext } from '~/Context/AppContext';

const cx = classNames.bind(styles);

const Register = () => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    user_type: 'candidate',
    address: '',
  
  });

  // const {setToken} = useContext(AppContext);
  
  // State quản lý lỗi
  const [errors, setErrors] = useState([]);
  
  // State quản lý thông báo thành công
  const [successMessage, setSuccessMessage] = useState('');
  
  // Sử dụng navigate để chuyển hướng
  const navigate = useNavigate();

  // Hàm thay đổi dữ liệu form khi người dùng nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm kiểm tra tính hợp lệ của form trước khi gửi
  const validateForm = () => {
    const validationErrors = [];
    if (!formData.email) validationErrors.push('Email is required.');
    if (!formData.password) {
      validationErrors.push('Password is required.');
    } else {
      const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{9,}$/;
      if (!passwordRegex.test(formData.password)) {
        validationErrors.push(
          'Password must be at least 8 characters long and include at least one special character.'
        );
      }
    }
    if (formData.password !== formData.password_confirmation) {
      validationErrors.push('Passwords do not match.');
    }
    if (!formData.phone) validationErrors.push('Phone number is required.');
    if (!formData.user_type) validationErrors.push('User type is required.');
    if (!formData.address) validationErrors.push('Address is required.');

    return validationErrors;
  };

  // Hàm gửi dữ liệu form đến server
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của form trước khi gửi
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      console.log('Account created successfully', response.data);

      setSuccessMessage('Account created successfully');
      
      setFormData({
        user_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        user_type: 'candidate',
        address: '',
       
      });
      setErrors([]); // Reset lỗi

     
      if (
        window.confirm('Account created successfully! Do you want to login now?')
      ) {
        navigate('/login');
      }
    } catch (error) {
      console.error('OPP!', error);
      if (error.response && error.response.data) {
        const serverErrors = error.response.data.errors;
        if (serverErrors) {
          // Nếu lỗi trả về là object, chuyển thành mảng các lỗi để hiển thị
          const errorMessages = Object.values(serverErrors).flat();
          setErrors(errorMessages);
        } else {
          // Nếu không có lỗi chi tiết, hiển thị lỗi mặc định
          setErrors(['An error has occurred, please try again!']);
        }
      } else {
        setErrors(['An error has occurred, please try again!']);
      }
    }
  };

  return (
    <div className={cx("container")}>
    <h1 className={cx("header")}>Create a new account</h1>

      {/* Thông báo thành công */}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      

      {/* Hiển thị lỗi từ server hoặc lỗi tự kiểm tra */}
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form đăng ký */}
      <form onSubmit={handleSubmit} className={cx("form")}>
        <div className={cx("formitem")}>
          <label htmlFor="user_name" className={cx("name")}>Name:</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
            className={cx("input")}
          />
        </div>
        <div className={cx("formitem")}>
          <label htmlFor="email"  className={cx("name")}>Email address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={cx("input")}
          />
        </div>
        <div className={cx("formitem")}>
         <label htmlFor="password"  className={cx("name")}>Password:</label>
         <div className={cx("input")}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
         </div>
        </div>
        <div className={cx("formitem")}>
          <label htmlFor="password_confirmation"  className={cx("name")}>Confirm password:</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className={cx("input")}
          />
        </div>
        <div className={cx("formitem")}>
          <label htmlFor="phone"  className={cx("name")}>Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={cx("input")}
          />
        </div>
        <div className={cx("formitem")}>
          <label htmlFor="user_type"  className={cx("name")}>Type of user:</label>
          <select
            id="user_type"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            required
            className={cx("input")}
          >
            <option value="candidate">Job applicant</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <div className={cx("formitem")}>
          <label htmlFor="address"  className={cx("name")}>Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className={cx("input")}
          ></textarea>
        </div>
        <Button type="submit" className={cx("primary-btn")}>Đăng ký</Button>
      </form>
    </div>
  );
};

export default Register;
