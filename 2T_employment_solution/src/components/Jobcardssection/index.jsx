import classNames from "classnames/bind";
import styles from "./JobCardSection.module.scss";
import JobCard from "~/components/JobCard";
import Button from "~/components/Button";
import Image from "~/components/Image";
import icons from "~/assets/icons";


const cx = classNames.bind(styles);

function JobCardSection() {
    return ( 
        <section className={cx("container")}>
            <div className={cx("header")}>
                <div className={cx("headerTitle")}>
                    <p className={cx("Title")}>
                       Featured Jobs
                    </p>
                </div>
                <div className={cx("headerDecr")}>
                    <p className={cx("decription")}>
                      Freshly released job applications
                    </p>
                </div>
                <div className=""></div>
            </div>
            <div className={cx("groupCard")}>
                <JobCard 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="Company Name"
                    address="Address"
                    position="Position"
                    shortdecr1="Short Description"
                    shortdecr2="Short Description"
                    shortdecr3="Short Description"
                    decription="Heloo Hole lele lolo dfsafjhasdfjkahdfjaskfh sadfhasdjfhasdfjkh sdhfjasdfsajdfh hjlhjklili lala lulu kaka kik
                    Heloo Hole lele lolo dfsafjhasdfjkahdfjaskfh sadfhasdjfhasdfjkh sd
                    Heloo Hole lele lolo dfsafjhasdfjkahdfjaskfh sadfhasdjfhasdfjkh sdhfjasdfsajdfh hjlhjklili lala lulu kaka kikihfjasdfsajdfh hjlhjklili lala lulu kaka kikii"
                /> 
                <JobCard 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="Company Name"
                    address="Address"
                    position="Position"
                    shortdecr1="Short Description"
                    shortdecr2="Short Description"
                    shortdecr3="Short Description"
                    decription="Heloo Hole lele lolo lili lala lulu kaka kiki"
                />         
                <JobCard 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="Company Name"
                    address="Address"
                    position="Position"
                    shortdecr1="Short Description"
                    shortdecr2="Short Description"
                    shortdecr3="Short Description"
                    decription="Heloo Hole lele lolo lili lala lulu kaka kiki"
                />         
                <JobCard 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="Company Name"
                    address="Address"
                    position="Position"
                    shortdecr1="Short Description"
                    shortdecr2="Short Description"
                    shortdecr3="Short Description"
                    decription="Heloo Hole lele lolo lili lala lulu kaka kiki"
                />         
                <JobCard 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="Company Name"
                    address="Address"
                    position="Position"
                    shortdecr1="Short Description"
                    shortdecr2="Short Description"
                    shortdecr3="Short Description"
                    decription="Heloo Hole lele lolo lili lala lulu kaka kiki"
                />         
                <JobCard 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="Company Name"
                    address="Address"
                    position="Position"
                    shortdecr1="Short Description"
                    shortdecr2="Short Description"
                    shortdecr3="Short Description"
                    decription="Heloo Hole lele lolo lili lala lulu kaka kiki"
                />         
                
            </div>
            <div className={cx("footer")}>
    <Button 
     className={cx("button")}
     rightIcon={<Image className={cx("icon")} src={icons.arrow_left1} />}>
    <span className={cx("text")}>Find More Jobs</span>

    </Button>
</div>


        </section>
     );
}

export default JobCardSection;