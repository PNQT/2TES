import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import Tippy from '@tippyjs/react';
import { FaUser, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa'; // Import icons

import styles from "./Header.module.scss";
import Button from "~/components/Button";
import routesConfig from "~/config/routes";
import Image from "~/components/Image";

const cx = classNames.bind(styles);

function Header() {
    let currentUser = true;
    const [isTippyOpen, setIsTippyOpen] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // Track the mobile menu state
    const timer = useRef(null);

    const handleClick = ()=> {
        setIsTippyOpen(false);
    }

    const renderMenu = () => (
        <div className={cx('menu')}>
            <Link to={routesConfig.profile} className={cx('menuItem')} onClick={handleClick}>
                <FaUser className={cx('icon')} />
                Profile
            </Link>
            <Link to={routesConfig.setting} className={cx('menuItem')} onClick={handleClick}>
                <FaCog className={cx('icon')} />
                Settings
            </Link>
            <Link to="/logout" className={cx('menuItem', 'logout')} onClick={handleClick}>
                <FaSignOutAlt className={cx('icon')} />
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
                    Categories
                </Link>
                <Link to={routesConfig.search} className={cx("menuBarItem")}>
                    Find Jobs
                </Link>
                <Link to={routesConfig.post} className={cx("menuBarItem")}>
                    Post Jobs
                </Link>
                <Link to={routesConfig.apply} className={cx("menuBarItem")}>
                    Apply
                </Link>
                {/* <Link to={routesConfig.home} className={cx("menuBarItem")}>
                    About
                </Link> */}
            </nav>
            <div className={cx("groupButton")}
                onClick={() => setIsTippyOpen(!isTippyOpen)}
                  >
                {currentUser ? (
                    <Tippy content={renderMenu()} 
                    interactive={true} 
                    trigger="click" 
                    placement="bottom" 
                    className="tipppy"
                    visible={isTippyOpen}
                    onClickOutside={() => setIsTippyOpen(false)}
                    >
                        <Image
                            className={cx('user-avatar')}
                            src="https://via.placeholder.com/150"
                        />
                    </Tippy>
                ) : (
                    <>
                        <Button className={cx("groupButtonSignUp")}>
                            Sign Up
                        </Button>
                        <Button className={cx("groupButtonLogin")} outline>
                            Login
                        </Button>
                    </>
                )}
            </div>

            {/* Hamburger menu button */}
            <button className={cx("hamburger")} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FaBars />
            </button>
            {isMenuOpen && (
        <nav className={cx('mobileMenu')}>
          <Link to={routesConfig.home} className={cx('menuItemHamberger')} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to={routesConfig.search} className={cx('menuItemHamberger')} onClick={() => setIsMenuOpen(false)}>Search</Link>
          <Link to={routesConfig.apply} className={cx('menuItemHamberger')} onClick={() => setIsMenuOpen(false)}>Apply</Link>
          <Link to={routesConfig.post} className={cx('menuItemHamberger')} onClick={() => setIsMenuOpen(false)}>Post Jobs</Link>
          <Link to={routesConfig.categories} className={cx('menuItemHamberger')} onClick={() => setIsMenuOpen(false)}>Categories Jobs</Link>

        </nav>
      )}
        </header>
    );
}

export default Header;
