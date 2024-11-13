import classNames from "classnames/bind";
import styles from "./JobCard.module.scss";
import Image from "~/components/Image";
import icons from "~/assets/icons";
import Button from "~/components/Button";

const cx = classNames.bind(styles);
// eslint-disable-next-line react/prop-types
function JobCard({src,name,address,position,shortdecr1,shortdecr2,shortdecr3,decription,onClick}) {
    return ( 
        <div className={cx("container")}onClick={onClick}>
            <div className={cx("header")}>
                <div className={cx("wrapper")}>
                    <Image  
                         className={cx("logo")}
                         src={src}
                     />
                    <div className={cx("group")}>
                         <div className={cx("name")}>{name}</div>
                         <div className={cx("address")}>
                            {address}
                         </div>
                    </div>
                </div>    
            </div>
                <Image src={icons.save} className={cx("save")}/>
            <div className={cx("content")}>
                <div className={cx("position")}>
                   <p className={cx("title")}>
                      {position}
                   </p>                  
                </div>
                <div className={cx("threeShortdecr")}>
                         <div className={cx("shortdecr")}>
                            <p className={cx("shortdecrcontent")}>{shortdecr1}</p>
                         </div>
                         <div className={cx("shortdecr")}>
                            <p className={cx("shortdecrcontent")}>{shortdecr2}</p>
                         </div>
                         <div className={cx("shortdecr")}>
                            <p className={cx("shortdecrcontent")}>{shortdecr3}</p>
                         </div>
                </div>
                <div className={cx("longdecr")}>
                    <p className={cx("decription")}>
                        {decription}
                    </p>
                </div>
            </div>
            <div className={cx("footer")}>
               
                <Button className={cx("buttonApply")}>Apply</Button>
                <Button className={cx("buttonReadMore")} outline>Read More</Button>
               
            </div>
        </div>
     );
}

export default JobCard;