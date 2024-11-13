   import Category from "~/components/Category";
   import icons from "~/assets/icons";
   // import Image from "~/components/Image";
   import classNames from "classnames/bind";
   import styles from "./CategorySection.module.scss";

   const cx = classNames.bind(styles);
   function CategorySection() {
      return ( 
         <section className={cx("container")}>
               <div className={cx("header")}>
                  <p className={cx("titleCenter")}>
                  Browse By Category
                  </p>
                  <p className={cx("decriptions")}>
                  You can locate the category in which your dream job can be found! 
                  </p>
               </div>
               <div className={cx("categories")}>
                  <Category 
                  src={icons.estate}
                  name="Real Estate Jobs"
                  description="70 Jobs Available"
                  />
                  <Category 
                  src={icons.hospital}
                  name="Hospital jobs"
                  description="50 Jobs Available"
                  />
                  <Category 
                  src={icons.construction}
                  name="Construction Jobs"
                  description="45 Jobs Available"
                  />
                  <Category 
                  src={icons.accounting}
                  name="Accounting Jobs"
                  description="23 Jobs Available"
                  />
                  <Category 
                  src={icons.design_creative}
                  name="Design & Creative Jobs"
                  description="15 Jobs Available"
                  />
                  <Category 
                  src={icons.fashion}
                  name="Fashion Jobs"
                  description="45 Jobs Available"
                  />
                  <Category 
                  src={icons.it_telecom}
                  name="IT & Telecom Jobs"
                  description="45 Jobs Available"
                  />
                  <Category 
                  src={icons.shipping}
                  name="Shipping Jobs"
                  description="23 Jobs Available"
                  />

               </div>
               {/* <div className={cx("fordwardAndBck")}>
                  <Image className={cx("arrowLeft")} src={icons.arrow_left}></Image>
                  <Image className={cx("arrowRight")}src={icons.arrow_right}></Image>

               </div> */}
         </section>
         
      );
   }

   export default CategorySection;