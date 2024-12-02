import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { FaUser, FaCog, FaSignOutAlt, FaBars, FaPassport, FaSave } from "react-icons/fa"; // Import icons

import styles from "./Header.module.scss";
import Button from "~/components/Button";
import routesConfig from "~/config/routes";
import Image from "~/components/Image";
import Notification from "~/components/Notification";

import { AppContext } from "~/Context/AppContext.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const cx = classNames.bind(styles);

function Header() {
  const [isTippyOpen, setIsTippyOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track the mobile menu state
  const timer = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, token, setUser, setToken, hasNewUpdates, setHasNewUpdates } = useContext(AppContext);

  async function handleLogout(e) {
    e.preventDefault();
    setIsTippyOpen(false);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      if (res.status === 200) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      // Optionally display an error message to the user
    }
  }

  const handleClick = () => {
    setIsTippyOpen(false);
  };

  // const handleClickOutside = (event) => {
  //   if (menuRef.current && !menuRef.current.contains(event.target)) {
  //     setIsMenuOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const click = (()=> {
    setHasNewUpdates(false)
  })

  const renderMenu = () => (
    <div className={cx("menu")}>
      <Link to={routesConfig.profile} className={cx("menuItem")} onClick={handleClick}>
        <FaUser className={cx("icon")} />
        Profile
      </Link>
      {user && user.user_type === "employer" ? (
        <>
          <Link
            to={routesConfig.yourposted}
            className={cx("menuItem")}
            onClick={handleClick}
          >
            <FaPassport className={cx("icon")} />
            Your posted
          </Link>
          <Link
            to={routesConfig.yoursaved}
            className={cx("menuItem")}
            onClick={handleClick}
          >
            <FaSave className={cx("icon")} />
            Your saved
          </Link>
        </>
      ) : (
        <Link
          to={routesConfig.yoursaved}
          className={cx("menuItem")}
          onClick={handleClick}
        >
          <FaSave className={cx("icon")} />
          Your saved
        </Link>
      )}
      <Link to={routesConfig.setting} className={cx("menuItem")} onClick={handleClick}>
        <FaCog className={cx("icon")} />
        Settings
      </Link>
      <Link to="/logout" className={cx("menuItem", "logout")} onClick={handleLogout}>
        <FaSignOutAlt className={cx("icon")} />
        Logout
      </Link>
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const headerHeight = 36;

      if (scrollTop > headerHeight) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }

      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <header className={cx("wrapper", { hidden: isScrolling })}>
      <Link to={routesConfig.home} className={cx("logo")}>
        <div className={cx("logoName")}>2T-EmploymentSolutions</div>
      </Link>
      <nav className={cx("menuBar")}>
        <Link to={routesConfig.home} className={cx("menuBarItem")}>
          Home
        </Link>
        <Link to={routesConfig.categories} className={cx("menuBarItem")}>
          {/* Categories */}
          Jobs
        </Link>
        {/* <Link to={routesConfig.search} className={cx("menuBarItem")}>
                    Find Jobs
                </Link> */}
        <Link to={routesConfig.post} className={cx("menuBarItem")}>
          Post Jobs
        </Link>
        {/* <Link to={routesConfig.apply} className={cx("menuBarItem")}>
                    Applied Jobs
                </Link> */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <Link  to={routesConfig.apply} className={cx("menuBarItem")}  onClick={click}>
            Applied Jobs
          </Link>
          {hasNewUpdates && (
            <span
              style={{
                position: "absolute",
                top: "0px",
                right: "-5px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "red",
              }}
            ></span>
          )}
        </div>
        {/* <Link to={routesConfig.home} className={cx("menuBarItem")}>
                    About
                </Link> */}
      </nav>
      <div className={cx("right")}>
        <div className={cx("groupButton")} onClick={() => setIsTippyOpen(!isTippyOpen)}>
          {user ? (
            <Tippy
              content={renderMenu()}
              interactive={true}
              // trigger="mouseenter"
              placement="bottom"
              // className="tipppy"
              visible={isTippyOpen}
              onClickOutside={() => setIsTippyOpen(false)}
            >
              <Image className={cx("user-avatar")} src={user.avatar} />
            </Tippy>
          ) : (
            <>
              <Button to="/register" className={cx("groupButtonSignUp")}>
                Sign Up
              </Button>
              <Button to="/login" className={cx("groupButtonLogin")} outline>
                Login
              </Button>
            </>
          )}
        </div>
        <Notification />
      </div>

      {/* Hamburger menu button */}
      <button className={cx("hamburger")} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FaBars />
      </button>
      {isMenuOpen && (
        <nav className={cx("mobileMenu")} ref={menuRef}>
          <Link
            to={routesConfig.home}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          {/* <Link to={routesConfig.search} className={cx('menuItemHamberger')} onClick={() => setIsMenuOpen(false)}>Search</Link> */}
          <Link
            to={routesConfig.apply}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            Applied Job
          </Link>
          <Link
            to={routesConfig.post}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            Post Jobs
          </Link>
          <Link
            to={routesConfig.categories}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            Jobs
          </Link>
          <Link
            to={routesConfig.profile}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to={routesConfig.setting}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            Setting
          </Link>
          <Link
            to={routesConfig.yourposted}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            your posted
          </Link>
          <Link
            to={routesConfig.yoursaved}
            className={cx("menuItemHamberger")}
            onClick={() => setIsMenuOpen(false)}
          >
            Your saved
          </Link>
          <Link onClick={handleLogout}>
            Logout
          </Link> 


          {!user && (
            <>
              <Link
                to="/register"
                className={cx("menuItem")}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className={cx("menuItem")}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;
