import {
   isRouteErrorResponse,
   useNavigate,
   useRouteError,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./error.css";

const ErrorPage = () => {
   const error = useRouteError();

   const navigate = useNavigate();

   const handleReturn = () => {
      navigate("/");
   };

   return (
      <>
         <AnimatePresence>
            <div id="error-page">
               <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  id="error-box"
               >
                  <div id="error-header">An error has occured</div>
                  <div id="error-status">
                     {isRouteErrorResponse(error)
                        ? (error.status + " " + error.statusText)
                        : "Unknown Error"}
                  </div>
               </motion.div>
               <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  id="error-return"
                  onClick={handleReturn}
               >
                  Return to Home
               </motion.div>
            </div>
         </AnimatePresence>
      </>
   );
};

export default ErrorPage;
