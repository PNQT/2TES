import { useState } from "react";
import axios from "axios";
import { useEffect } from "react"; 
import Modal from "react-modal";
import classNames from "classnames/bind";
import styles from "./JobCard.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import icons from "~/assets/icons";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function JobCard({
  src,
  name,
  address,
  position,
  shortdecr1,
  shortdecr2,
  shortdecr3,
  decription,
  details,
  user,
  job_id,
  token,
  hideFooter,
  onEditClick, 
  onDeleteClick
   // Thông tin chi tiết công việc
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal hiển thị chi tiết công việc
  const [applyModalIsOpen, setApplyModalIsOpen] = useState(false); // Modal Apply // Lấy user và token từ context
  const [isSaved, setIsSaved] = useState(false);
  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/saved_job/check`, {
          params: {
            job_id: details.job_id,
            user_id: user.user_id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsSaved(response.data.isSaved); // API trả về { isSaved: true/false }
      } catch (error) {
        console.error("Failed to check saved status:", error);
      }
    };

    checkSavedStatus();
  }, [details.job_id, user.user_id, token]);

  const handleSave = async () => {
    try {
      if (!isSaved) {
        await axios.post(
          `${API_URL}/saved_job`,
          { job_id: details.job_id, user_id: user.user_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Job saved!");
      } else {
        await axios.delete(
          `${API_URL}/saved_job`,
          {
            data: { job_id: details.job_id, user_id: user.user_id },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Job unsaved!");
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Failed to toggle saved status:", error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openApplyModal = () => setApplyModalIsOpen(true); // Mở modal Apply
  const closeApplyModal = () => setApplyModalIsOpen(false); // Đóng modal Apply

  const [coverLetter, setCoverLetter] = useState(""); // Trạng thái Cover Letter
  const [resume, setResume] = useState(""); // Trạng thái Resume

  const handleApply = () => {
    // Xử lý khi người dùng submit application (ví dụ: gọi API)
    console.log("Apply submitted with:", coverLetter, resume);
    closeApplyModal(); // Đóng modal Apply sau khi gửi
  };

 
  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("wrapper")}>
          <Image className={cx("logo")} src={src} />
          <div className={cx("group")}>
            <div className={cx("name")} onClick={() => handleClickDetails('name')}>
              {name}
            </div>
            <div className={cx("address")} onClick={() => handleClickDetails('address')}>
              {address}

            </div>
          </div>
        </div>
      </div>

      {/* Icon Save with onClick handler */}
      <div className={cx("saveIcon")} onClick={handleSave} >
        <img
          src={isSaved ? icons.saved : icons.save} // Toggle giữa save và saved icon
          className={cx("save")}
        />
      </div>

      <div className={cx("content")}>
        <div className={cx("position")} onClick={() => handleClickDetails('position')}>
          <p className={cx("title")}>{position}</p>
        </div>
        <div className={cx("threeShortdecr")}>
          <div className={cx("shortdecr")} onClick={() => handleClickDetails('shortdecr1')}>
            <p className={cx("shortdecrcontent")}>{shortdecr1}</p>
          </div>
          <div className={cx("shortdecr")} onClick={() => handleClickDetails('shortdecr2')}>
            <p className={cx("shortdecrcontent")}>{shortdecr2}</p>
          </div>
          <div className={cx("shortdecr")} onClick={() => handleClickDetails('shortdecr3')}>
            <p className={cx("shortdecrcontent")}>{shortdecr3}</p>
          </div>
        </div>
        <div className={cx("longdecr")} onClick={() => handleClickDetails('description')}>
          <p className={cx("decription")}>{decription}</p>
        </div>
      </div>

      <div className={cx("footer")}>
        {hideFooter ? (
          <>
            {/* Nút Edit */}
            <Button className={cx("buttonEdit")} onClick={onEditClick}>
              Edit
            </Button>
            {/* Nút Delete */}
            <Button className={cx("buttonDelete")} onClick={onDeleteClick}>
              Delete
            </Button>
          </> 
        ) : (
          <>
            <Button className={cx("buttonApply")} onClick={openApplyModal}>
              Apply
            </Button>
            <Button className={cx("buttonReadMore")} outline onClick={openModal}>
              Read More
            </Button>
          </>
        )}
      </div>

   


         {/* Modal Hiển thị Chi Tiết Công Việc */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Job Details"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        <div>
          <h2>{details?.title || name}</h2>
          <p>{details?.description || decription}</p>
          <p>
            <strong>Requirements:</strong> {details?.requirements || "N/A"}
          </p>
          <p>
            <strong>Company Info:</strong> {details?.company_name || position}
          </p>
          <p>
            <strong>Location:</strong> {details?.location || address}
          </p>
          <p>
            <strong>Employment Type:</strong> {details?.job_type || shortdecr1}
          </p>
          <p>
            <strong>Salary:</strong> {details?.salary || shortdecr2}
          </p>
          <p>
            <strong>Posted at:</strong> {details?.created_at || shortdecr3}
          </p>
          <p>
            <strong>Contact Email:</strong> {details?.contact_email || "N/A"}
          </p>
          <p>
            <strong>Contact Phone:</strong> {details?.contact_phone || "N/A"}
          </p>

          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>

      {/* Modal Apply */}
      <Modal
        isOpen={applyModalIsOpen}
        onRequestClose={closeApplyModal}
        contentLabel="Apply for Job"
        className={cx("modalApply")}
        overlayClassName={cx("overlay")}
      >
        <div>
          <h2>Apply for {details?.title || name}</h2>
          <div>
            <label>
              <strong>Cover Letter</strong>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here..."
              rows="4"
              className={cx("input")}
            />
          </div>
          <div>
            <label>
              <strong>Upload Resume</strong>
            </label>
            <input
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              className={cx("input")}
            />
          </div>
          <Button className={cx("buttonApply")} onClick={handleApply}>
            Submit Application
          </Button>
          <Button className={cx("buttonClose")} onClick={closeApplyModal}>
            Close
          </Button>
        </div>
    </Modal>
   </div>
  );

}

export default JobCard;
