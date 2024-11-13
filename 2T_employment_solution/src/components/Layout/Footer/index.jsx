import styles from "./Footer.module.scss";
import Image from "~/components/Image";
import icons from "~/assets/icons"; 

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
         {/* Social Media Links */}
        <div className={styles.social}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
             <Image src={icons.facebook}/>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
             <Image src={icons.tele}/>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Image src={icons.linkedin}/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image src={icons.instar}/>
            </a>
          </div>
        </div>

         {/* Quick Links */}
        <div className={styles.quickLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/jobs">Jobs</a></li>
            <li><a href="/companies">Companies</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.contact}>
          <h3>Contact Us</h3>
          <p>Email: phamnhuquoctrieu307@gmail.com</p>
          <p>Phone: +84 797526054</p>
          <p>Address: Ngu Hanh Son, Da Nang, Viet Nam</p>
        </div>
     

        {/* About Section */}
        <div className={styles.about}>
          <h3>2T_Employment_Solutions</h3>
          <p>
            2T_Employment_Solutions is dedicated to connecting job seekers with the best job opportunities. We make the job search experience smooth and successful.
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()}  2T_Employment_Solutions. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
