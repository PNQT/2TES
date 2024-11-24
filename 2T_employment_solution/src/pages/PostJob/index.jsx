import { useState, useEffect, useContext } from 'react';
import styles from './PostJob.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import Button from "~/components/Button";
import { AppContext } from '~/Context/AppContext'; // Import AppContext

const cx = classNames.bind(styles);

function PostJob() {
  const { user, token } = useContext(AppContext); // Access user and token from AppContext
  const [formData, setFormData] = useState({
    employer_id: '0',// Set employer_id to the user's ID if user is logged in
    title: '',
    description: '',
    requirements: '',
    company_name: '',
    location: '',
    job_type: 'full_time',
    salary: '',
    created_at: '',
    contact_email: '',
    contact_phone: '',
    image: null
  });

  const [isEmployer, setIsEmployer] = useState(true); // Flag to track if user is an employer
  const [errorMessage, setErrorMessage] = useState(''); // Error message for unauthorized users

  // Check if the user is an employer
  useEffect(() => {
    if (user && user.user_type !== 'employer') {
      setIsEmployer(false);
      setErrorMessage('You are not authorized to post a job. Please log in as an employer.');
    }
  }, [user]);

  // Update the employer_id in the form data when the user changes
  useEffect(() => { 
    if (user && user.user_type === 'employer') {
      setFormData({ ...formData, employer_id: user.user_id });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the user is an employer before submitting the job posting
    if (!isEmployer) {
      setErrorMessage('You are not authorized to post a job.');
      return;
    }

    const data = new FormData();
    // Append all form fields to FormData, including the file input
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    // Get the CSRF token from a cookie or meta tag
    const csrftoken = document.cookie.split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1] ||
      document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (!csrftoken) {
      console.error("CSRF token not found!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/jobs', data, {
        headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'multipart/form-data'  // Ensure that the header is set correctly
        },
      });

      console.log('Job posted successfully:', response.data);
      // Optionally reset form data after successful submission
      setFormData({
        employer_id: user.user_id,
        title: '',
description: '',
        requirements: '',
        company_name: '',
        location: '',
        job_type: 'full-time',
        salary: '',
        created_at: '',
        contact_email: '',
        contact_phone: '',
        image: null
      });

    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={cx("form-container")}>
      <h2 className={cx("title")}>Job Posting Form</h2>
      {!isEmployer && (
        <div className={cx("error-message")}>
          {errorMessage}
        </div>
      )}
      {isEmployer && (
        <form onSubmit={handleSubmit}>
          <label className={cx("jobTitle")}>
            Job Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className={cx("description")}>
            Job Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Requirements:
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
            />
          </label>

          <label>
            Company Information:
            <textarea
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </label>

          <label>
            Employment Type:
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
            >
              <option value="full_time">Full-Time</option>
              <option value="part_time">Part-Time</option>
              <option value="internship">Internship</option>
              
            </select>
          </label>

          <label>
            Salary:
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </label>

          <label>
            Posted at:
            <input
              type="date"
              name="created_at"
              value={formData.created_at}
              onChange={handleChange}
            />
          </label>

          <label>
            Contact Email:
            <input
              type="email"
              name="contact_email"
              value={formData.contactEmail}
              onChange={handleChange}
              required
/>
          </label>

          <label>
            Contact Phone:
            <input
              type="tel"
              name="contact_phone"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </label>

          {/* New field for image upload */}
          <label>
            Company Logo or Image:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <div className={cx("groupbutton")}>
            <Button type="submit">Submit</Button>
            <Button className={cx("btnCancel")} outline>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PostJob;