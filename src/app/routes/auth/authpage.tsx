import { useState } from "react";
import { motion } from "framer-motion"
import TextTransition from "react-text-transition";
import './styles/auth.css'
import './styles/install-prompt.css'

const InstallPrompt = () => {
   const [expand, setExpand] = useState(false);

   const animateDropdown = {
      expand: {
         opacity: 1,
         x: 0,
      },
      close: {
         opacity: 0,
         height: 0,
         transition: {
            height: { type: "ease-in", duration: 0.2 },
            opacity: { duration: 0.3 }
         }
      }
   }

   return (
      <>
         <div id="install-prompt" onClick={() => setExpand(!expand)}>
            <div id="install-prompt-header">
               <i className="fa-solid fa-xmark" />
               Uh oh!
               <div id="install-prompt-button">
                  <TextTransition>
                  {expand ? <i className="fa-solid fa-chevron-up"/> : <i className="fa-solid fa-chevron-down"/>}
                  </TextTransition>
               </div>
            </div>
            <motion.div
               animate={expand ? "expand" : "close"}
               transition={{
                  height: { type: "spring", stiffness: 400, damping: 20},
                  opacity: { duration: 0.4 }
               }}
               variants={animateDropdown}
               id="install-prompt-details"
            >
               The app isn't installed!
               <div>On Android: Click <i className="fa-solid fa-ellipsis-vertical" /> at the top right &gt; <i className="fa-solid fa-mobile-screen-button" /> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down" /> Install.</div>
               <div>On iOS/Safari: Click <i className="fa-solid fa-arrow-up-from-bracket" /> at the bottom &gt; <i className="fa-regular fa-square-plus" /> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down" /> Add.</div>
               <div>Many cool features won't be usable without installing first! </div>
            </motion.div>
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