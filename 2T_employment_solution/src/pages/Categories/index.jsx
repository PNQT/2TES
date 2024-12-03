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
import AOS from "aos";
import "aos/dist/aos.css";

const cx = classNames.bind(styles);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Categories() {
  const query = useQuery();
  const [searchResult, setSearchResult] = useState([]);
  const searchValue = query.get("query");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, token } = useContext(AppContext);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const API_URL = "http://localhost:8000/api";
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init(); 
  }, []);

  const calculateTime = (created_at) => {
    const now = new Date();
    const postTime = new Date(created_at);

    const diffInMs = now - postTime;
    let diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes === 0) {
      diffInMinutes = 1;
    }
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

  // Fetch saved jobs and job listings together
  useEffect(() => {
    const fetchJobsAndSavedJobs = async () => {
      if (!user?.user_id) return;

      try {
        // Fetch saved jobs
        const savedJobResponse = await axios.get(`${API_URL}/saved_job/check`, {
          params: { user_id: user.user_id },
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedJobIds = savedJobResponse.data.savedJobIds || [];

        setSavedJobIds(savedJobIds); // Set saved job IDs state

        // Fetch job listings
        const jobsResponse = await axios.get(`${API_URL}/joball`);
        setJobs(jobsResponse.data);

        // Update the job listings with saved status
        const updatedJobs = jobsResponse.data.map((job) => ({
          ...job,
          status: savedJobIds.includes(job.job_id),
        }));

        setJobs(updatedJobs); // Update job listings with saved status
      } catch (error) {
        console.error("Error fetching jobs or saved jobs:", error);
        setErrorMessage("Could not fetch jobs.");
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    if (user) {
      fetchJobsAndSavedJobs(); // Fetch both jobs and saved jobs when user exists
    }
  }, [user, token]);

  // Handle search
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
    fetchSearchResults(searchValue);
  }, [searchValue]);

  const getAnimationClass = (index) => {
    const mod = index % 4;
    if (mod === 3) {
      return "fade-left";
    } else if (mod === 2 || mod === 1) {
      return "zoom-in";
    } else {
      return "fade-right";
    }
  };

  const renderJobCards = (jobs) =>
    jobs.map((job, index) => (
      <div key={job.job_id} className={cx("jobs")} data-aos={getAnimationClass(index)}>
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
          status={job.status} 
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
              <div className={cx("jobs")}>{renderJobCards(searchResult)}</div>
            </div>
          ) : (
            <div className={cx("wrapper")}>
              <h1 className={cx("title")}>Job Listings</h1>
              <div className={cx("jobs")}>
                {errorMessage ? (
                  <p>{errorMessage}</p>
                ) : jobs.length === 0 ? (
                  <p>No jobs available</p>
                ) : (
                  renderJobCards(jobs)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;
