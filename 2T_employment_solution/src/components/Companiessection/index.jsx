import classNames from "classnames/bind";
import styles from "./Companiessection.module.scss";
import Image from "~/components/Image";
import icons from "~/assets/icons";

const cx = classNames.bind(styles);
function ConpaniesSection() {
    return ( 
        <section className={cx("container")}>
            <div className={cx("header")}>
                <p className={cx("titleCenter")}>
                    We are trusted by the World’s largest companies 
                </p>
            </div>
            <div className={cx("content")}>
                <Image src={icons.yahoo}/>
                <Image src={icons.microsoft} />
                <Image src={icons.youtube}/>
                <Image src={icons.lenovo}/>
                <Image src={icons.samsung}/>               
            </div>

        </section>
     );
}

export default ConpaniesSection;