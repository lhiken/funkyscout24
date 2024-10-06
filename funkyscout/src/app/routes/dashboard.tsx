import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressRing from "../../components/routes/dash/progress-ring";
import "./styles/dashboard.css";
import { getCount, getNextMatch } from "../../utils/database/datacache";
import { useState } from "react";
import TextTransition from "react-text-transition";
import { getMatchData } from "../../utils/helpers/fetch";
import supabase from "../../utils/database/supabase";
import Dashbar from "../../components/navigation/topbar/dashbar";

const Dashboard = () => {
   const navgiate = useNavigate();

   const event = localStorage.getItem("event");
   const user = localStorage.getItem("user");

   const [assignedMatches, setAssignedMatches] = useState(
      Number(localStorage.getItem("matches_assigned")),
   );
   const [completeMatches, setCompleteMatches] = useState(
      Number(localStorage.getItem("matches_done")),
   );

   getCount(event!, "event_data", { key: "author", val: user! })
      .then((res) => {
         localStorage.setItem("matches_assigned", String(res));
         setAssignedMatches(res);
      });

   getCount(event!, "match_data", { key: "author", val: user! })
      .then(async (res) => {
         localStorage.setItem("matches_done", String(res));

         await supabase
            .from("users")
            .update({ matches: res })
            .eq("name", user!)
            .eq("event", event!)
            .select();

         setCompleteMatches(res);
      });

   const [nextMatch, setNextMatch] = useState(
      localStorage.getItem("dashboard-status")
         ? JSON.parse(localStorage.getItem("dashboard-status")!).match
         : 0,
   );
   const [nextAlliance, setNextAlliance] = useState(
      localStorage.getItem("dashboard-status")
         ? JSON.parse(localStorage.getItem("dashboard-status")!).alliance
         : true,
   );
   const [nextMatchTime, setNextMatchTime] = useState(
      localStorage.getItem("dashboard-status")
         ? JSON.parse(localStorage.getItem("dashboard-status")!).time
         : "9:00 AM",
   );

   getNextMatch(event!, user!)
      .then(async (res) => {
         if (res) {
            const dashboardStatus = {
               match: res.match,
               alliance: res.alliance,
            };

            localStorage.setItem(
               "dashboard-status",
               JSON.stringify(dashboardStatus),
            );
            setNextMatch(res.match);
            setNextAlliance(res.alliance);

            return getMatchData(res.match);
         } else {
            setNextMatch(0);
            throw new Error("No match data found");
         }
      })
      .then((matchData) => {
         if (matchData && matchData.startTime) {
            const date = new Date(matchData.startTime * 1000);
            const localTime = date.toLocaleString([], {
               hour: "numeric",
               minute: "2-digit",
            });

            const status = localStorage.getItem("dashboard-status");
            if (status) {
               const updatedStatus = {
                  ...JSON.parse(status),
                  time: localTime,
               };
               localStorage.setItem(
                  "dashboard-status",
                  JSON.stringify(updatedStatus),
               );
            }

            setNextMatchTime(localTime);
         }
      })
      .catch((error) => {
         console.error("Error fetching match data:", error);
      });

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
            key="dashboard"
            id="dashboard"
         >
            <Dashbar />
            <div id="dashboard-main">
               <div id="dashboard-scouting">
                  <div id="dashboard-section">
                     <div id="dashboard-section-header">
                        Start Scouting
                     </div>
                     <div id="dashboard-section-details">
                        {nextMatch != 0
                           ? (
                              <div className="transition">
                                 Next Shift •&nbsp;
                                 <TextTransition
                                    className={nextAlliance ? "red" : "blue"}
                                 >
                                    Q{nextMatch}
                                 </TextTransition>
                                 &nbsp;at&nbsp;
                                 <TextTransition>
                                    {nextMatchTime != ""
                                       ? (
                                          <>
                                             <span
                                                className={nextAlliance
                                                   ? "red"
                                                   : "blue"}
                                             >
                                                {nextMatchTime}
                                             </span>
                                          </>
                                       )
                                       : null}
                                 </TextTransition>
                              </div>
                           )
                           : "All shifts completed"}
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
                     <div id="dashboard-section-details" className="transition">
                        <TextTransition>
                           {assignedMatches - completeMatches == 0
                              ? null
                              : assignedMatches - completeMatches}
                        </TextTransition>
                        {assignedMatches - completeMatches == 0
                           ? "All matches done!"
                           : <>&nbsp;matches left</>}
                     </div>
                     <div
                        id="dashboard-section-details"
                        className="transition dim"
                     >
                        <TextTransition>{completeMatches}
                        </TextTransition>&nbsp;complete
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
