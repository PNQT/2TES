import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import * as searchServices from "~/apiServices/searchService";
import styles from "./Search.module.scss";
import { useEffect, useState } from "react";
import Search from "~/components/Search";
import JobCard from "~/components/JobCard";
import Button from "~/components/Button";
import axios from "axios";

const cx = classNames.bind(styles);
Modal.setAppElement("#root");

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const [searchResult, setSearchResult] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [applyModalIsOpen, setApplyModalIsOpen] = useState(false);
    const [employerInfo, setEmployerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const query = useQuery();
    const searchValue = query.get("query");

        

    // Open modal for job details
    const openModal = (job) => {
        setSelectedJob(job);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setModalIsOpen(false);
    };

    // Open apply modal and fetch employer info
    const openApplyModal = async (job) => {
        try {
            setModalIsOpen(false); // Close Job Details modal
            setApplyModalIsOpen(true); // Open Apply modal
            setSelectedJob(job); // Save the job details for applying
            const response = await axios.get(`http://localhost:8000/api/user/${job.employer_id}`);
            if (response.status === 200) {
                setEmployerInfo(response.data.user);
            } else {
                console.error("Failed to fetch employer info.");
            }
        } catch (err) {
            console.error("Error fetching employer information:", err);
        }
    };

    const closeApplyModal = () => {
        setApplyModalIsOpen(false);
        setEmployerInfo(null);
    };

    // Fetch search results
    useEffect(() => {
        if (!searchValue) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            setIsLoading(true);
            try {
                const result = await searchServices.search(searchValue);
                setSearchResult(result);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApi();
    }, [searchValue]);

    const getUserId = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.user_id;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }
    };

  

    // Handle apply submit for job
    const handleApplySubmit = async (jobId,  posterID) => {
        try {
            const  applicant_id = await getUserId();
            const token = localStorage.getItem("token");
            console.log(jobId ,applicant_id, posterID,token)
            const response = await axios.post(
                "http://localhost:8000/api/applications",
                {
                    job_id: jobId,
                    applicant_id: applicant_id,
                    cover_letter: 'Eiu oi',
                    resume_path: 'bin nè',
                    poster_id: posterID
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
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
        }
    };

    return (
        <div className={cx("searchResults")}>
            <div className={cx("left")}>
                <Search />
            </div>
            <div className={cx("groupCard")}>
                {isLoading ? (
                    <p>Loading...</p>
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
                                decription={job.description}
                                onClick={() => openModal(job)}
                                onApplyClick={() => openApplyModal(job)} // Handle Apply modal for job
                                id={job.job_id}
                            />
                        </div>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>
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
                        <Button onClick={() => openApplyModal(selectedJob)}>
                            Apply
                        </Button>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={applyModalIsOpen}
                onRequestClose={closeApplyModal}
                contentLabel="Apply for Job"
                className={cx("modal")}
                overlayClassName={cx("overlay")}
            >
                {employerInfo ? (
                    <div>
                        <h2>Employer Info</h2>
                        <p><strong>Name:</strong> {employerInfo.user_name}</p>
                        <p><strong>Email:</strong> {employerInfo.email}</p>
                        <p><strong>Phone:</strong> {employerInfo.phone}</p>
                        <p><strong>Address:</strong> {employerInfo.address}</p>
                        <Button onClick={() => handleApplySubmit(selectedJob.job_id, selectedJob.employer_id)}>
                            Apply
                        </Button>
                    </div>
                ) : (
                    <p>Loading employer info...</p>
                )}
            </Modal>
        </div>
    );
}

export default SearchResults;
