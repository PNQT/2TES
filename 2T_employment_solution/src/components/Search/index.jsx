import classNames from "classnames/bind";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Button from "~/components/Button";
import styles from "./Search.module.scss";
import { MdOutlineClear } from "react-icons/md";


const cx = classNames.bind(styles);

function Search(...props) {
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            return;
        }
        navigate(`/categories?query=${searchValue}`);
    };

    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (     
        <div className={cx("container")} {...props}>
            <div className={cx("inputWrapper")}>
                <input
                    ref={inputRef}
                    className={cx("findAndApplySearchInput")}
                    type="text"
                    placeholder="Search for Jobs"
                    value={searchValue}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                />
                {searchValue && (
                    <MdOutlineClear 
                        className={cx("clearButton")}
                        onClick={handleClear}
                    />                  
                )}
            </div>
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
