/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import * as searchServices from "~/apiServices/searchService";
import styles from "./Search.module.scss";
import Search from "~/components/Search";
import JobCard from "~/components/JobCard";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";

import ClipLoader from "react-spinners/ClipLoader";
import { debounce } from "lodash";
import axios from "axios";

const cx = classNames.bind(styles);
Modal.setAppElement("#root");

// Custom Hook for Query Parsing
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token ,isLoading1 ,user_id} = useContext(AppContext);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const API_URL = "http://localhost:8000/api";
  const query = useQuery();
  const searchValue = query.get("query");

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
  }, 500); 

  
  useEffect(() => {
    if (!searchValue) {
      setSearchResult([]);
      return;
    }
   
    fetchSavedJobs();
      console.log("fetching search results for query:", query);
    fetchSearchResults(searchValue);
  }, [searchValue]);

  if (isLoading1) {
    return <p>Loading...</p>;
  }
  if (!user_id) {
    return <p>Loading...</p>;
  }
  if(!token){
    return <p>login</p>;
  }
  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/saved_job/check`, {
        params: { user_id: user.user_id },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về

      setSavedJobIds(response.data.savedJobIds || []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
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
                decription={job.description}
                details={job}
                status={savedJobIds && savedJobIds.includes(job.job_id)}
                job_id={job.job_id}
                user={user}
                token={token}              
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
