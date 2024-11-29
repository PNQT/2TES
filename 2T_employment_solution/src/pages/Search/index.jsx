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
  }, 500); // Debounce 500ms

  useEffect(() => {
    if (!searchValue) {
      setSearchResult([]);
      return;
    }
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
                user={user}
                job_id={job.job_id}
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
