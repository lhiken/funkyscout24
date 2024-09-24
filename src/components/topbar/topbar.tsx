import { motion } from 'framer-motion';
import { setTheme } from '../../utils/theme';
import './topbar.css';


const Topbar = () => {
   const handleThemeSwitch = () => {
      if (localStorage.getItem("current_theme") == "theme-dark") {
         setTheme("theme-light");
      } else {
         setTheme("theme-dark");
      }
   }

   return (<>
      <motion.div
         initial={{ y: -20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         exit={{ opacity: 0 }}
         id="topbar"
      >
         <div id="topbar">
            <button id="topbar-button" onClick={handleThemeSwitch}>
               <i className="fa-solid fa-moon" id="topbar-icon" />
            </button>
            <button id="topbar-button">
               <i className="fa-solid fa-gear" id="topbar-icon" />
            </button>
         </div>
      </motion.div>
   </>
   );
}

export default Topbar;