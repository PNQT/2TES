import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.scss';  // Importing the SCSS module
import classNames from 'classnames/bind';
import Button from '~/components/Button';  // Import Button component

const cx = classNames.bind(styles);  // Bind class names to the styles

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');  // Get email from localStorage
        if (!storedEmail) {
            navigate('/login'); // If no email, navigate to login page
        } else {
            setEmail(storedEmail);  // Set the email in the form if available
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !passwordConfirmation || !otp) {
            setError('All fields are required');
            return;
        }
        if (password !== passwordConfirmation) {
            setError('Password confirmation does not match');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password/reset', {
                email,
                password,
                otp,
            });
            setMessage(response.data.message);  // Show success message
            setError('');
            setTimeout(() => {
                setMessage(''); // Hide success message after 3 seconds
            }, 3000);
            setTimeout(() => {
                navigate('/login');  // Navigate to login page after success
            }, 2000);
        } catch (err) {
            setError(err.response?.data.message || 'An error occurred!');
            setMessage('');
        }
    };

    return (
        <div className={cx('container')}>
            <h2 className={cx('htitle')}>Reset Password</h2>
            {/* Display error message */}
            {error && <div className={cx('error')}>{error}</div>}
            {/* Display success message */}
            {message && <div className={cx('success')}>{message}</div>}
            <form onSubmit={handleSubmit} className={cx('form')}>
                <div className={cx('form-comp')}>
                    <label htmlFor="email" className={cx('label')}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={cx('input')}
                    />
                </div>
                <div className={cx('form-comp')}>
                    <label htmlFor="password" className={cx('label')}>New Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={cx('input')}
                    />
                </div>
                <div className={cx('form-comp')}>
                    <label htmlFor="password_confirmation" className={cx('label')}>Confirm Password:</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        className={cx('input')}
                    />
                </div>
                <div className={cx('form-comp')}>
                    <label htmlFor="otp" className={cx('label')}>OTP Code:</label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className={cx('input')}
                    />
                </div>
                <Button type="submit" className={cx('primary-btn')}>Reset Password</Button>
            </form>
        </div>
    );
};

export default ResetPassword;
