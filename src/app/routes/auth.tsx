import { motion } from "framer-motion"
import './styles/auth.css'

const InstallPrompt = () => {
   return (
      <>
         <div id="install-prompt">
            <div id="install-prompt-header">
               <i className="fa-solid fa-xmark" />
               Uh oh!
            </div>
            <div id="install-prompt-details">
               The app isn't installed! 
               <div>On Android: Click <i className="fa-solid fa-ellipsis-vertical"/> at the top right &gt; <i className="fa-solid fa-mobile-screen-button"/> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down"/> Install.</div>
               <div>On iOS: Click <i className="fa-solid fa-arrow-up-from-bracket"/> at the bottom &gt; <i className="fa-regular fa-square-plus"/> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down"/> Add.</div>
            </div>
         </div>
      </>
   )
}

const AuthPage = () => {
   const installed = window.matchMedia('(display-mode: standalone)').matches;

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
            {installed ? null : <InstallPrompt />}
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
                  <button id="auth-submit">
                     <i className="fa-solid fa-arrow-right" />
                  </button>
               </div>
            </div>
         </motion.div>
      </>
   );
}

export default AuthPage;