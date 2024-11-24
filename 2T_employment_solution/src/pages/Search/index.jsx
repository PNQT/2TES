import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import Modal from 'react-modal';
import * as searchServices from '~/apiServices/searchService';
import styles from "./Search.module.scss";
import { useEffect, useState } from "react";
import Search from "~/components/Search";
import JobCard from "~/components/JobCard";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";

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
    
    // Lấy user và token từ context hoặc localStorage
    const { user, token } = useContext(AppContext); // Nếu bạn dùng Context API
    // const user = JSON.parse(localStorage.getItem('user')) || null; // Nếu lưu trữ trong localStorage
    // const token = localStorage.getItem('token') || null;

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

        if (!user || !token) {
            // Nếu không có user hoặc token, không gọi API và có thể thông báo cho người dùng
            console.log("No user or token found, cannot fetch search results.");
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
    }, [searchValue, user, token]); // Khi searchValue, user hoặc token thay đổi

    return (
        <div className={cx("searchResults")}>
            <div className={cx("left")}><Search /></div>
            <div className={cx("groupCard")}>
                {searchResult.length > 0 ? (
                    searchResult.map((job) => (
                        <div key={job.job_id} className={cx("cardItem")}>
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
                                details={job} // Truyền dữ liệu chi tiết
                                job_id={job.job_id}
                                user={user} // Truyền user vào JobCard
                                token={token} // Truyền token vào JobCard
                            />
                        </div>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>  
        </div>
    );
}

export default SearchResults;
