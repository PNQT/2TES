import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "~/components/JobCard";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";

function YourSaved() {
    const [savedJobs, setSavedJobs] = useState([]);
    const { user, token } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState(''); // Error message for unauthorized users
    const API_URL = 'http://localhost:8000/api';

    useEffect(() => {
        if (!user?.user_id) {
            console.error('User ID is missing.');
            return;
        }
    
        const fetchSavedJobs = async () => {
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
            }
        };
    
        fetchSavedJobs();
    }, [user, token]);

    return (
        <div>
            <h1>Your Saved Jobs</h1>
            <div>
                {savedJobs.length > 0 ? (
                    savedJobs.map((job) => (
                        <JobCard
                            // key={job.job_id}
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
                            user={user} // Truyền user vào JobCard
                            token={token} // Truyền token vào JobCard
                        />
                    ))
                ) : (
                    <p>You haven't saved any jobs yet.</p>
                )}
            </div>
        </div>
    );
}

export default YourSaved;
