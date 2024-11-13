import Footer from "../Footer";
import Header from "../Header";

// eslint-disable-next-line react/prop-types
function DefaultLayout( {children}) {
    return ( 
        <>  
            <Header />
            <main>
                {children}
            </main>
            <Footer/>
        </>
     );
}
export default DefaultLayout;