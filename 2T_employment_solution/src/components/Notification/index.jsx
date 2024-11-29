import { useState, useEffect ,useContext} from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import classNames from "classnames/bind";
import styles from "./Notification.module.scss";
import TagNotification from "~/components/TagNotification";
import axios from "axios";
import Modal from "react-modal";
import { AppContext } from "~/Context/AppContext";

const cx = classNames.bind(styles);

function Notification() {
  const [visible, setVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifi, setNotifi] = useState([]);
  const [emails, setEmails] = useState({});
  const [names, setNames] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { user_id } = useContext(AppContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user_id) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/notifiaction/${user_id}`
        );
        if (res.status === 200) {
          const data = res.data.data || [];
          setNotifi(data);
          setUnreadCount(data.filter((n) => n.status === "unread").length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [user_id]);

  // Fetch emails and job names
  useEffect(() => {
    const fetchEmailsAndJobs = async () => {
      try {
        const applicantIds = [...new Set(notifi.map((n) => n.applicant_id))];
        const jobIds = [...new Set(notifi.map((n) => n.job_id))];

        // Fetch applicant emails
        const emailResponses = await Promise.all(
          applicantIds.map((id) =>
            axios.get(`http://localhost:8000/api/user/${id}`)
          )
        );

        const emailMap = emailResponses.reduce((acc, res, index) => {
          acc[applicantIds[index]] = res.data.user?.email || "Email not found";
          return acc;
        }, {});

        // Fetch job titles
        const jobResponses = await Promise.all(
          jobIds.map((id) =>
            axios.get(`http://localhost:8000/api/jobs/${id}`)
          )
        );

        const nameMap = jobResponses.reduce((acc, res, index) => {
          acc[jobIds[index]] =
            res.data.job && res.data.job.length > 0
              ? res.data.job[0].title
              : "Job title not found";
          return acc;
        }, {});

        setEmails(emailMap);
        setNames(nameMap);
      } catch (error) {
        console.error("Error fetching emails or job data:", error);
      }
    };

    if (notifi.length > 0) fetchEmailsAndJobs();
  }, [notifi]);

  // Handle opening and closing modal
  const handleOpenModal = (notification) => {
    setSelectedNotification(notification);
    setVisible(!visible)
  } 
  const handleCloseModal = () => setSelectedNotification(null);

  const handleClick = () => setVisible(!visible);

  const visibleNotifications = notifi.slice(0, 10); // Show max 10 notifications

  return (
    <div className={cx("notification-container")}>
      <Tippy
        content={
          <>
            <h1 className={cx("header")}>Thông Báo</h1>
            <div className={cx("notification")}>
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map((notification, index) => (
                  <div key={index} onClick={() => handleOpenModal(notification)}>
                    <TagNotification
                      user={emails[notification.applicant_id] || "Đang tải..."}
                      jobName={names[notification.job_id] || "Đang tải..."}
                      isUnread={notification.status === "unread"}
                      job_id={notification.job_id}
                      poster_id={notification.poster_id}
                      title="Đã Nộp Hồ Sơ Ứng Tuyển Cho Công Việc"
                      bin={notification.application_id}
                    />
                  </div>
                ))
              ) : (
                <TagNotification
                  key="no-notification"
                  user="Bạn Chưa Có Thông Báo Nào"
                  title="Hãy Kiểm Tra Thường Xuyên Để Cập Nhập"
                />
              )}
            </div>
          </>
        }
        visible={visible}
        interactive
        onClickOutside={() => setVisible(false)}
        placement="bottom"
      >
        <div className={cx("group-notification")}>
          <IoIosNotificationsOutline
            className={cx("notification-icon")}
            onClick={handleClick}
            onClickOutside={() => setVisible(false)}
          />
          {unreadCount > 0 && (
            <span className={cx("notification-count")}>
              {/* {unreadCount > 9 ? "9+" : unreadCount} */}
            </span>
          )}
        </div>
      </Tippy>

      {selectedNotification && (
       <>
          <Modal className={cx("modal")}>
            <div className={cx("modal-overlay")} onClick={handleCloseModal}>
            <div
              className={cx("modal-content")}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Chi tiết thông báo</h2>
              <p>Người nộp: {emails[selectedNotification.applicant_id]}</p>
              <p>Tên công việc: {names[selectedNotification.job_id]}</p>
              <button onClick={handleCloseModal}>Đóng</button>
            </div>
          </div>
          </Modal>
       </>
        
      )}
    </div>
  );
}

export default Notification;
