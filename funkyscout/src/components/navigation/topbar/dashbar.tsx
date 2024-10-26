import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTheme } from "../../../utils/theme";
import throwNotification from "../../notification/notifiication";
import "./dashbar.css";

interface Settings {
   active: boolean;
   notifIcon: boolean;
   themeClick: () => void;
   exitClick: () => void;
   notifClick: () => void;
}

const Settings = (
   { active, notifIcon, themeClick, notifClick, exitClick }: Settings,
) => {
   return (
      <AnimatePresence>
         {active && (
            <motion.div
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -10, opacity: 0 }}
               className="topbar-settings-options"
            >
               <button className="topbar-option" onClick={notifClick}>
                  {notifIcon
                     ? <i className="fa-solid fa-bell" />
                     : <i className="fa-solid fa-bell-slash" />}
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
   );
};

const Dashbar = () => {
   const [dropdown, setDropdown] = useState(false);
   const [notificationEnabled, setNotificationEnabled] = useState(false);

   const [menu, setMenu] = useState(false);
   const [logoutPrompt, setLogoutPrompt] = useState(false);

   const navigate = useNavigate();

   const handleExitClick = () => {
      setLogoutPrompt(true);
   };

   const handleNavigate = (path: string) => {
      navigate(path);
   };

   const handleLogout = () => {
      if (window.navigator.onLine) {
         localStorage.removeItem("user");
         localStorage.removeItem("event");
         setDropdown(false);
         navigate("/auth");
         throwNotification("info", "Logged out");
      } else {
         throwNotification("error", "No logging off without a connection >:(");
      }
   };

   const handleNotifClick = () => {
      setNotificationEnabled(!notificationEnabled);
      return;
   };

   const handleThemeSwitch = () => {
      if (localStorage.getItem("current_theme") == "theme-dark") {
         setTheme("theme-light");
      } else {
         setTheme("theme-dark");
      }
   };

   const handleSettingsClick = () => {
      setDropdown(!dropdown);
   };

   return (
      <>
         <AnimatePresence>
            {menu && (
               <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  id="menu"
                  onClick={() => setMenu(false)}
               >
                  <div id="menu-box">
                     {location.pathname != "/auth"
                        ? (
                           <>
                              <button
                                 id="menu-previous"
                                 className="menu-button"
                                 onClick={() => navigate(-1)}
                              >
                                 <i
                                    style={{
                                       fontSize: "1.25rem",
                                       width: "2rem",
                                    }}
                                    className="fa-solid fa-backward"
                                 />
                                 Previous
                              </button>
                              <button
                                 id="menu-dash"
                                 className="menu-button"
                                 onClick={() => handleNavigate("/dashboard")}
                              >
                                 <i
                                    style={{
                                       fontSize: "1.25rem",
                                       width: "2rem",
                                    }}
                                    className="fa-solid fa-gauge"
                                 />
                                 Dashboard
                              </button>
                              <button
                                 id="menu-data"
                                 className="menu-button"
                                 onClick={() => handleNavigate("/data")}
                              >
                                 <i
                                    style={{
                                       fontSize: "1.25rem",
                                       width: "2rem",
                                    }}
                                    className="fa-solid fa-server"
                                 />
                                 View Data
                              </button>
                              <button
                                 id="menu-scouting"
                                 className="menu-button"
                                 onClick={() => handleNavigate("/scouting")}
                              >
                                 <i
                                    style={{
                                       fontSize: "1.25rem",
                                       width: "2rem",
                                    }}
                                    className="fa-solid fa-binoculars"
                                 />
                                 Scouting
                              </button>
                              <button
                                 id="menu-logout"
                                 className="menu-button"
                                 onClick={handleExitClick}
                              >
                                 <i
                                    style={{
                                       fontSize: "1.5rem",
                                       width: "2rem",
                                    }}
                                    className="fa-solid fa-right-from-bracket"
                                 />
                                 Logout
                              </button>
                           </>
                        )
                        : "Sign in first"}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
         <AnimatePresence>
            {logoutPrompt && (
               <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  id="menu"
                  onClick={() => setLogoutPrompt(false)}
               >
                  <div id="menu-box">
                     Are you sure?
                     <div id="menu-details">
                        You won't be able to sign in again without an internet
                        connection.
                     </div>
                     <div id="menu-confirmation">
                        <button
                           className="confirm-button"
                           onClick={() => setLogoutPrompt(false)}
                        >
                           <i
                              style={{
                                 fontSize: "1.25rem",
                                 width: "2rem",
                                 color: "var(--accent)",
                              }}
                              className="fa-solid fa-xmark"
                           />
                        </button>
                        <button
                           className="confirm-button"
                           onClick={handleLogout}
                        >
                           <i
                              style={{
                                 fontSize: "1.25rem",
                                 width: "2rem",
                                 color: "var(--dark-text)",
                              }}
                              className="fa-solid fa-check"
                           />
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
         <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            id="topbar"
         >
            <div id="topbar">
               <div id="topbar-wrapper">
                  <div id="topbar-left">
                     <button id="topbar-profile" onClick={() => setMenu(true)}>
                        <i className="fa-solid fa-user" id="topbar-user" />
                     </button>
                     <div id="topbar-text">
                        <div id="topbar-header">Funkyscout</div>
                        <div id="topbar-username">
                           {localStorage.getItem("user")
                              ? localStorage.getItem("user")
                              : "Not signed in"}
                        </div>
                     </div>
                  </div>
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
};

export default Dashbar;
