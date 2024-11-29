import AppliedJob from "~/components/AppliedJob";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "~/Context/AppContext";
import ClipLoader from "react-spinners/ClipLoader";
import classNames from "classnames/bind";
import styles from "./Apply.module.scss";
import AOS from "aos";
import "aos/dist/aos.css";

const cx = classNames.bind(styles);

function Apply() {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, user_id } = useContext(AppContext);

  if (!token) {
    alert("You need to log in to view this page.");
    navigate("/login");
  }

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `http://localhost:8000/api/getJobApplied/${user_id}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setContent(response.data.applications);
        } catch (error) {
          console.error("Error fetching applied jobs:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAppliedJobs();
  }, [user]);

  useEffect(() => {
    AOS.init(); 
  }, []);

  return (
    <div className={cx("container")}>
      {isLoading ? (
        <ClipLoader className={cx("spinner")} />
      ) : content.length > 0 ? (
        content.map((job, index) => (
          <AppliedJob
            key={index}
            data-aos="fade-up" 
            title={job.title || "N/A"}
            name={job.company_name || "N/A"}
            location={job.location || "N/A"}
            applied={job.applied_at || "N/A"}
            status={job.application_status || "N/A"}
          />
        ))
      ) : (
        <p>No applied jobs to display.</p>
      )}
    </div>
  );
}

export default Apply;
