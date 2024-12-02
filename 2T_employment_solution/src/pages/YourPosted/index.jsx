    import { useEffect, useState, useContext } from "react";
    import axios from "axios";
    import JobCard from "~/components/JobCard";
    import Modal from "react-modal";
    import Button from "~/components/Button";
    import styles from "./YourPosted.module.scss";
    import { AppContext } from "~/Context/AppContext";
    import { ClipLoader } from "react-spinners";
    import classNames from "classnames/bind";
    import { toast } from "react-toastify";
    const cx = classNames.bind(styles);
    Modal.setAppElement("#root");
    import AOS from "aos";
    import "aos/dist/aos.css";

    function YourPosted() {
      const [postedJobs, setPostedJobs] = useState([]);
      const [loading, setLoading] = useState(false); // Loading state
      const [errorMessage, setErrorMessage] = useState("");
      const [selectedJob, setSelectedJob] = useState(null);
      const [modalIsOpen, setModalIsOpen] = useState(false);
      const [editData, setEditData] = useState({});

      const [applicantData, setApplicantData] = useState(null);
      const [applicantModalIsOpen, setApplicantModalIsOpen] = useState(false);
      const [actionLoading, setActionLoading] = useState(false); // Loading state for actions
      const [settingNoti, setSettingNoti] = useState(false);
      const { user, user_id, token } = useContext(AppContext);
      const API_URL = "http://localhost:8000/api";

      useEffect(() => {
        AOS.init({});
      });

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
            console.log(errorMessage);
            console.error("Error fetching posted jobs:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchPostedJobs();
      }, [user, token]);

      // Update job details in the form
      const handleEditClick = (job) => {
        setSelectedJob(job);
        setEditData({ ...job });
        setModalIsOpen(true);
      };

      // Save edited job details
      const handleSaveEdit = async () => {
        setLoading(true);
        const formData = new FormData();

        Object.keys(editData).forEach((key) => {
          if (
            editData[key] !== null &&
            editData[key] !== "" &&
            ![
              "created_at",
              "updated_at",
              "employer_id",
              "posted_at",
              "image",
              "job_id",
            ].includes(key)
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
            toast.success("Job updated successfully!");
          } else {
            toast.error("Failed to update the job. Please try again.");
            console.error("Job update failed:", response.data);
          }
        } catch (error) {
          toast.error("An error occurred while updating the job.");
          console.error("Error updating job:", error);
        } finally {
          setLoading(false); 
        }
      };

      const handleDeleteClick = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
          setLoading(true); 
          try {
            await axios.post(`${API_URL}/jobdelete/${jobId}`, null, {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            setPostedJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== jobId));
            toast.success("Job deleted successfully!");
          } catch (error) {
            toast.error("Failed to delete the job. Please try again.");
            console.error("Error deleting job:", error);
          } finally {
            setLoading(false); 
          }
        }
      };

      const handleCheckClick = async (jobId) => {
        console.log(jobId);
        setSettingNoti(true);
        try {
          const res = await axios.get(`${API_URL}/getJobApplicants/${jobId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.status === 200) {
            console.log("Applicants fetched successfully");
            const applicantsWithStatus = res.data.map((applicant) => ({
              ...applicant,
              review_status: applicant.review_status || "pending",
            }));
            setApplicantData(applicantsWithStatus); // Store the retrieved data with default status
            setApplicantModalIsOpen(true); // Open the modal
          } else {
            console.log("Failed to fetch applicants");
          }
        } catch (error) {
          setErrorMessage("Could not fetch applicants.");
          console.error("Error fetching applicants:", error);
          setSettingNoti(false);
        }
      };

      const handleApprove = async (applicationId) => {
        setActionLoading(true); // Start loading
        try {
          const res = await axios.post(
            `${API_URL}/application/approve/${applicationId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.status === 200) {
            setApplicantData(
              applicantData.map((app) =>
                app.application_id === applicationId
                  ? { ...app, review_status: "approved" }
                  : app
              )
            );
            console.log("Application approved successfully");
            toast.success("Ứng viên đã được duyệt thành công!");
          } else {
            toast.error("Duyệt ứng viên thất bại.");
          }
        } catch (error) {
          console.error("Error approving application:", error);
          toast.error("Có lỗi xảy ra khi duyệt ứng viên.");
        } finally {
          setActionLoading(false); // End loading
        }
      };

      const handleReject = async (applicationId) => {
        setActionLoading(true); // Start loading
        try {
          const res = await axios.post(
            `${API_URL}/application/reject/${applicationId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.status === 200) {
            setApplicantData(
              applicantData.map((app) =>
                app.application_id === applicationId
                  ? { ...app, review_status: "rejected" }
                  : app
              )
            );
            console.log("Application rejected successfully");
            toast.info("Ứng viên đã bị từ chối.");
          } else {
            toast.error("Từ chối ứng viên thất bại.");
          }
        } catch (error) {
          console.error("Error rejecting application:", error);
          toast.error("Có lỗi xảy ra khi từ chối ứng viên.");
        } finally {
          setActionLoading(false); // End loading
        }
      };

      return (
        <div className={cx("container")}>
          <h1 className={cx("title")}>Your Posted Jobs</h1>
          <div
            className={cx("jobs")}>
            {loading ? (
              <ClipLoader className={cx("spinner")} />
            ) : postedJobs.length > 0 ? (
              postedJobs.map((job, index) => (
                <div
                  key={job.job_id}
                  data-aos={
                    index % 3 === 0 ? "fade-right" : index % 3 === 1 ? "fade-right" : "fade-right"
                  }
                  data-aos-delay={index % 3 === 0 ? "300" : index % 3 === 1 ? "650" : "1000"}
                >
                  <JobCard
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
                    onCheckClick={() => handleCheckClick(job.job_id)}
                    className={cx("job")}
                  />
                </div>
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
                  [
                    "created_at",
                    "updated_at",
                    "employer_id",
                    "posted_at",
                    "image",
                    "job_id",
                  ].includes(key)
                )
                  return null;

                if (key === "requirements" || key === "description") {
                  return (
                    <div key={key} >
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
                  <>
                    <ClipLoader className={cx("spinner")} />
                    <p>Saving...</p>
                  </> // Show saving text while saving job
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

          {/* Modal for confirming delete (Optional: Improve functionality) */}
          <Modal>
            <div>
              <h2>Are you sure you want to delete this job?</h2>
              <Button onClick={() => setModalIsOpen(false)}>No</Button>
              <Button onClick={() => setModalIsOpen(false)}>Yes</Button>
            </div>
          </Modal>

          {/* Modal for displaying applicants */}
          <Modal
            isOpen={applicantModalIsOpen}
            onRequestClose={() => setApplicantModalIsOpen(false)}
            contentLabel="Applicants Details"
            className={cx("modal")}
            overlayClassName={cx("overlay")}
          >
            <div>
              <h2>Applicants for {selectedJob?.title}</h2>
              {applicantData && applicantData.length > 0 ? (
                <ul>
                  {applicantData.map((applicant, index) => (
                    <li key={index}>
                      <h5>Applicant {index + 1}</h5>
                      <p>
                        <strong>Name:</strong> {applicant.user_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {applicant.email}
                      </p>
                      <p>
                        <strong>Cover Letter:</strong> {applicant.cover_letter}
                      </p>
                      <p>
                        <strong>Resume :</strong> {applicant.resume_path}
                      </p>
                      <p>
                        <strong>Applied at:</strong> {applicant.applied_at}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <span
                          className={cx(`status-${applicant.review_status || "pending"}`)}
                        >
                          {applicant.review_status
                            ? applicant.review_status.charAt(0).toUpperCase() +
                              applicant.review_status.slice(1)
                            : "Pending"}
                        </span>
                      </p>
                      <div>
                        {actionLoading ? (
                          <ClipLoader className={cx("spinner")} />
                        ) : (
                          <>
                            <Button
                              onClick={() => handleApprove(applicant.application_id)}
                              disabled={applicant.review_status === "approved"}
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(applicant.application_id)}
                              disabled={applicant.review_status === "rejected"}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No applicants found for this job.</p>
              )}
              <Button onClick={() => setApplicantModalIsOpen(false)}>Close</Button>
            </div>
          </Modal>
        </div>
      );
    }

    export default YourPosted;
