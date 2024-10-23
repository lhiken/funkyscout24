import { useState } from 'react';
import '../styles/endgame.css'
const Endgame = () => {
   const [climbed, setClimbed] = useState(false);
   const [defense, setDefense] = useState(false);

   return (
      <>
         <div id="match-summary">
            <div id="match-summary-top">
               <div id="checkbox-container">
                  <div id="match-summary-label">
                     Climbed
                     <button
                        id="match-summary-checkbox"
                        onClick={() => setClimbed(!climbed)}
                     >
                        {
                           climbed ? (
                              <i className="fa-solid fa-check" id="checkmark"></i>
                           ) : (
                              <></>
                           )
                        }
                     </button>
                  </div>
                  <div id="match-summary-label">
                     Defense
                     <button
                        id="match-summary-checkbox"
                        onClick={() => setDefense(!defense)}
                     >
                        {
                           defense ? (
                              <i className="fa-solid fa-check" id="checkmark"></i>
                           ) : (
                              <></>
                           )
                        }
                     </button>

                  </div>
               </div>
               <button id="submit-button">
                  <i className="fa-solid fa-check"></i>
               </button>
            </div>
            <div id="match-summary-bottom">
               <textarea
                  id="comment-input"
                  placeholder="Write some comments about this team..."
               />
            </div>

         </div>
      </>
   )
}

export default Endgame;