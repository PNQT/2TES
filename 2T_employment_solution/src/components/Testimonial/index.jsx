import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Testimonial.module.scss";
import Image from "~/components/Image";
import icons from "~/assets/icons";

const cx = classNames.bind(styles);

const testimonials = [
  {
    description: "I had the privilege of using Job Hunt to search for employment, and it exceeded my expectations. The platform's user-friendly features and the vast array of job listings made my job search a success. I endorse Job Hunt wholeheartedly.",
    author: "Emmanuel Rice",
    role: "Product Manager"
  },
  {
    description: "Job Hunt helped me find my dream job within weeks. The platform is easy to use and provides a vast amount of job listings. I highly recommend it to anyone seeking new opportunities in their career. The support team is also incredibly responsive and helpful.",
    author: "Sarah Johnson",
    role: "Software Engineer"
  },
  // Add more testimonials if needed
];

const CHAR_LIMIT = 200; // Set character limit for truncated text

function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setIsExpanded(false); // Reset expansion when switching testimonials
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsExpanded(false); // Reset expansion when switching testimonials
  };

  const toggleExpanded = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const { description, author, role } = testimonials[currentIndex];
  const isLongText = description.length > CHAR_LIMIT;
  const displayedText = isExpanded || !isLongText
    ? description
    : `${description.slice(0, CHAR_LIMIT)}...`;

  return (
    <div className={cx("container")}>
      <p className={cx("title")}>What our clients are saying</p>
      <p className={cx("description")}>
        &quot;{displayedText}&quot;
        {isLongText && (
          <button onClick={toggleExpanded} className={cx("toggle-button")}>
            {isExpanded ? " Show less" : " Read more"}
          </button>
        )}
      </p>
      <h3 className={cx("author")}>{author}</h3>
      <p className={cx("role")}>{role}</p>
      <div className={cx("navigation")}>
        <button onClick={handlePrevious} className={cx("nav-button")}>
            <Image src={icons.arrow_left} alt="Previous" className={cx("buttonPrevious")} />          
        </button>
        <button onClick={handleNext} className={cx("nav-button")}>
            <Image src={icons.arrow_right} alt="Next" className={cx("buttonNext")}/>
        </button>
      </div>
    </div>
  );
}

export default Testimonial;
