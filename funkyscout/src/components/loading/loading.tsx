import { AnimatePresence, motion } from "framer-motion";
import "./loading.css";

const LoadingPage = ({ label }: { label: string }) => {
   return (
      <>
         <AnimatePresence>
            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.2 }}
               key="loading"
               id="loading-page"
            >
               <div className="loader loader--style2" title="1">
                  <svg
                     version="1.1"
                     id="loader-1"
                     xmlns="http://www.w3.org/2000/svg"
                     x="0px"
                     y="0px"
                     width="60px"
                     height="60px"
                     viewBox="0 0 50 50"
                  >
                     <path
                        fill="#000"
                        d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                     >
                        <animateTransform
                           attributeType="xml"
                           attributeName="transform"
                           type="rotate"
                           from="0 25 25"
                           to="360 25 25"
                           dur="0.6s"
                           repeatCount="indefinite"
                        />
                     </path>
                  </svg>
               </div>
               <div id="loading-text">
                  {label}
               </div>
               <div id="loading-text-details">
                  This should only take a few seconds!
               </div>
            </motion.div>
         </AnimatePresence>
      </>
   );
};

export default LoadingPage;
