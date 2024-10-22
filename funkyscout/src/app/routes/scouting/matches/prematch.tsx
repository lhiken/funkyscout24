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

   const [position, setPosition] = useState(2);

   if (match == 0) {
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
                        className={position != 2 ? "active" : "inactive"}
                        onClick={() =>
                           position != 2
                              ? navigate(
                                 `/scout/matches/q${match}t${team}A${
                                    alliance ? "r" : "b"
                                 }P${position}`,
                              )
                              : null}
                     >
                        <i className="fa-solid fa-check"></i>
                     </button>
                  </div>
                  <div id="position-selector">
                     {alliance
                        ? (
                           <svg
                              id="svg"
                              viewBox="0 0 327 233"
                              fill="none"
                           >
                              <path
                                 d="M323.998 3.26295H213.758M3.38953 3.26295H115.292M115.292 3.26295L107.468 13.4348L157.923 96.7377H172.594L221.094 13.4348L213.758 3.26295M115.292 3.26295H213.758M3.38953 104.59H19.821V158.971M19.821 229.978V158.971M19.821 158.971H292.309M65.7899 229.978L87.6985 196.528H127.408L146.578 229.978"
                                 stroke="#B54545"
                                 strokeWidth="6"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                              <path
                                 d="M251.232 229.784L293.093 158.776H321.261L280.965 229.784"
                                 stroke="#3F82C6"
                                 strokeWidth="6"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                        )
                        : (
                           <svg id="svg" viewBox="0 0 327 233" fill="none">
                              <path
                                 d="M323.998 3.26295H213.758M3.38953 3.26295H115.292M115.292 3.26295L107.468 13.4348L157.923 96.7377H172.594L221.094 13.4348L213.758 3.26295M115.292 3.26295H213.758M3.38953 104.59H19.821V158.971M19.821 229.978V158.971M19.821 158.971H292.309M65.7899 229.978L87.6985 196.528H127.408L146.578 229.978"
                                 stroke="#3F82C6"
                                 strokeWidth="6"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                              <path
                                 d="M251.232 229.784L293.093 158.776H321.261L280.965 229.784"
                                 stroke="#B54545"
                                 strokeWidth="6"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                        )}

                     <div id="position-buttons-container">
                        <button
                           id="position-button"
                           className={position == -1 ? "active" : "inactive"}
                           onClick={() => setPosition(-1)}
                        >
                           Left
                        </button>
                        <button
                           id="position-button"
                           className={position == 0 ? "active" : "inactive"}
                           onClick={() => setPosition(0)}
                        >
                           Center
                        </button>
                        <button
                           id="position-button"
                           className={position == 1 ? "active" : "inactive"}
                           onClick={() => setPosition(1)}
                        >
                           Right
                        </button>
                     </div>
                  </div>

                  <div id="confirm-tip">
                     Pressing the check starts the match immediately
                  </div>
               </div>
            </motion.div>
         </AnimatePresence>
      </>
   );
};

export default Prematch;
