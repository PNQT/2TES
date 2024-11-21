    import classNames from "classnames/bind";
    import styles from "./TagNotification.module.scss";
    import { IoIosNotifications } from "react-icons/io";
    import axios from "axios";

    // Bind classNames to styles for scoped CSS classes
    const cx = classNames.bind(styles);

    // eslint-disable-next-line react/prop-types
    function TagNotification({ user, jobName, isUnread, job_id, poster_id }) {
        const hadleClick = async () => {
          
          try{
            const res = await axios.put(`http://localhost:8000/api/notifications/${job_id}/${poster_id}/read`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            if (res.status === 200){
                console.log("Read notification successfully");
                console.log(res.data);
            }
            else{
                console.log("Read notification failed");
                console.log(res.status)
            }
          }
            catch (error) {
                console.error("Error fetching user ID:", error);
            }
            
        };
        return (
            <div className={cx("container")} onClick={hadleClick}>
                <div className={cx("left")}>
                    <IoIosNotifications />
                </div>
                <div className={cx('right')}>
                    <div className={cx("userName")}>
                        {user}
                    </div>
                    <div className={cx('decs', { unread: isUnread })}>
                        <p>Đã Nộp Hồ Sơ Ứng Tuyển Cho</p>
                        <div className={cx('jobName',{ unread: isUnread })}>{jobName}</div>
                    </div>
                </div>
                <div className={cx('note' , { unread: isUnread })}></div>
            </div>
        );
    }

    export default TagNotification;
