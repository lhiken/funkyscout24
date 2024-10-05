import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tables } from "../../utils/database.types";
import ProgressRing from "../../components/routes/dash/progress-ring";
import "./styles/dashboard.css";
import { getCount, getNextMatch } from "../../utils/datacache";
import { useState } from "react";

const Dashboard = () => {
   const navgiate = useNavigate();

   const event = localStorage.getItem("event");
   const user = localStorage.getItem("user");

   const [assignedMatches, setAssignedMatches] = useState(0);
   const [completeMatches, setCompleteMatches] = useState(0);

   getCount(event!, "event_data", {key: "author", val: user!})
      .then((res) => {
         setAssignedMatches(res);
      });

   getCount(event!, "match_data", {key: "author", val: user!})
      .then((res) => {
         setCompleteMatches(res);
      });

   getNextMatch(event!, user!);
   
   
   
   return (
      <>
         <div id="profile-nav">
         </div>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
            key="dashboard"
            id="dashboard"
         >
            <div id="dashboard-main">
               <div id="dashboard-scouting">
                  <div id="dashboard-section">
                     <div id="dashboard-section-header">
                        Start Scouting
                     </div>
                     <div id="dashboard-section-details">
                        Next Shift • No data
                     </div>
                  </div>
                  <button
                     id="dashboard-scouting-submit"
                     onClick={() => navgiate("/scouting")}
                  >
                     <i className="fa-solid fa-arrow-right" />
                  </button>
               </div>
               <div id="dashboard-scouting-overview">
                  <div id="overview-left">
                     <div id="dashboard-section-header">
                        Scouting Overview
                     </div>
                     <div id="dashboard-section-details">
                        {assignedMatches - completeMatches == 0
                           ? "All matches done!"
                           : assignedMatches - completeMatches +
                              " matches left"}
                     </div>
                     <div id="dashboard-section-details" className="dim">
                        {completeMatches} completed
                     </div>
                     <div id="dashboard-section-seperator" />
                     <div id="dashboard-section-details">
                        Pit Notes{" "}
                        <i
                           className="fa-solid fa-arrow-up-right-from-square"
                           id="pit-button"
                        >
                        </i>
                     </div>
                     <div id="dashboard-section-details" className="dim">
                        0 of 0 complete
                     </div>
                  </div>
                  <div id="dashboard-overview-progress">
                     <ProgressRing
                        stroke={1.3}
                        radius={4.5}
                        progress={assignedMatches != 0
                           ? Math.round(
                              (completeMatches / assignedMatches) * 100,
                           ) / 100
                           : 1}
                        label={`${completeMatches} of ${assignedMatches}`}
                     />
                  </div>
               </div>
            </div>
         </motion.div>
      </>
   );
};
export default Dashboard;
