import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CategorySection.module.scss";
import Category from "../Category";
import icons from "~/assets/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const categories = [
  { name: "Real Estate Jobs", icon: icons.estate },
  { name: "Hospital jobs", icon: icons.hospital },
  { name: "Construction Jobs", icon: icons.constructor },
  { name: "Accounting Jobs", icon: icons.accounting },
  { name: "Design & Creative Jobs", icon: icons.design },
  { name: "Fashion Jobs", icon: icons.fashion },
  { name: "IT & Telecom Jobs", icon: icons.it },
  { name: "Shipping Jobs", icon: icons.shipper },
];
 
function CategorySection() {
  const [jobCounts, setJobCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        const counts = {};
        for (const category of categories) {
          const response = await axios.get(`http://localhost:8000/api/count/${category.name}`);
          console.log("Category:", category.name);
          console.log("bbin",response.data);  
          counts[category.name] = response.data;
        }
        setJobCounts(counts);
      } catch (err) {
        console.error("Failed to fetch job counts:", err);
        setError("Failed to load job counts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobCounts();
  }, []);
  const handleCategoryClick = (categoryName) => {
   navigate(`/categories?query=${categoryName}`);
 };
    
  

  return (
    <section className={cx("container")}>
      <div
        className={cx("header")}
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
        data-aos-delay="500"
      >
        <p className={cx("titleCenter")}>Browse By Category</p>
        <p className={cx("descriptions")}>
          You can locate the category in which your dream job can be found!
        </p>
      </div>
      <div className={cx("categories")}>
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className={cx("error")}>{error}</p>
        ) : (
          categories.map((category, index) => (
            <Category
              key={index}
              src={category.icon}
              name={category.name}
              description={`${jobCounts[category.name] || 0} Jobs Available`}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={500 + (index > 3 ? (index - 3) * 300 : index * 300)}
              onClick={() => handleCategoryClick(category.name)} 
            />
          ))
        )}
      </div>
    </section>
  );
}

export default CategorySection;