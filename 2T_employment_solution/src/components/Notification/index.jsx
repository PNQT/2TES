import { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Import Tippy CSS
import { IoIosNotificationsOutline } from 'react-icons/io';
import classNames from 'classnames/bind';
import styles from './Notification.module.scss';
import TagNotification from '~/components/TagNotification'; // Import your TagNotification component

const cx = classNames.bind(styles);

const notifications = [
    { user: "Nguyễn Văn A", jobName: "Nhân Viên Kinh Doanh", read: true },
    { user: "Nguyễn Văn B", jobName: "Kỹ Sư Phần Mềm", read: true },
    { user: "Nguyễn Văn C", jobName: "Chuyên Viên Marketing", read: true },
    { user: "Nguyễn Văn D", jobName: "Nhân Viên Kế Toán", read: false },
    { user: "Nguyễn Văn E", jobName: "Nhân Viên Hành Chính", read: false },
    { user: "Nguyễn Văn F", jobName: "Nhân Viên Bảo Vệ", read: false },
    { user: "Nguyễn Văn A", jobName: "Nhân Viên Kinh Doanh", read: false },
    { user: "Nguyễn Văn B", jobName: "Kỹ Sư Phần Mềm", read: false },
    { user: "Nguyễn Văn C", jobName: "Chuyên Viên Marketing", read: false },
    { user: "Nguyễn Văn D", jobName: "Nhân Viên Kế Toán", read: false },
    { user: "Nguyễn Văn E", jobName: "Nhân Viên Hành Chính", read: false },
    { user: "Nguyễn Văn F", jobName: "Nhân Viên Bảo Vệ", read: false },
];

function Notification() {
    const [visible, setVisible] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Calculate unread notifications
    useEffect(() => {
        const count = notifications.filter((notification) => !notification.read).length;
        setUnreadCount(count);
    }, [notifications]);

    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <div className={cx("notification-container")}>
            <Tippy
                content={
                    <>
                        <h1 className={cx('header')}>Thông Báo</h1>
                        <div className={cx("notification")}>
                            {notifications.map((notification, index) => (
                                <TagNotification 
                                    key={index} 
                                    user={notification.user} 
                                    jobName={notification.jobName} 
                                    isUnread={!notification.read} // Pass a flag for unread
                                />
                            ))}
                        </div>
                    </>
                }
                visible={visible}
                interactive
                onClickOutside={() => setVisible(false)}
                trigger="mouseenter focus"
                placement="bottom"
            >
                <div className={cx("group-notification")}>
                    < IoIosNotificationsOutline
                        className={cx("notification-icon")}
                        onClick={handleClick}
                    />
                    <div>
                        {unreadCount > 0 && (
                            <span className={cx("notification-count")}>
                                
                            </span>
                        )}
                    </div>
                </div>
            </Tippy>
        </div>
    );
}

export default Notification;
