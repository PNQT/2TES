import icons from "~/assets/icons";
import Image from "~/components/Image";
import styles from "./Step.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Step() {
    return ( 
        <section className={cx("container")}>
            <div className={cx("header")}>
                <p className={cx("titleCenter")}>
                Only 3 Steps to Get Your Dream Job!
                </p>
            </div>
            <div className={cx("content")}>
                <div className={cx("card")}>
                    <Image src={icons.account}>
                    </Image>
                    <p className={cx("name")}>Register for an account</p>
                    <p className={cx("step")}>1</p>
                </div>
                <div className={cx("card")}>
                    <Image src={icons.white_cv}>
                    </Image>
                    <p className={cx("name")}>Upload Your CV</p>
                    <p className={cx("step")}>2</p>
                </div>
                <div className={cx("card")}>
                    <Image src={icons.send}>
                    </Image>
                    <p className={cx("name")}>Apply For Dream Job!</p>
                    <p className={cx("step")}>3</p>
                </div>
            </div>
        </section>
     );
}

export default Step;