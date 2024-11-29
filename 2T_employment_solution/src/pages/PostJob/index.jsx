import { useState, useEffect, useContext } from "react";
import styles from "./PostJob.module.scss";
import classNames from "classnames/bind";
import axios from "axios";
import Button from "~/components/Button";
import { AppContext } from "~/Context/AppContext";

const cx = classNames.bind(styles);

function PostJob() {
  const { user } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1); 
  const [formData, setFormData] = useState({
    employer_id: "",
    title: "",
    description: "",
    requirements: "",
    company_name: "",
    location: "",
    job_type: "full_time",
    salary: "",
    created_at: "",
    expires_at: "",
    contact_email: "",
    contact_phone: "",
    image: null,

  });

  const [isEmployer, setIsEmployer] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Kiểm tra nếu người dùng là employer
  useEffect(() => {
    if (user && user.user_type !== "employer") {
      setIsEmployer(false);
      setErrorMessage(
        "You are not authorized to post a job. Please log in as an employer."
      );
    }
  }, [user]);

  // Cập nhật employer_id khi user thay đổi
  useEffect(() => {
    if (user && user.user_type === "employer") {
      setFormData((prev) => ({ ...prev, employer_id: user.user_id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    setFormData((prev) => ({ ...prev, created_at: currentDate }))
    const data = new FormData();
    console.log("Form data:", formData);
    console.log("Image:", formData.expires_at);

    // Append form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("http://localhost:8000/api/jobs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Job posted successfully:", response.data);
    } catch (error) {
      console.error(
        "Error posting job:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className={cx("currentStep")}>Step 1: Job Details</h2>
            <label>
              Job Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>
            <label>
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
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className={cx("currentStep")}>Step 2: Company Info</h2>
            <label>
              Company Name:
              <input
                type="text"
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
              <select name="job_type" value={formData.job_type} onChange={handleChange}>
                <option value="full_time">Full-Time</option>
                <option value="part_time">Part-Time</option>
                <option value="internship">Internship</option>
              </select>
            </label>
            <label>
              Salary:
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
              /> 
            </label>  
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className={cx("currentStep")}>Step 3: Contact & Image</h2>
            <label >
              Expries At:
              <input
                type="date"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
              />
            </label>
            <label>
              Contact Email:
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Contact Phone:
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Company Logo or Image:
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cx("form-container")}>
      <h2 className={cx("title")}> Posting Job</h2>
      {!isEmployer && <div className={cx("error-message")}>{errorMessage}</div>}
      {isEmployer && (
        <>
          <div className={cx("progress-bar")}>
            <div className={cx("step", currentStep >= 1 && "active")}>
              <div className={cx("circle")}>{currentStep > 1 ? "✔" : "1"}</div>
              <span>Job Details</span>
            </div>
            <div className={cx("line", currentStep >= 2 && "active")}></div>
            <div className={cx("step", currentStep >= 2 && "active")}>
              <div className={cx("circle")}>{currentStep > 2 ? "✔" : "2"}</div>
              <span>Company Info</span>
            </div>
            <div className={cx("line", currentStep === 3 && "active")}></div>
            <div className={cx("step", currentStep === 3 && "active")}>
              <div className={cx("circle")}>3</div>
              <span>Company Logo or Image</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}
            <div className={cx("buttons")}>
              {currentStep > 1 && (
                <Button onClick={prevStep} outline>
                  Previous
                </Button>
              )}
              {currentStep < 3 && <Button onClick={nextStep}>Next</Button>}
              {currentStep === 3 && <Button type="submit">Submit</Button>}
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default PostJob;
