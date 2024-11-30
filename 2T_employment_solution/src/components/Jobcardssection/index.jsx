import classNames from "classnames/bind";
import styles from "./JobCardSection.module.scss";
import JobCardFake from "~/components/JobCardFake";
import Button from "~/components/Button";
import Image from "~/components/Image";
import icons from "~/assets/icons";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function JobCardSection() {
    const navigate = useNavigate();
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
                    name="TechCorp"
                    address="New York, NY"
                    position="Software Engineer"
                    shortdecr1="full-time"
                    shortdecr2="20000"
                    shortdecr3="23/12/2025"
                    decription="Join our dynamic team to build innovative solutions."
                    onClick={() => navigate("/categories")}
                /> 
                <JobCardFake 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="DataSolutions"
                    address="San Francisco, CA"
                    position="Data Analyst"
                    shortdecr1="full-time"
                    shortdecr2="20000"
                    shortdecr3="30/01/2025"
                    decription="Analyze data to drive business decisions."
                    onClick={() => navigate("/categories")}
                />         
                <JobCardFake 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="InnovateX"
                    address="Austin, TX"
                    position="Product Manager"
                    shortdecr1="full-time"
                    shortdecr2="25000"
                    shortdecr3="07/01/2025"
                    decription="Manage product lifecycle from conception to launch."
                    onClick={() => navigate("/categories")}
                />         
                <JobCardFake 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="CreativeHub"
                    address="Chicago, IL"
                    position="UX Designer"
                    shortdecr1="full-time"
                    shortdecr2="13000"
                    shortdecr3="19/01/2025"
                    decription="Design user-centric interfaces and experiences."
                    onClick={() => navigate("/categories")}
                />         
                <JobCardFake
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="MarketPros"
                    address="Boston, MA"
                    position="Marketing Specialist"
                    shortdecr1="full-time"
                    shortdecr2="15000"
                    shortdecr3="30/12/2024"
                    decription="Develop and execute marketing strategies."
                    onClick={() => navigate("/categories")}
                />         
                <JobCardFake 
                    className={cx("groupCardItem")}
                    src={icons.instar}
                    name="SalesForce"
                    address="Seattle, WA"
                    position="Sales Associate"
                    shortdecr1="full-time"
                    shortdecr2="10000"
                    shortdecr3="17/01/2025"
                    decription="Drive sales and build customer relationships."
                    onClick={() => navigate("/categories")}
                />         
                
            </div>
            <div className={cx("footer")}>                                              
    <Button 
     className={cx("button")}
     rightIcon={<Image className={cx("icon")} src={icons.arrow_left1} />}
     data-aos="zoom-in"
     onClick={() => navigate("/categories")}
     >
    <span className={cx("text")}>Find More Jobs</span>

    </Button>
</div>


        </section>
     );
}

export default JobCardSection;