import classNames from "classnames/bind";
import styles from "./AppliedJob.module.scss";

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
function AppliedJob({ title, name, location, applied, status, forwardRef, ...props }) {
    return ( 
        <div ref={forwardRef} className={cx("container", "hidden")} {...props}>
            <div className={cx("header")}>
                <div className={cx("title")}>{title}</div>
                <div className={cx("companyName")}>{name}</div>
                <div className={cx("location")}>{location}</div>
            </div>
            <div className={cx("content")}>
                <table className={cx("table")}>
                    <tbody>
                        <tr>
                            <th className={cx("column")}>Applied</th>
                            <th className={cx("info")}>{applied}</th>
                        </tr>
                        <tr>
                            <th className={cx("column")}>Status</th>
                            <th className={cx("info")}>{status}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AppliedJob;
