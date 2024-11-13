import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');  // Lấy email từ localStorage
        if (!storedEmail) {
            navigate('/login'); // Nếu không có email, chuyển hướng về trang login
        } else {
            setEmail(storedEmail);  // Điền email vào form nếu có
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !passwordConfirmation || !otp) {
            setError('Tất cả các trường đều là bắt buộc');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password/reset', {
                email,
                password,
                otp,
            });

            setMessage(response.data.message);  // Hiển thị thông báo thành công
            setError('');
            setTimeout(() => {
                setMessage(''); // Ẩn thông báo thành công sau 3 giây
            }, 3000);

            setTimeout(() => {
                navigate('/login');  // Chuyển đến trang login sau khi thành công
            }, 2000);

        } catch (err) {
            setError(err.response?.data.message || 'Đã có lỗi xảy ra!');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Đặt lại mật khẩu</h2>

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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu mới:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password_confirmation">Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="otp">Mã OTP:</label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đặt lại mật khẩu</button>
            </form>
        </div>
    );
};

export default ResetPassword;
