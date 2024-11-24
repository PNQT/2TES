import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "~/components/JobCard";
import Modal from "react-modal";
import Button from "~/components/Button";
import styles from "./YourPosted.module.scss";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";

Modal.setAppElement("#root");

function YourPosted() {
  const [postedJobs, setPostedJobs] = useState([]);
  const { user, token } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState('');
  const API_URL = 'http://localhost:8000/api';

  const [selectedJob, setSelectedJob] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/jobs/YourPosted`,
          { user_id: user.user_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPostedJobs(response.data);
      } catch (error) {
        console.error('Error fetching posted jobs:', error);
        setErrorMessage('Could not fetch posted jobs.');
      }
    };

    fetchPostedJobs();
  }, [user, token]);

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setEditData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      company_name: job.company_name,
      location: job.location,
      job_type: job.job_type,
      salary: job.salary,
      contact_email: job.contact_email,
      contact_phone: job.contact_phone,
    });
    setSelectedImage(null); // Reset ảnh khi mở modal
    setModalIsOpen(true);
  };

  const handleSaveEdit = async () => {
    const tdata = new FormData();

    // Append tất cả các dữ liệu form vào FormData
    Object.keys(editData).forEach((key) => {
      if (editData[key] !== null && editData[key] !== '') {
        tdata.append(key, editData[key]);
      }
    });
    console.log('tdata:', tdata);

    try {
      const response = await axios.post(
        `${API_URL}/jobedit/${selectedJob.job_id}`,
        tdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      if(response.status === 200) {
        console.log('Job updated successfully:', response.data);  
      }
      else {
        console.log('Job updated failed:', response.data);
      }
      // Cập nhật công việc trong danh sách
      setPostedJobs((prevJobs) =>
        prevJobs.map((item) =>
          item.job_id === selectedJob.job_id ? { ...item, ...editData } : item
        )
      );

      // Đóng modal sau khi sửa thành công
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error updating job:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteClick = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (confirmDelete) {
      try {
        await axios.post(`${API_URL}/jobdelete/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPostedJobs(postedJobs.filter((job) => job.job_id !== jobId));
      } catch (error) {
        console.error("Error deleting job:", error);
        setErrorMessage('Could not delete job.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file); // Lưu ảnh đã chọn vào trạng thái
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Posted Jobs</h1>
      <div className={styles.jobs}>
        {postedJobs.length > 0 ? (
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
              description={job.description}
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
          <p>You haven't posted any jobs yet.</p>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Job"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div>
          <h2>Edit Job: {selectedJob?.title}</h2>
          <div>
            <label><strong>Title</strong></label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Job Title"
              className={styles.input}
            />
          </div>
          <div>
            <label><strong>Description</strong></label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Job Description"
              rows="4"
              className={styles.input}
            />
          </div>
          <div>
            <label><strong>Requirements</strong></label>
            <input
              type="text"
              value={editData.requirements}
              onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
              placeholder="Job Requirements"
              className={styles.input}
            />
          </div>
          <div>
            <label><strong>Location</strong></label>
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              placeholder="Location"
              className={styles.input}
            />
          </div>
          <div>
            <label><strong>Job Type</strong></label>
            <input
              type="text"
              value={editData.job_type}
              onChange={(e) => setEditData({ ...editData, job_type: e.target.value })}
              placeholder="Job Type"
              className={styles.input}
            />
          </div>
          <div>
            <label><strong>Salary</strong></label>
            <input
              type="text"
              value={editData.salary}
              onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
              placeholder="Salary"
              className={styles.input}
            />
          </div>
          <div>
            <label><strong>Contact Email</strong></label>
            <input
              type="email"
              value={editData.contact_email}
              onChange={(e) => setEditData({ ...editData, contact_email: e.target.value })}
              placeholder="Contact Email"
              className={styles.input}
            />
          </div>
          <div>
            <label><strong>Contact Phone</strong></label>
            <input
              type="text"
              value={editData.contact_phone}
              onChange={(e) => setEditData({ ...editData, contact_phone: e.target.value })}
              placeholder="Contact Phone"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label><strong>Job Image</strong></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.inputField}
            />
            {selectedImage && (
              <p>Selected image: {selectedImage.name}</p>
            )}
          </div>
          <div>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
            <Button className={styles.buttonClose} onClick={() => setModalIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default YourPosted;
