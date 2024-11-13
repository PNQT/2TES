import { useState } from 'react';
import styles from './PostJob.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import Button from "~/components/Button";

const cx = classNames.bind(styles);

function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    companyInfo: '',
    location: '',
    employmentType: 'full-time',
    salary: '',
    deadline: '',
    contactEmail: '',
    contactPhone: '',
    applicationProcess: '',
    image: null  // New field for image file
  });

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
        title: '',
        description: '',
        requirements: '',
        benefits: '',
        companyInfo: '',
        location: '',
        employmentType: 'full-time',
        salary: '',
        deadline: '',
        contactEmail: '',
        contactPhone: '',
        applicationProcess: '',
        image: null
      });

    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={cx("form-container")}>
      <h2 className={cx("title")}>Job Posting Form</h2>
      <form onSubmit={handleSubmit}>
        <label   className={cx("jobTitle")}>
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
          Benefits:
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
          />
        </label>

        <label>
          Company Information:
          <textarea
            name="companyInfo"
            value={formData.companyInfo}
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
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
            <option value="temporary">Temporary</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="apprenticeship">Apprenticeship</option>
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
          Application Deadline:
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </label>

        <label>
          Contact Email:
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contact Phone:
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
          />
        </label>

        <label>
          Application Process:
          <textarea
            name="applicationProcess"
            value={formData.applicationProcess}
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
    </div>
  );
}

export default PostJob;
