import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [message, setMessage] = useState(''); // State để lưu thông báo lỗi
  const [error, setError] = useState(false); // State để xác định có lỗi hay không
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

    if (message) {
        setMessage(''); // Xóa thông báo lỗi trước đó nếu người dùng chỉnh sửa
      }
    

    // Kiểm tra form trước khi gửi
    const validationErrors = [];
    if (!formData.email) validationErrors.push('Email là bắt buộc');
    if (!formData.password) validationErrors.push('Mật khẩu là bắt buộc');

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
      const response = await axios.post('http://127.0.0.1:8000/api/login', data, {
        withCredentials: true,
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'multipart/form-data',
        }, 
      });

      console.log("Đăng nhập thành công", response.data); 

      navigate('/'); // Chuyển hướng đến trang đăng nhập     
      setFormData({
        email: '',
        password: '',
      });
    } catch (error) {
      console.error('Đã có lỗi xảy ra!', error);
      // Nếu có lỗi
      if (error.response && error.response.status === 401) {
        // Kiểm tra lỗi 401 và hiển thị thông báo
        setMessage('Thông tin đăng nhập không chính xác');
        setErrors([]); // Xóa lỗi trước đó
      } else {
        // Lỗi khác
        setMessage(error.response?.data.message || 'Đã có lỗi xảy ra!');
        setErrors([]); // Xóa lỗi trước đó
      }
      setError(true); // Đánh dấu là lỗi
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>

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

      {/* Hiển thị thông báo lỗi */}
      {message && (
        <div style={{ color: 'red' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
        <button type="submit">Đăng nhập</button>
        <div>
        <a href="/register">Đăng ký tài khoản</a>
         </div>
         <div>
         <a href="/sendemail">Quên mật khẩu</a>   
         </div>
        
      </form>
    </div>
  );
};

export default Login;
