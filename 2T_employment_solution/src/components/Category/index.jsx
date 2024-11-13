import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import Image from "~/components/Image";

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
function Category({ src, name, description } ) {
    return ( 
        <div className={cx("container")}>
            <Image src={src} className={cx("categotyImage")}></Image>
            <div className={cx("wrapper")}>
                <div className={cx("Name")}> 
                    {name}
                </div>
                <div className={cx("Decription")}>
                    {description}
                </div>
            </div>
        </div>
     );
}

export default Category;