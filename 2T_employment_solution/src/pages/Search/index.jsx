import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import Modal from 'react-modal';
import * as searchServices from '~/apiServices/searchService';
import styles from "./Search.module.scss";
import { useEffect, useState } from "react";
import Search from "~/components/Search";
import JobCard from "~/components/JobCard";

const cx = classNames.bind(styles);
Modal.setAppElement('#root');

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const [searchResult, setSearchResult] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const query = useQuery();
    const searchValue = query.get('query');

    const openModal = (job) => {
        setSelectedJob(job);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setModalIsOpen(false);
    };

    useEffect(() => {
        if (!searchValue) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            try {
                const result = await searchServices.search(searchValue);
                setSearchResult(result);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
        fetchApi();
    }, [searchValue]);

    return (
        <div className={cx("searchResults")}>
            <div className={cx("left")}><Search /></div>
            <div className={cx("groupCard")}>
                {searchResult.length > 0 ? (
                    searchResult.map((job) => (
                        <div key={job.id} className={cx("cardItem")}>
                            <JobCard 
                                src={`http://localhost:8000/${job.image}`}
                                name={job.title}
                                address={job.location}
                                position={job.benefits}
                                shortdecr1={job.employmentType}
                                shortdecr2={job.salary}
                                shortdecr3={job.deadline}
                                description={job.description}
                                onClick={() => openModal(job)}
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
                        <h1>Binnnnnnnnn</h1>
                        <h2>{selectedJob.title}</h2>
                        <p>{selectedJob.description}</p>
                        <p><strong>Requirements:</strong> {selectedJob.requirements}</p>
                        <p><strong>Benefits:</strong> {selectedJob.benefits}</p>
                        <p><strong>Company Info:</strong> {selectedJob.companyInfo}</p>
                        <p><strong>Location:</strong> {selectedJob.location}</p>
                        <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
                        <p><strong>Salary:</strong> {selectedJob.salary}</p>
                        <p><strong>Deadline:</strong> {selectedJob.deadline}</p>
                        <p><strong>Contact Email:</strong> {selectedJob.contactEmail}</p>
                        <p><strong>Contact Phone:</strong> {selectedJob.contactPhone}</p>
                        <p><strong>Application Process:</strong> {selectedJob.applicationProcess}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );                                                                                                                                              
}

export default SearchResults;                                                                                     