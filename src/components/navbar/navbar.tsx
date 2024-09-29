import { motion } from "framer-motion"
import { useLocation } from 'react-router-dom';

import './navbar.css';

const Navbar = () => {
   const currentPage = useLocation()
   console.log(currentPage.pathname);

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
                  <button id="navbar-button"
                     className={currentPage.pathname == '/data' ? 'selected' : 'dim'}
                  >
                     <i className="fa-solid fa-clipboard-list" id="navbar-button-icon"></i>
                     <div id="navbar-text">View Data
                     </div>
                  </button>
                  <button id="navbar-button"
                     className={currentPage.pathname == '/dashboard' ? 'selected' : 'dim'}
                  >
                     <i className="fa-solid fa-gauge" id="navbar-button-icon"></i>
                     <div id="navbar-text">Dashboard</div>
                  </button>
                  <button id="navbar-button"
                     className={currentPage.pathname == '/scouting' ? 'selected' : 'dim'}
                  >
                     <i className="fa-solid fa-binoculars" id="navbar-button-icon"></i>
                     <div id="navbar-text">Scouting</div>
                  </button>
               </div>
            </div>
         </motion.div>
      </>
   );
}

export default Navbar;