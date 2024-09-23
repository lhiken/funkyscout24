import { motion } from 'framer-motion';
import './topbar.css';

const Topbar = () => {

   return (<>
      <motion.div
         initial={{ y: -20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         exit={{ opacity: 0 }}
         id="topbar"
      >
         <div id="topbar">
            <button id="topbar-button">
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