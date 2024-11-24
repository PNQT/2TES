import { useState, useEffect, useReducer } from "react";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import * as searchServices from "~/apiServices/searchService";
import styles from "./Search.module.scss";
import Search from "~/components/Search";
import JobCard from "~/components/JobCard";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";
import Button from "~/components/Button";
import axios from "axios";
import { IoReturnDownBackOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { debounce } from "lodash";

const cx = classNames.bind(styles);
Modal.setAppElement("#root");

// Custom Hook for Query Parsing
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Step Management Reducer
const initialState = { step: 1, progressPercentage: 30 };
const totalSteps = 3;

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

function SearchResults() {
  const [searchResult, setSearchResult] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [applyModalIsOpen, setApplyModalIsOpen] = useState(false);
  const [employerInfo, setEmployerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Cache user info
  const [stepState, dispatch] = useReducer(stepReducer, initialState);

  const query = useQuery();
  const searchValue = query.get("query");

  // Cache for employer info
  const employerCache = {};

  // Fetch Current User Info (with Cache)
  const fetchCurrentUser = async () => {
    if (currentUser) return currentUser; // Use cache if available
    try {
      const response = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const user = response.data;
      setCurrentUser(user);
      console.log("User info:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  // Debounced Fetch for Search Results
  const fetchSearchResults = debounce(async (query) => {
    setIsLoading(true);
    try {
      const results = await searchServices.search(query);
      setSearchResult(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  }, 500); // Debounce 500ms

  useEffect(() => {
    if (!searchValue) {
      setSearchResult([]);
      return;
    }
    fetchSearchResults(searchValue);
  }, [searchValue]);

  // Open Job Details Modal
  const openModal = (job) => {
    setSelectedJob(job);
    setModalIsOpen(true);
  };

  // Close Job Details Modal
  const closeModal = () => {
    setSelectedJob(null);
    setModalIsOpen(false);
  };

  // Open Apply Modal
  const openApplyModal = async (job) => {
    try {
      dispatch({ type: "RESET" }); // Reset Step State
      setModalIsOpen(false);
      setApplyModalIsOpen(true);
      setSelectedJob(job);
      fetchCurrentUser();

      const employerId = job.employer_id;
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

  // Close Apply Modal
  const closeApplyModal = () => {
    setApplyModalIsOpen(false);
    setEmployerInfo(null);
    setCvFile(null);
    setResume(null);
    dispatch({ type: "RESET" });
    setIsLoading(false);
  };

  // Handle file change (CV)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file); // Set CV file
    }
  };

  // Handle Apply Submission with File Upload
  const handleApplySubmit = async () => {
    setIsLoading(true);
    try {
      // Create FormData for file and other data
      const formData = new FormData();
      formData.append("job_id", selectedJob.job_id);
      formData.append("applicant_id", currentUser.user_id);
      formData.append("cover_letter", cvFile); // CV file
      formData.append("resume_path", resume); // Resume text (optional)
      formData.append("poster_id", selectedJob.employer_id);

      const token = localStorage.getItem("token");

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

  return (
    <div className={cx("searchResults")}>
      <div className={cx("left")}>
        <Search />
      </div>
      <div className={cx("groupCard")}>
        {isLoading ? (
          <ClipLoader className={cx("spinner")} />
        ) : searchResult.length > 0 ? (
          searchResult.map((job) => (
            <div key={job.job_id} className={cx("cardItem")}>
              <JobCard
                src={`http://localhost:8000/${job.image}`}
                name={job.title}
                address={job.location}
                position={job.company_name}
                shortdecr1={job.job_type}
                shortdecr2={job.salary}
                shortdecr3={job.created_at}
                description={job.description}
                onClick={() => openModal(job)}
                onApplyClick={() => openApplyModal(job)}
              />
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Job Details"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedJob && (
          <div>
            <h1>{selectedJob.title}</h1>
            <p>{selectedJob.description}</p>
            <Button onClick={() => openApplyModal(selectedJob)}>Apply</Button>
          </div>
        )}
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
          <div className={cx("container")}>
            <div className={cx("step")}>Step {stepState.step} of {totalSteps}</div>
            <div className={cx("bar")}>
              <div className={cx("progressBar")} style={{ width: `${stepState.progressPercentage}%` }}></div>
            </div>

            {/* Step 1: Upload CV */}
            {stepState.step === 1 && (
              <div className={cx("content")}>
                <h3 className={cx("contentitem")}>Upload Your CV</h3>
                <h5 className={cx("contentitem")}>
                  Employers use your CV to determine whether you have the right experience for the job.
                </h5>
                <h5>This file &lt; 9MB </h5>
                <input type="file" onChange={handleFileChange} />
                <Button className={cx("Button")} onClick={() => dispatch({ type: "NEXT" })}>Next</Button>
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
                <IoReturnDownBackOutline onClick={() => dispatch({ type: "PREV" })} className={cx("btnBack")} />
                <Button className={cx("Button")} onClick={() => dispatch({ type: "NEXT" })}>Next</Button>
              </div>
            )}


//         if (!user || !token) {
//             // Nếu không có user hoặc token, không gọi API và có thể thông báo cho người dùng
//             console.log("No user or token found, cannot fetch search results.");
//             return;
//         }

//         const fetchApi = async () => {
//             try {
//                 const result = await searchServices.search(searchValue);
//                 setSearchResult(result);
//             } catch (error) {
//                 console.error('Error fetching search results:', error);
//             }
//         };
//         fetchApi();
//     }, [searchValue, user, token]); // Khi searchValue, user hoặc token thay đổi

//     return (
//         <div className={cx("searchResults")}>
//             <div className={cx("left")}><Search /></div>
//             <div className={cx("groupCard")}>
//                 {searchResult.length > 0 ? (
//                     searchResult.map((job) => (
//                         <div key={job.job_id} className={cx("cardItem")}>
//                             <JobCard 
//                                 key={job.job_id}
//                                 src={`http://localhost:8000/${job.image}`}
//                                 name={job.title}
//                                 address={job.location}
//                                 position={job.company_name}
//                                 shortdecr1={job.job_type}
//                                 shortdecr2={job.salary}
//                                 shortdecr3={job.created_at}
//                                 decription={job.description}
//                                 details={job} // Truyền dữ liệu chi tiết
//                                 job_id={job.job_id}
//                                 user={user} // Truyền user vào JobCard
//                                 token={token} // Truyền token vào JobCard
//                             />
//                         </div>
//                     ))
//                 ) : (
//                     <p>No results found</p>
//                 )}
//             </div>  
//         </div>
//     );

            {/* Step 3: Confirm Information */}
            {stepState.step === 3 && (
              <div className={cx("content")}>
                <h3>Confirm your information</h3>
                <p>Your name: {currentUser?.user_name}</p>
                <p>Your email: {currentUser?.email}</p>
                <IoReturnDownBackOutline onClick={() => dispatch({ type: "PREV" })} className={cx("btnBack")} />
                <Button className={cx("Button1")} onClick={closeApplyModal}>Cancel</Button>
                <Button className={cx("Button")} onClick={handleApplySubmit}>Submit</Button>
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

export default SearchResults;
