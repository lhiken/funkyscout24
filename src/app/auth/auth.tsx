import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { InstallPrompt, WelcomePrompt } from "../../components/auth/install-prompt";
import './styles/auth.css'

const AuthPage = () => {
   const installed = window.matchMedia('(display-mode: standalone)').matches;
   const navigate = useNavigate();

   const handleAuthSubmit = () => {
      navigate("/dashboard");
   }

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}

            id="auth-body"
         >
            <div id="auth-header">
               funkyscout
            </div>
            {installed ? <WelcomePrompt/> : <InstallPrompt />}
            <div id="auth-box">
               <button id="auth-top">
                  <i className='fa-solid fa-chevron-down' />
                  Event
               </button>
               <div id='auth-bottom'>
                  <button id="auth-name">
                     <i className='fa-solid fa-chevron-down' />
                     Name
                  </button>
                  <button id="auth-submit" onClick={handleAuthSubmit}>
                     <i className="fa-solid fa-arrow-right" />
                  </button>
               </div>
            </div>
         </motion.div>
      </>
   );
}

export default AuthPage;