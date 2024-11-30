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
import { toast, ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);

function Apply() {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {  token, user_id, setHasNewUpdates } = useContext(AppContext);

  // Kiểm tra xác thực
  useEffect(() => {
    if (!token) {
      alert("Bạn cần đăng nhập để xem trang này.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Lấy danh sách công việc đã ứng tuyển
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/getJobApplied/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setContent(response.data.applications);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user_id) fetchAppliedJobs();
  }, [user_id]);

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init();
  }, []);

  // Lắng nghe thay đổi trạng thái qua SSE
  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:8000/api/checkReviewStatus/${user_id}`
    );

    eventSource.onmessage = (event) => {
      const updatedApplications = JSON.parse(event.data);
      setContent((prevContent) =>
        prevContent.map((job) => {
          const updatedJob = updatedApplications.find(
            (update) => update.job_id === job.job_id
          );
          if (updatedJob && updatedJob.review_status !== job.review_status) {
            if (updatedJob.review_status === "approved") {
              toast.success(`Ứng tuyển của bạn cho ${job.title} đã được chấp thuận.`);
            } else if (updatedJob.review_status === "rejected") {
              toast.info(`Ứng tuyển của bạn cho ${job.title} đã bị từ chối.`);
            }
            setHasNewUpdates(true); // Đặt cờ cập nhật
          }
          return updatedJob ? { ...job, ...updatedJob } : job;
        })
      );
    };

    eventSource.onerror = () => {
      console.error("Error with SSE connection.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user_id, setHasNewUpdates]);

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
            status={job.review_status || "N/A"}
          />
        ))
      ) : (
        <p>Không có công việc nào đã ứng tuyển.</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default Apply;
