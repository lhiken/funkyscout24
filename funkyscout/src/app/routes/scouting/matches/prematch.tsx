import { AnimatePresence, motion } from "framer-motion";
import "./prematch.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Prematch = (
   { match, team, alliance, setActive }: {
      match: number;
      team: number;
      alliance: boolean;
      setActive: React.Dispatch<React.SetStateAction<boolean>>;
   },
) => {
   const navigate = useNavigate();

   const [matchConfirmed, setMatchConfirmed] = useState(true);
   const [position, setPosition] = useState(0);

   if (match == 0) {
      setMatchConfirmed(true);
      setPosition(0);
   }

   return (
      <>
         <AnimatePresence>
            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.2 }}
               key="matchconfirmation"
               id="confirmation-page"
            >
               <div id="confirm-content">
                  <div id="confirm-text">
                     Confirm Match Details
                  </div>
                  <div id="confirm-box">
                     <button
                        id="confirm-box-button"
                        className="active"
                        onClick={() => setActive(false)}
                     >
                        <i className="fa-solid fa-xmark"></i>
                     </button>
                     <div id="confirm-details-box">
                        <div id="confirm-details-top">
                           <div>Match {match}</div>
                        </div>
                        <div id="confirm-details-bottom">
                           FRC {team}
                        </div>
                     </div>
                     <button
                        id="confirm-box-button"
                        className={matchConfirmed ? "active" : "inactive"}
                        onClick={() =>
                           matchConfirmed
                              ? navigate(
                                 `/scout/matches/q${match}t${team}A${alliance ? 'r' : 'b'}P${position}`,
                              )
                              : null}
                     >
                        <i className="fa-solid fa-check"></i>
                     </button>
                  </div>
               </div>
            </motion.div>
         </AnimatePresence>
      </>
   );
};

export default Prematch;
