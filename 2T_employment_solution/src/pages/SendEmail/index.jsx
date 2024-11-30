import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './SendEmail.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const SendEmail = () => {
  const [email, setEmail] = useState('');  // Declare email state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      localStorage.setItem('email', email);
      const response = await axios.post('http://127.0.0.1:8000/api/password/email', { email });
      setMessage(response.data.message); // Show success message
      setError('');

      // After successfully sending the email, navigate to the reset password page
      setTimeout(() => {
        navigate('/resetpassword');  // Navigate to the reset password page
      }, 2000);  // Delay (e.g., 2 seconds for the user to read the message)
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred!');
      setMessage('');
    }
  };

  return (
    <div className={cx("send-email-container")}>
      <h2>Forgot Password</h2>

      {/* Show error message */}
      {error && <div className={cx("error-message")}>{error}</div>}

      {/* Show success message */}
      {message && <div className={cx("success-message")}>{message}</div>}

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
        <Button type="submit" outline>Send Password Reset Link</Button>
      </form>
    </div>
  );
};

export default SendEmail;
