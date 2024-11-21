import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import classNames from "classnames/bind";
import styles from "./Notification.module.scss";
import TagNotification from "~/components/TagNotification";
import axios from "axios";


const cx = classNames.bind(styles);

function Notification() {
    const [visible, setVisible] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifi, setNotifi] = useState([]);
    const [posterId, setPosterId] = useState(null);
    const [emails, setEmails] = useState({}); 
    const [names, setNames] = useState({});

    // Fetch `posterId` khi component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setPosterId(response.data.user_id);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const emailPromises = notifi.map(async (notification) => {
                    const id = notification.applicant_id;
                    const res = await axios.get(`http://localhost:8000/api/user/${id}`);
                    const res2 = await axios.get(`http://localhost:8000/api/jobs/${notification.job_id}`);
                    
                    const name = res2.data.job && res2.data.job.length > 0 ? res2.data.job[0].title : 'Job title not found';
                    
                    const email = res.data.user ? res.data.user.email : 'Email not found';  
    
                    
                    return { id, email, name }; 
                });
    
                const emailResults = await Promise.all(emailPromises);
    
                const emailMap = {};
                const nameMap = {};
    
                emailResults.forEach(({ id, email, name }) => {
                    emailMap[id] = email;
                    nameMap[id] = name;
                  
                });
    
                setEmails(emailMap);
                setNames(nameMap);
    
            } catch (error) {
                console.error("Error fetching emails or job data:", error);
            }
        };
    
        if (notifi.length > 0) {
            fetchEmails();
        } else {
            setEmails({});
            setNames({});
        }
    
    }, [notifi]); // Dependency array to re-run when 'notifi' changes
    

   
    const handleClick = () => {
        setVisible(!visible);
    };
    
    useEffect(() => {
        const fetchNotifications = async (posterId) => {
            if (!posterId) return; 
            try {
                const res = await axios.get(`http://localhost:8000/api/notifiaction/${posterId}`);
                if (res.status === 200) {
                    setNotifi(res.data.data);
                    const unread = res.data.data.filter((n) => n.status === "unread").length;
                    setUnreadCount(unread);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        const interval = setInterval(() => {
            if (posterId) {
                fetchNotifications(posterId);
            }
        }, 5000); 

        return () => clearInterval(interval); // Clear interval khi component unmount
    }, [posterId]);

    return (
        <div className={cx("notification-container")}>
            <Tippy
                content={
                    <>
                        <h1 className={cx("header")}>Thông Báo</h1>
                        <div className={cx("notification")}>
                            {notifi.map((notification, index) => (
                                <TagNotification
                                    key={index}
                                    user={emails[notification.applicant_id] || "Đang tải..."} 
                                    jobName={names[notification.job_id] || "Đang tải..."}
                                    isUnread={notification.status === "unread"}
                                    job_id={notification.job_id}
                                    poster_id={notification.poster_id}
                                />
                            ))
                             
                            }
                        </div>
                    </>
                }
                visible={visible}
                interactive
                onClickOutside={() => setVisible(false)}
                // trigger="mouseenter focus"
                placement="bottom"
            >
                <div className={cx("group-notification")}>
                    <IoIosNotificationsOutline
                        className={cx("notification-icon")}
                        onClick={handleClick}
                    />
                    {unreadCount > 0 && (
                        <span className={cx("notification-count")}>
                            {/* {unreadCount} */}
                        </span>
                    )}
                </div>
            </Tippy>
        </div>
    );
}

export default Notification;
