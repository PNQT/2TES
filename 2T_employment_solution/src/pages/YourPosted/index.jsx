import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "~/components/JobCard";
import { AppContext } from "~/Context/AppContext";
import { useContext } from "react";



function YourPosted() {
    const [postedJobs, setPostedJobs] = useState([]);
    const { user, token } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState(''); // Error message for unauthorized users
    // const userId = localStorage.getItem('user_id'); // Lấy user_id từ localStorage (hoặc từ context/state)
    const API_URL = 'http://localhost:8000/api';

    useEffect(() => {
        // if (!user || !user.user_id) return; // Không làm gì nếu user chưa sẵn sàng
    
        const fetchPostedJobs = async () => {
            try {
                const response = await axios.post(
                    `${API_URL}/jobs/YourPosted`,
                    { user_id: user.user_id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Dùng token từ context
                        },
                    }
                );
                setPostedJobs(response.data);
            } catch (error) {
                console.error('Error fetching posted jobs:', error);
                setErrorMessage('Could not fetch posted jobs.');
            }
        };
    
        fetchPostedJobs();
    }, [user, token]);
    return (
        <div>
            <h1>Your Posted Jobs</h1>
            <div>
                {postedJobs.length > 0 ? (
                    postedJobs.map((job) => (
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
                        />
                    ))
                ) : (
                    <p>You haven't posted any jobs yet.</p>
                )}
            </div>
        </div>
    );
}

export default YourPosted;
