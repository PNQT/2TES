import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

// import styles from "./Register.module.scss";  // Uncomment if needed

const Register = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    user_type: '',
    address: '',
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra form trước khi gửi
    const validationErrors = [];
    if (!formData.user_name) validationErrors.push('Tên là bắt buộc');
    if (!formData.email) validationErrors.push('Email là bắt buộc');
    if (!formData.password) validationErrors.push('Mật khẩu là bắt buộc');
    if (formData.password !== formData.password_confirmation) validationErrors.push('Mật khẩu không khớp');
    if (!formData.phone) validationErrors.push('Số điện thoại là bắt buộc');
    if (!formData.user_type) validationErrors.push('Loại người dùng là bắt buộc');
    if (!formData.address) validationErrors.push('Địa chỉ là bắt buộc');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
 
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    const csrfToken = document.cookie.split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1] || 
      document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    if (!csrfToken) {
      console.error('CSRF token not found.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', data, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Account created successfully", response.data);
      setSuccessMessage('Tạo tài khoản thành công!');
      setFormData({
        user_name: '',
        email: '',
        password: '',
        phone: '',
        user_type: '', 
        address: '',
      });
        // Hiển thị thông báo và chuyển hướng đến trang login sau khi người dùng bấm "OK"
        if (window.confirm('Tạo tài khoản thành công! Bạn có muốn chuyển đến trang đăng nhập không?')) {
          navigate('/login'); // Chuyển hướng đến trang đăng nhập
        }
      setErrors([]); // Clear errors on successful submission
    } catch (error) {
      console.error('There was an error!', error);
      setErrors(['Đã có lỗi xảy ra, vui lòng thử lại!']);
    }
  };

  return (
    <div>
      <h2>Đăng ký tài khoản</h2>

      {/* Hiển thị thông báo thành công */}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {/* Hiển thị các lỗi nếu có */}
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_name">Tên:</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password_confirmation">Xác nhận mật khẩu:</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="user_type">Loại người dùng:</label>
          <select
            id="user_type"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            required
          >
            <option value="">Chọn loại người dùng</option>
            <option value="candidate">Tìm việc</option>
            <option value="employer">Nhà tuyển dụng</option>
          </select>
        </div>
  
        <div>
          <label htmlFor="address">Địa chỉ:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;
