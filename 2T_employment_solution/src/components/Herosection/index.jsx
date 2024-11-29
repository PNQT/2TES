import classNames from "classnames/bind";

import styles from "./Herosection.module.scss";
import Button from "~/components/Button";
import Image from "~/components/Image";
import Search from "~/components/Search";
import images from "~/assets/images";
import icons from "~/assets/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const cx = classNames.bind(styles);

function HeroSection() {

    useEffect(() => {
        AOS.init(); 
      }, []);

    return ( 
        <section className={cx("heroSection")}>
            <div className={cx("heroSectionFindApply")}>
                <div className={cx("findAndApply")}>
                    <div className={cx("findAndApplyContent")} data-aos="fade-up">
                        <h1 className={cx("findAndApplyContentTitle")}>
                            Find and Apply for a Job that suits <br /> 
                            you!
                        </h1>
                        <p className={cx("findAndApplyContentDescription")}>
                            Here you can find your best job, Explore hundreds of <br />
                            jobs with us. Ready for your next adventure?
                        </p>
                    </div>
                    <div className={cx('searchBar')}><Search data-aos="fade-up"/></div>
                </div>

                <div className={cx("quickSearch")} data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000">
                    <div className={cx("quickSearchTitle")}>
                        <h2 className={cx("content")}>Most Searched Jobs:</h2>
                    </div>
                    <div className={cx("quickSearchResult")}>
                        <div className={cx("tear")}>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>Web Developer</h3>
                            </div>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>Front End Developer</h3>
                            </div>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>Data Analyst</h3>
                            </div>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>Accountant</h3>
                            </div>
                        </div>
                        <div className={cx("tear")}>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>Photographer</h3>
                            </div>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>Full Stack Developher</h3>
                            </div>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>Senior Lecturer</h3>
                            </div>
                            <div className={cx("quickSearchResultItem")}>
                                <h3>UX Designer</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx("heroSectionContent")}>
                <figure className={cx("heroSectionContentImage")}>
                    <Image src={images.blackMan} alt="black_man" className={cx("black_man")} data-aos="fade-up" data-aos-anchor-placement="center-bottom"></Image>
                </figure>
                <div className={cx("heroSectionContentCongratulations")} data-aos="fade-right" >
                    <Image
                        src={icons.email}
                        className={cx("imageLeft")}
                        alt="email"
                    ></Image>

                    <div
                        className={cx(
                            "heroSectionContentCongratulationsContent"
                        )}
                    >
                        <h5 className={cx("textHight")}>Congratulations!</h5>
                        <h5 className={cx("text")}>You have got an Email</h5>
                    </div>

                    <img
                        className={cx("imageRight")}
                        src={icons.tick}
                        alt="tick"
                    ></img>
                </div>
                <div className={cx("heroSectionContentFeedback")} data-aos="fade-left">
                    <img
                        className={cx("heroSectionContentFeedbackImage")}
                        src={icons.ellipse1}
                        alt="ellipse1"
                    ></img>

                    <h5 className={cx("heroSectionContentFeedbackText")}>
                        Hello, I am looking to apply for the role of a UX
                        Designer
                    </h5>
                </div>
                <div className={cx("heroSectionContentMember")} data-aos="fade-left">
                    <h4 className={cx("nubmer")}>200+</h4>
                    <h5 className={cx("decr")}>Got job on our platform</h5>

                    <div className={cx("groupImage")}>
                        <Image
                            src={icons.ellipse4}
                            alt="ellipse4"
                        ></Image>
                        <Image
                            src={icons.ellipse5}
                            alt="ellipse5"
                        ></Image>
                        <Image
                            src={icons.ellipse7}
                            alt="ellipse7"
                        ></Image>
                        <Image
                            src={icons.ellipse8}
                            alt="ellipse8"
                        ></Image>
                        <Image
                            src={icons.ellipse9}
                            alt="ellipse9"
                        ></Image>
                        <Image
                            src={icons.ellipse10}
                            alt="ellipse10"
                        ></Image>
                        <Image
                            src={icons.plus}
                            alt="plus"
                        ></Image>
                    </div>
                </div>
                <div className={cx("heroSectionContentJobs")} data-aos="fade-right">
                    <div className={cx("heroSectionContentJobsHeader")}>
                        <div className={cx("Logo")}>
                            <Image
                                src={icons.logo1}
                                alt="logo1"
                                className={cx("logo1")}
                            ></Image>

                            <h4 className={cx("logoName")}>Kokomlemle</h4>
                        </div>
                        <Button outline>Full Time</Button>
                    </div>
                    <div className={cx("heroSectionContentJobsContent")}>
                        <h5 className={cx("contentName")}>Graphic Designer</h5>
                        <h6 className={cx("normal")}>
                            The company seeks to employ the <br />
                            services of a......<span className={cx("highlight")}>Read More</span>

                        </h6>
                        
                    </div>
                </div>
            </div>
        </section>
     );
}

export default HeroSection;