import { AnimatePresence, motion } from "framer-motion";
import "./notification.css";

const Notification = (
   { type, message, isVisible }: {
      type: string;
      message: string;
      isVisible: boolean;
   },
) => {
   return (
      <div id="notification-root">
         <AnimatePresence>
            {isVisible && (
               <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  id="notification-container"
                  className={type}
               >
                  <div id="notification-icon" className={type}>
                     {type == "success"
                        ? <i className="fa-regular fa-circle-check" />
                        : type == "error"
                        ? <i className="fa-regular fa-circle-xmark" />
                        : type == "info"
                        ? <i className="fa-solid fa-circle-info" />
                        : type == "undo"
                        ? <i className="fa-solid fa-rotate-left" />
                        : <i className="fa-regular fa-message" />}
                  </div>
                  <div id="notification-seperator" className={type} />
                  <div id="notification-message" className={type}>
                     {message}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default Notification;
