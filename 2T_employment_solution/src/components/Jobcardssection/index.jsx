import classNames from "classnames/bind";
import styles from "./JobCardSection.module.scss";
import JobCardFake from "~/components/JobCardFake";
import Button from "~/components/Button";
import Image from "~/components/Image";
import icons from "~/assets/icons";


const cx = classNames.bind(styles);

function JobCardSection() {
    return ( 
        <section className={cx("container")}>
            <div className={cx("header")} data-aos="zoom-in" data-aos-delay="500">
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
            <div className={cx("groupCard")} data-aos="fade-up" data-aos-delay="1400">
                <JobCardFake 
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
                <JobCardFake 
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
                <JobCardFake 
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
                <JobCardFake 
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
                <JobCardFake
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
                <JobCardFake 
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
     rightIcon={<Image className={cx("icon")} src={icons.arrow_left1} />}
     data-aos="zoom-in"
     >
    <span className={cx("text")}>Find More Jobs</span>

    </Button>
</div>


        </section>
     );
}

export default JobCardSection;