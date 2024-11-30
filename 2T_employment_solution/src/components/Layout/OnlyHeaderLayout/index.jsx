import Header from "../Header";
import styles from "./OnlyHeaderLayout.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
function DefaultLayout( {children}) {
    return ( 
        <div>  
            <Header />
            <main className={cx("container")}>
                {children}
            </main>
        </div>
     );
}
export default DefaultLayout;