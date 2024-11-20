    import classNames from "classnames/bind";
    import styles from "./TagNotification.module.scss";
    import { IoIosNotifications } from "react-icons/io";

    // Bind classNames to styles for scoped CSS classes
    const cx = classNames.bind(styles);

    // eslint-disable-next-line react/prop-types
    function TagNotification({ user, jobName, isUnread }) {
        return (
            <div className={cx("container")}>
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
