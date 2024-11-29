import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Modal from "react-modal";
import classNames from "classnames/bind";
import styles from "./JobCard.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import icons from "~/assets/icons";
import ClipLoader from "react-spinners/ClipLoader";
import { IoReturnDownBackOutline, IoBag, IoTime } from "react-icons/io5";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

// eslint-disable-next-line react/prop-types
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
  onDeleteClick,
  days,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal hiển thị chi tiết công việc
  const [applyModalIsOpen, setApplyModalIsOpen] = useState(false); // Modal Apply // Lấy user và token từ context
  const [isSaved, setIsSaved] = useState(false);
  // const [selectedJob, setSelectedJob] = useState(null);
  const [employerInfo, setEmployerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState(""); // Trạng thái Resume
  const [cvFile, setCvFile] = useState(null);
  const employerCache = {};
  // Step Management Reducer
  const initialState = { step: 1, progressPercentage: 30 };
  const totalSteps = 3;
  //

  const stepReducer = (state, action) => {
    switch (action.type) {
      case "NEXT":
        return {
          step: Math.min(state.step + 1, totalSteps),
          progressPercentage: Math.min(state.progressPercentage + 30, 100),
        };
      case "PREV":
        return {
          step: Math.max(state.step - 1, 1),
          progressPercentage: Math.max(state.progressPercentage - 30, 30),
        };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };
  const [stepState, dispatch] = useReducer(stepReducer, initialState);

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

  // Open Job Details Modal
  const openModal = (details) => {
    setModalIsOpen(true);
  };

  // Close Job Details Modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openApplyModal = async (details) => {
    try {
      dispatch({ type: "RESET" }); // Reset Step State
      setModalIsOpen(false);
      setApplyModalIsOpen(true);

      const employerId = details.employer_id;
      if (employerCache[employerId]) {
        setEmployerInfo(employerCache[employerId]);
      } else {
        const response = await axios.get(`http://localhost:8000/api/user/${employerId}`);
        if (response.status === 200) {
          employerCache[employerId] = response.data.user;
          setEmployerInfo(response.data.user);
        } else {
          console.error("Failed to fetch employer info.");
        }
      }
    } catch (err) {
      console.error("Error fetching employer information:", err);
    }
  };
  // Mở modal Apply
  const closeApplyModal = () => {
    setApplyModalIsOpen(false);
    setEmployerInfo(null);
    setCvFile(null);
    setResume(null);
    dispatch({ type: "RESET" });
    setIsLoading(false);
  }; // Đóng modal Apply

  const handleApplySubmit = async () => {
    setIsLoading(true);
    try {
      // Create FormData for file and other data
      const formData = new FormData();
      formData.append("job_id", details.job_id);
      formData.append("applicant_id", user.user_id);
      formData.append("cover_letter", cvFile);
      formData.append("resume_path", resume);
      formData.append("poster_id", details.employer_id);

      // Send the FormData via POST request to the API
      const response = await axios.post(
        "http://localhost:8000/api/applications",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      if (response.status === 200) {
        alert("Application submitted successfully!");
        closeApplyModal();
      } else {
        console.error("Failed to submit application.");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file); // Set CV file
    }
  };
  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("wrapper")}>
          <Image className={cx("logo")} src={src} />
          <div className={cx("group")}>
            <div className={cx("name")} onClick={() => handleClickDetails("name")}>
              {name}
            </div>
            <div className={cx("address")} onClick={() => handleClickDetails("address")}>
              {address}
            </div>
          </div>
        </div>
      </div>
      
      <div className={cx("dateAgo")}>{days}</div>
      {/* Icon Save with onClick handler */}
      <div className={cx("saveIcon")} onClick={handleSave}>
        <img
          src={isSaved ? icons.saved : icons.save} // Toggle giữa save và saved icon
          className={cx("save")}
        />
      </div>

      <div className={cx("content")}>
        <div className={cx("position")} onClick={() => handleClickDetails("position")}>
          <p className={cx("title")}>{position}</p>
        </div>
        <div className={cx("threeShortdecr")}>
          <div
            className={cx("shortdecr")}
            onClick={() => handleClickDetails("shortdecr1")}
          >
            <IoTime />
            <p className={cx("shortdecrcontent")}>{shortdecr1}</p>
          </div>
          <div
            className={cx("shortdecr")}
            onClick={() => handleClickDetails("shortdecr2")}
          >
            <RiMoneyDollarCircleFill />
            <p className={cx("shortdecrcontent")}>{shortdecr2}</p>
          </div>
          <div
            className={cx("shortdecr")}
            onClick={() => handleClickDetails("shortdecr3")}
          >
            <IoBag />
            <p className={cx("shortdecrcontent")}>
              {new Date(shortdecr3).toLocaleDateString()}{" "}
            </p>
          </div>
        </div>
        <div className={cx("longdecr")} onClick={() => handleClickDetails("description")}>
          <p className={cx("decription")}>{decription}</p>
        </div>
      </div>

      <div className={cx("footer")}>
        {hideFooter ? (
          <>
            <MdEdit className={cx("buttonEdit")} onClick={onEditClick} />
            <MdDeleteForever className={cx("buttonDelete")} onClick={onDeleteClick} />
          </>
        ) : (
          <>
            <Button className={cx("buttonApply")} onClick={() => openApplyModal(details)}>
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
        <ul className={cx("content")}>
          <h2 className={cx("header")}>{details?.title || name}</h2>
          <li className={cx("info")}>{details?.description || decription}</li>

          <li className={cx("info")}>
            <strong>Requirements:</strong>
            {details?.requirements
              ? details.requirements.split(".").map((req, index) => (
                  <ul key={index}>
                    <li>{req.trim()}</li>
                  </ul>
                ))
              : "N/A"}
          </li>

          <li className={cx("info")}>
            <strong>Company Info:</strong> {details?.company_name || position}
          </li>
          <li className={cx("info")}>
            <strong>Location:</strong> {details?.location || address}
          </li>
          <li className={cx("info")}>
            <strong>Employment Type:</strong> {details?.job_type || shortdecr1}
          </li>
          <li className={cx("info")}>
            <strong>Salary:</strong> {details?.salary || shortdecr2}
          </li>
          <li className={cx("info")}>
            <strong>Expries at:</strong> {details?.expires_at || shortdecr3}
          </li>
          <li className={cx("info")}>
            <strong>Contact Email:</strong> {details?.contact_email || "N/A"}
          </li>
          <li className={cx("info")}>
            <strong>Contact Phone:</strong> {details?.contact_phone || "N/A"}
          </li>

          {details && (
            <Button onClick={() => openApplyModal(details)} classNames={cx("btnApplyhi")}>
              Apply
            </Button>
          )}
        </ul>
      </Modal>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalIsOpen}
        onRequestClose={closeApplyModal}
        contentLabel="Apply for Job"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {employerInfo ? (
          <div className={cx("containermodel")}>
            <div className={cx("step")}>
              Step {stepState.step} of {totalSteps}
            </div>
            <div className={cx("bar")}>
              <div
                className={cx("progressBar")}
                style={{ width: `${stepState.progressPercentage}%` }}
              ></div>
            </div>

            {/* Step 1: Upload CV */}
            {stepState.step === 1 && (
              <div className={cx("content")}>
                <h3 className={cx("contentitem")}>Upload Your CV</h3>
                <h5 className={cx("contentitem")}>
                  Employers use your CV to determine whether you have the right experience
                  for the job.
                </h5>
                <h5>This file &lt; 9MB </h5>
                <input type="file" onChange={handleFileChange} />
                <Button
                  className={cx("Button")}
                  onClick={() => dispatch({ type: "NEXT" })}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Step 2: Supporting Documents */}
            {stepState.step === 2 && (
              <div className={cx("content")}>
                <h3>Do you have any supporting documents?</h3>
                <textarea
                  className={cx("resume")}
                  onChange={(e) => setResume(e.target.value)}
                />
                <IoReturnDownBackOutline
                  onClick={() => dispatch({ type: "PREV" })}
                  className={cx("btnBack")}
                />
                <Button
                  className={cx("Button")}
                  onClick={() => dispatch({ type: "NEXT" })}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Step 3: Confirm Information */}
            {stepState.step === 3 && (
              <div className={cx("content")}>
                <h3>Confirm your information</h3>
                <p>Your name: {user?.user_name}</p>
                <p>Your email: {user?.email}</p>
                <IoReturnDownBackOutline
                  onClick={() => dispatch({ type: "PREV" })}
                  className={cx("btnBack")}
                />
                <Button className={cx("Button1")} onClick={closeApplyModal}>
                  Cancel
                </Button>
                <Button
                  className={cx("Button")}
                  onClick={handleApplySubmit}
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? (
                    <ClipLoader size={20} color="#fff" loading={isLoading} /> // Show spinner
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <ClipLoader className={cx("spinner")} />
        )}
      </Modal>
    </div>
  );
}

export default JobCard;
