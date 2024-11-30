import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "~/components/Layout";
import "~/Stylesheet/index.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Login from "./pages/Login";
function App() {
  return (
    <>
      <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <Router>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
  
              let Layout = DefaultLayout;
  
              if (route.layout) {
                Layout = route.layout;
              } else 
              if (route.layout === null) {
                Layout = Fragment;  
              }       
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page/>
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
