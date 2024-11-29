import { useEffect, useState, useContext } from "react";
import axios from "axios";
import JobCard from "~/components/JobCard";
import Modal from "react-modal";
import Button from "~/components/Button";
import styles from "./YourPosted.module.scss";
import { AppContext } from "~/Context/AppContext";
import { ClipLoader } from "react-spinners";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
Modal.setAppElement("#root");

function YourPosted() {
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editData, setEditData] = useState({});
  
  const { user, user_id ,token } = useContext(AppContext);
  const API_URL = "http://localhost:8000/api";

  // Fetch posted jobs on initial render
  useEffect(() => {
    const fetchPostedJobs = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.post(
          `${API_URL}/jobs/YourPosted`,
          { user_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPostedJobs(response.data);
      } catch (error) {
        setErrorMessage("Could not fetch posted jobs.");
        console.error("Error fetching posted jobs:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPostedJobs();
  }, [user,token]);

  // Update job details in the form
  const handleEditClick = (job) => {
    setSelectedJob(job);
    setEditData({ ...job });
    setModalIsOpen(true);
  };

  // Save edited job details
  const handleSaveEdit = async () => {
    setLoading(true); // Set loading to true while saving
    const formData = new FormData();

     Object.keys(editData).forEach((key) => {
  if (
    editData[key] !== null &&
    editData[key] !== "" &&
    !["created_at", "updated_at", "employer_id", "posted_at", "image", "job_id"].includes(key)
  ) {
    formData.append(key, editData[key]);
  }
});   
    try {
      const response = await axios.post(
        `${API_URL}/jobedit/${selectedJob.job_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setPostedJobs((prevJobs) =>
          prevJobs.map((item) =>
            item.job_id === selectedJob.job_id ? { ...item, ...editData } : item
          )
        );
        setModalIsOpen(false);
      } else {
        setErrorMessage("Failed to update job.");
        console.error("Job update failed:", response.data);
      }
    } catch (error) {
      setErrorMessage("Error updating job.");
      console.error("Error updating job:", error);
    } finally {
      setLoading(false); // Set loading to false after saving
    }
  };

  const handleDeleteClick = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setLoading(true); // Set loading to true while deleting
      try {
        await axios.post(`${API_URL}/jobdelete/${jobId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPostedJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== jobId));
      } catch (error) {
        setErrorMessage("Could not delete job.");
        console.error("Error deleting job:", error);
        console.log(errorMessage);
      } finally {
        setLoading(false); // Set loading to false after deleting
      }
    }
  };

  return (
    <div className={cx("container")}>
      <h1 className={cx("title")}>Your Posted Jobs</h1>
      <div className={cx("jobs")}>
        {loading ? (
          <ClipLoader className={cx("spinner")} />
        ) : postedJobs.length > 0 ? (
          postedJobs.map((job) => (
            <JobCard
              key={job.job_id}
              src={`http://localhost:8000/${job.image}`}
              name={job.title}
              address={job.location}
              position={job.company_name}
              shortdecr1={job.job_type}
              shortdecr2={job.salary}
              shortdecr3={job.created_at}
              decription={job.description}
              details={job}
              job_id={job.job_id}
              user={user}
              token={token}
              hideFooter
              onEditClick={() => handleEditClick(job)}
              onDeleteClick={() => handleDeleteClick(job.job_id)}
            />
          ))
        ) : (
          <p>You haven&apos;t posted any jobs yet.</p>
        )}
      </div>

      {/* Modal for editing job */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Job"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        <div>
          <h2>Edit Job: {selectedJob?.title}</h2>
          {Object.entries(editData).map(([key, value]) => {
            if (
              ["created_at", "updated_at", "employer_id", "posted_at", "image","job_id"].includes(
                key
              )
            )
              return null;

            if (key === "requirements" || key === "description") {
              return (
                <div key={key}>
                  <label>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    placeholder={`Enter ${key}`}
                    className={cx("textarea")}
                  />
                </div>
              );
            }

            if (key === "expires_at") {
              return (
                <div key={key}>
                  <label>
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                    </strong>
                  </label>
                  <input
                    type="datetime-local"
                    value={value}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    className={cx("datetime")}
                  />
                </div>
              );
            }

            return (
              <div key={key}>
                <label>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                  placeholder={`Enter ${key}`}
                  className={cx("input")}
                />
              </div>
            );
          })}

          <div>
            {loading ? (
              <p>Saving...</p> // Show saving text while saving job
            ) : (
              <>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
                <Button
                  className={cx("buttonClose")}
                  onClick={() => setModalIsOpen(false)}
                >
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default YourPosted;
