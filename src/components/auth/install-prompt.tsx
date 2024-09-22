import { useState } from "react";
import { motion } from "framer-motion"
import './install-prompt.css'

const InstallPrompt = () => {
   const [expand, setExpand] = useState(true);

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
               oh no!
               <div id="install-prompt-button">
                  {expand ? <i className="fa-solid fa-chevron-up"/> : <i className="fa-solid fa-chevron-down"/>}
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
               <div/>
               The app isn't installed...
               <div>On Android: Click <i className="fa-solid fa-ellipsis-vertical" /> at the top right &gt; <i className="fa-solid fa-mobile-screen-button" /> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down" /> Install.</div>
               <div>On iOS/Safari: Click <i className="fa-solid fa-arrow-up-from-bracket" /> at the bottom &gt; <i className="fa-regular fa-square-plus" /> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down" /> Add.</div>
               <div>This app wasn't meant to be used without installing so please install! </div>
            </motion.div>
         </div>
      </>
   )
}

const WelcomePrompt = () => {
   const [expand, setExpand] = useState(true);

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
         <div id="welcome-prompt" onClick={() => setExpand(!expand)}>
            <div id="install-prompt-header">
               <i className="fa-solid fa-check" />
               Welcome
               <div id="install-prompt-button">
                  {expand ? <i className="fa-solid fa-chevron-up"/> : <i className="fa-solid fa-chevron-down"/>}
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
               <div />
               <div>App was installed!</div>
               <div>Please enable permissions in your device's settings for notifications.</div>
            </motion.div>
         </div>
      </>
   )
}

export {WelcomePrompt, InstallPrompt};