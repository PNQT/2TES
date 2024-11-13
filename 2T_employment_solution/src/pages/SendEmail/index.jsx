import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SendEmail = () => {
  const [email, setEmail] = useState('');  // Khai báo email state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email là bắt buộc');
      return;
    }

    try {
      localStorage.setItem('email', email);
      const response = await axios.post('http://127.0.0.1:8000/api/password/email', { email });
      setMessage(response.data.message); // Hiển thị thông báo thành công
      setError('');

      // Sau khi gửi email thành công, chuyển đến trang reset mật khẩu
      setTimeout(() => {
        navigate('/resetpassword');  // Chuyển hướng đến trang reset mật khẩu
      }, 2000);  // Thời gian chờ (ví dụ 2 giây để người dùng đọc thông báo)
    } catch (err) {
      setError(err.response?.data.message || 'Đã có lỗi xảy ra!');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Quên mật khẩu</h2>

      {/* Hiển thị thông báo lỗi */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Hiển thị thông báo thành công */}
      {message && <div style={{ color: 'green' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Cập nhật giá trị email
            required
          />
        </div>
        <button type="submit">Gửi link đặt lại mật khẩu</button>
      </form>
    </div>
  );
};

export default SendEmail;
