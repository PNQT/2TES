import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "~/components/JobCard";
import styles from "./Categories.module.scss";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";

// Giả sử bạn đã có component JobCard
 // Tạo CSS cho trang Category

function Categories() {
  const [jobs, setJobs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'http://localhost:8000/api';

  const { user, token } = useContext(AppContext);

  // Lấy danh sách tất cả công việc từ API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/joball`);
        setJobs(response.data); // Lưu danh sách công việc vào state
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setErrorMessage('Could not fetch jobs.');
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Job Listings</h1>
      <div className={styles.jobs}>
        {errorMessage && <p>{errorMessage}</p>}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job.job_id}
              src={`http://localhost:8000/${job.image}`} // Đường dẫn ảnh của công việc
              name={job.title}
              address={job.location}
              position={job.company_name}
              shortdecr1={job.job_type}
              shortdecr2={job.salary}
              shortdecr3={job.created_at}
              description={job.description}
              details={job}
                job_id={job.job_id}
                user={user}
                token={token}
            />
          ))
        ) : (
          <p>No jobs available</p>
        )}
      </div>
    </div>
  );
}

export default Categories;
