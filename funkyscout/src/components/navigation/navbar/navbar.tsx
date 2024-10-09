import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import "./navbar.css";

const Navbar = () => {
   const currentPage = useLocation();
   const navigatePage = useNavigate();
   const navigate = (pathname: string) => {
      if (pathname != currentPage.pathname)
      navigatePage(pathname)
   }

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            id="navbar"
         >
            <div id="navbar">
               <div id="navbar-wrapper">
                  <button
                     id="navbar-button"
                     className={currentPage.pathname == "/data"
                        ? "selected"
                        : "dim"}
                     onClick={() => navigate("/data")}
                  >
                     <i
                        className="fa-solid fa-clipboard-list"
                        id="navbar-button-icon"
                     >
                     </i>
                     <div id="navbar-text">
                        View Data
                     </div>
                  </button>
                  <button
                     id="navbar-button"
                     className={currentPage.pathname == "/dashboard"
                        ? "selected"
                        : "dim"}
                     onClick={() => navigate("/dashboard")}
                  >
                     <i className="fa-solid fa-gauge" id="navbar-button-icon">
                     </i>
                     <div id="navbar-text">Dashboard</div>
                  </button>
                  <button
                     id="navbar-button"
                     className={currentPage.pathname == "/scouting"
                        ? "selected"
                        : "dim"}
                     onClick={() => navigate("/scouting")}
                  >
                     <i
                        className="fa-solid fa-binoculars"
                        id="navbar-button-icon"
                     >
                     </i>
                     <div id="navbar-text">Scouting</div>
                  </button>
               </div>
            </div>
         </motion.div>
      </>
   );
};

export default Navbar;
