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
               Uh oh!
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
               The app isn't installed!
               <div>On Android: Click <i className="fa-solid fa-ellipsis-vertical" /> at the top right &gt; <i className="fa-solid fa-mobile-screen-button" /> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down" /> Install.</div>
               <div>On iOS/Safari: Click <i className="fa-solid fa-arrow-up-from-bracket" /> at the bottom &gt; <i className="fa-regular fa-square-plus" /> Add to Home Screen &gt; <i className="fa-solid fa-circle-arrow-down" /> Add.</div>
               <div>Many cool features won't be usable without installing first! </div>
            </motion.div>
         </div>
      </>
   )
}

export default InstallPrompt;