import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTheme } from '../../utils/theme';
import './topbar.css';

interface Settings {
   active: boolean;
   notifIcon: boolean;
   themeClick: () => void;
   exitClick: () => void;
   notifClick: () => void;
}

const Settings = ({ active, notifIcon, themeClick, notifClick, exitClick }: Settings) => {
   return (
      <AnimatePresence>
         {active && (
            <motion.div
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -10, opacity: 0 }}
               className='topbar-settings-options'
            >
               <button className="topbar-option" onClick={notifClick}>
                  {notifIcon ? <i className="fa-solid fa-bell" /> : <i className="fa-solid fa-bell-slash" />}
               </button>
               <button className="topbar-option" onClick={themeClick}>
                  <i className="fa-solid fa-moon" />
               </button>
               <button className="topbar-option" onClick={exitClick}>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
               </button>
            </motion.div>
         )}
      </AnimatePresence>
   )
}

const Topbar = () => {
   const [dropdown, setDropdown] = useState(false);
   const [notificationEnabled, setNotificationEnabled] = useState(false);

   const navigate = useNavigate();

   const handleExitClick = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('event');
      setDropdown(false);
      navigate('/auth');
   }

   const handleNotifClick = () => {
      setNotificationEnabled(!notificationEnabled);
      return;
   }

   const handleMenuToggle = () => {
      return;
   }

   const handleThemeSwitch = () => {
      if (localStorage.getItem("current_theme") == "theme-dark") {
         setTheme("theme-light");
      } else {
         setTheme("theme-dark");
      }
   }

   const handleSettingsClick = () => {
      setDropdown(!dropdown);
   }

   return (<>
      <motion.div
         initial={{ y: -20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         exit={{ opacity: 0 }}
         id="topbar"
      >
         <div id="topbar">
            <div id="topbar-wrapper">
               <button id="topbar-button" onClick={handleMenuToggle}>
                  <i className="fa-solid fa-compass" id="topbar-icon" />
               </button>
               <div id="topbar-settings">
                  <button id="topbar-button" onClick={handleSettingsClick}>
                     <i className="fa-solid fa-gear" id="topbar-icon" />
                  </button>
                  <Settings
                     active={dropdown}
                     notifIcon={notificationEnabled}
                     themeClick={handleThemeSwitch}
                     exitClick={handleExitClick}
                     notifClick={handleNotifClick}
                  />
               </div>
            </div>
         </div>
      </motion.div>
   </>
   );
}

export default Topbar;