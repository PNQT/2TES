import classNames from "classnames/bind";
import { useState, useRef } from "react";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

import Button from "~/components/Button";
import styles from "./Search.module.scss";

const cx = classNames.bind(styles);

Modal.setAppElement('#root');

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef();
    const navigate = useNavigate();
    

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            return;
        }
        navigate(`/search?query=${searchValue}`);
    };

    return (
        <div className={cx("container")}>
            <input
                ref={inputRef}
                className={cx("findAndApplySearchInput")}
                type="text"
                placeholder="Search for Jobs"
                value={searchValue}
                onChange={handleChange}
            />
            <Button
                className={cx("findAndApplySearchButton")}
                onClick={handleSubmit}
            >
                Search
            </Button>
        </div>
    );
}

export default Search;