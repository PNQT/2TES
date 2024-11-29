import { useEffect, useState, useContext } from "react";
import axios from "axios";
import JobCard from "~/components/JobCard";
import styles from "./Categories.module.scss";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { AppContext } from "~/Context/AppContext";
import { useLocation } from "react-router-dom";
import Search from "~/components/Search";
import ClipLoader from "react-spinners/ClipLoader";
import { debounce } from "lodash";
import * as searchServices from "~/apiServices/searchService";

const cx = classNames.bind(styles);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Categories() {
  const query = useQuery();
  const [searchResult, setSearchResult] = useState([]);
  const searchValue = query.get("query");
  const [jobs, setJobs] = useState([]);
  const [visibleJobsCount, setVisibleJobsCount] = useState(8);
  const [incrementCount] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, token } = useContext(AppContext);
  const API_URL = "http://localhost:8000/api";
  const navigate = useNavigate();

  const calculateTime = (created_at) => {
    const now = new Date();
    const postTime = new Date(created_at);

    const diffInMs = now - postTime;
    const diffInMinutes = Math.max(Math.floor(diffInMs / (1000 * 60)), 1);
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  };

  if (!token) {
    alert("You need to log in to view this page.");
    navigate("/login");
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/joball`);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setErrorMessage("Could not fetch jobs.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchSearchResults = debounce(async (query) => {
    setIsLoading(true);
    try {
      const results = await searchServices.search(query);
      setSearchResult(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setErrorMessage("Error fetching search results.");
    } finally {
      setIsLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (!searchValue) {
      setSearchResult([]);
      return;
    }
    fetchSearchResults(searchValue);
  }, [searchValue]);

  const visibleJobs = jobs.slice(0, visibleJobsCount);

  const handleLoadMore = () => {
    setVisibleJobsCount((prev) => prev + incrementCount);
  };

  // const hadleRessetCount = () => {
  //   setVisibleJobsCount(8);
  // };

  const renderJobCards = (jobs) =>
    jobs.map((job) => (
      <div key={job.job_id} className={cx("jobs")}>
        <JobCard
          src={`http://localhost:8000/${job.image}`}
          name={job.title}
          address={job.location}
          position={job.company_name}
          shortdecr1={job.job_type}
          shortdecr2={job.salary}
          shortdecr3={job.expires_at}
          decription={job.description}
          details={job}
          user={user}
          job_id={job.job_id}
          token={token}
          className={cx("job")}
          days={calculateTime(job.created_at)}
        />
      </div>
    ));

  return (
    <div className={cx("container")}>
      <div className={cx("searchResults")}>
        <div className={cx("left")}>
          <Search className={cx("search")} />
        </div>
        <div className={cx("groupCard")}>
          {isLoading ? (
            <ClipLoader className={cx("spinner")} />
          ) : searchResult.length > 0 ? (
            <div className={cx("wrapper")}>
              <div className={cx("jobs")}>
                {renderJobCards(searchResult)}
                </div>
                {visibleJobsCount < jobs.length && (
                <div className={cx("load-more")}>
                  <button
                    onClick={handleLoadMore}
                    className={cx("load-more-button")}
                  >
                    Load-More
                  </button>
                </div>
              )}
              </div>
          ) : (
            <div className={cx("wrapper")}>
              <h1 className={cx("title")}>Job Listings</h1>
              <div className={cx("jobs")}>
                {errorMessage ? (
                  <p>{errorMessage}</p>
                ) : visibleJobs.length > 0 ? (
                  renderJobCards(visibleJobs)
                ) : (
                  <p>No jobs available</p>
                )}
              </div>
              {visibleJobsCount < jobs.length && (
                <div className={cx("load-more")}>
                  <button
                    onClick={handleLoadMore}
                    className={cx("load-more-button")}
                  >
                    Load-More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;
