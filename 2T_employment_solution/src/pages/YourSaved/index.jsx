import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "~/components/JobCard";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";
import { ClipLoader } from "react-spinners";
import classNames from "classnames/bind";
import styles from "./YourSaved.module.scss";
import AOS from "aos";
import "aos/dist/aos.css";

const cx = classNames.bind(styles);

function YourSaved() {
    const [savedJobs, setSavedJobs] = useState([]);
    const { user, token } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState(''); // Error message for unauthorized users
    const API_URL = 'http://localhost:8000/api';
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        AOS.init();
    })

    useEffect(() => {
        if (!user?.user_id) {
            console.error('User ID is missing.');
            return;
        }
    
        const fetchSavedJobs = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${API_URL}/jobs/YourSaved`,
                    { user_id: user.user_id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSavedJobs(response.data);
            } catch (error) {
                console.error('Error fetching saved jobs:', error);
                setErrorMessage('Could not fetch saved jobs.');
                console.log(errorMessage);
            } finally {
                setLoading(false);
            }
        };
    
        fetchSavedJobs();
    }, [user, token]);

    return (
        <div className={cx("container")}>
        <h1 className={cx("title")}>Your Saved Jobs</h1>
       <div
        className={cx("jobs")}>
        {loading ? (
          <ClipLoader className={cx("spinner")} />
        ) : savedJobs.length > 0 ? (
            savedJobs.map((job, index) => (
            <div
              key={job.job_id}
              data-aos={
                index % 3 === 0 ? "fade-right" : index % 3 === 1 ? "fade-right" : "fade-right"
              }
              data-aos-delay={index % 3 === 0 ? "300" : index % 3 === 1 ? "650" : "1000"}
            >
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
                job_id={job.job_id}
                user={user}
                token={token}
                hideFooter
                className={cx("job")}
              />
            </div>
          ))
        ) : (
          <p>You haven&apos;t posted any jobs yet.</p>
        )}
      </div>
        </div>
    );
}

export default YourSaved;
