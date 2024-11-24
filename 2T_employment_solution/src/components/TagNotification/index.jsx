import classNames from "classnames/bind";
import styles from "./TagNotification.module.scss";
import { IoIosNotifications } from "react-icons/io";
import axios from "axios";
import { useState } from "react";

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
function TagNotification({ user, jobName, isUnread, title, bin }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  

  const handleClick = async () => {
    if (modalIsOpen) {
      return; // Do not open the modal if it is already open
    }

    try {
      setModalIsOpen(true);  // Open the modal

      // Send GET request to mark the notification as read
      const res = await axios.get(
        `http://localhost:8000/api/notifications/${bin}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        console.log("Read notification successfully");
      } else {
        console.log("Failed to read notification");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className={cx("container")} onClick={handleClick}>
      <div className={cx("left")}>
        <IoIosNotifications />
      </div>
      <div className={cx("right")}>
        <div className={cx("userName")}>{user}</div>
        <div className={cx("decs", { unread: isUnread })}>
          {title}
          <div className={cx("jobName", { unread: isUnread })}>{jobName}</div>
        </div>
      </div>
      <div className={cx("note", { unread: isUnread })}></div>

      {/* Modal for additional details */}
    
    </div>
  );
}

export default TagNotification;
