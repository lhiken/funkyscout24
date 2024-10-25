import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressRing from "../../components/routes/dash/progress-ring";
import "./styles/dashboard.css";
import { getCount, getNextMatch, syncData } from "../../utils/database/datacache";
import { forwardRef, useEffect, useRef, useState } from "react";
import TextTransition from "react-text-transition";
import { getEventData, getMatchData } from "../../utils/helpers/fetch";
import supabase from "../../utils/database/supabase";
import Dashbar from "../../components/navigation/topbar/dashbar";
import { openDB } from "idb";
import throwNotification from "../../components/notification/notifiication";

const MatchCard = forwardRef(
   (
      { match, alliance, time, team, placeholder, finished }: {
         match?: number;
         alliance?: boolean;
         time?: number;
         team?: number;
         placeholder: boolean;
         finished?: boolean;
      },
      ref: React.Ref<HTMLDivElement>,
   ) => {
      if (match && !placeholder) {
         const date = new Date((time ? time : 0) * 1000);
         const localTime = date.toLocaleString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
         });

         return (
            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.4 }}
               ref={ref}
               id="match-card"
            >
               <div
                  id="match-card-top"
                  className={finished ? ("finished") : ("upcoming")}
               >
                  <div
                     id="match-card-match">Q{match}</div>
                  <div 
                  id="match-card-detail" 
                  className={finished ? ("finished") : ("upcoming")} >
                     <div
                        style={alliance
                           ? {
                              color:finished ? ("#B5454544"):("var(--warning-red)"),
                              fontSize: "1.5rem",
                           }
                           : {
                              fontSize: "1.5rem",
                              color:finished ? ("#3F82C644"):("var(--warning-blue)"),
                           }
                           
                        }
                     >
                        •
                     </div>
                     {localTime}
                  </div>
               </div>
               <div
                  id="match-card-bottom"
                  className={finished ? ("finished") : ("upcoming")}
               >FRC {team}</div>
            </motion.div>
         );
      } else if (placeholder) {
         return (
            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.4 }}
               ref={ref}
               id="match-card"
            >
               <div id="match-card-top">
                  <div id="match-card-match" className="placeholder">
                     &#10240;&nbsp; &#10240;
                  </div>
                  <div id="match-card-detail" className="placeholder">
                     <div
                        style={alliance
                           ? {
                              color: "var(--warning-red)",
                              fontSize: "1.5rem",
                           }
                           : {
                              color: "var(--warning-blue)",
                              fontSize: "1.5rem",
                           }}
                     >
                        &#10240;
                     </div>
                  </div>
               </div>
               <div id="match-card-bottom" className="placeholder-container">
                  <div className="placeholder"></div>
               </div>
            </motion.div>
         );
      }
   },
);

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

   useEffect(() => {
      getCount(event!, "event_data", { key: "author", val: user! })
         .then((res) => {
            localStorage.setItem("matches_assigned", String(res));
            setAssignedMatches(res);
         });

      getCount(event!, "match_data", { key: "author", val: user! })
         .then(async (res) => {
            localStorage.setItem("matches_done", String(res));

            setCompleteMatches(res);

            await supabase
               .from("users")
               .update({ matches: res })
               .eq("name", user!)
               .eq("event", event!)
               .select();
         });
   }, [event, user]);

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

   useEffect(() => {
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
   }, [event, user]);

   const [personalSchedule, setPersonalSchedule] = useState<
      personalSchedule[]
   >();

   const personalScheduleRef = useRef<personalSchedule[]>([]);

   useEffect(() => {
      const fetchSchedule = async () => {
         const db = await openDB(event!);
         const schedule: scheduleData[] = await db.getAllFromIndex(
            "event_data",
            "eventAuthors",
            user,
         );

         const personalSchedule: personalSchedule[] = [];

         await getEventData()
            .then((res) => {
               for (const selectedMatch of schedule) {
                  const matchData = res.find((match) =>
                     match.match == selectedMatch.match
                  );

                  if (matchData) {
                     personalSchedule.push({
                        match: selectedMatch.match,
                        team: selectedMatch.team,
                        alliance: selectedMatch.alliance,
                        time: matchData.startTime,
                     });
                  }
               }
            })
            .catch((error) => {
               console.log(error);

               for (const selectedMatch of schedule) {
                  personalSchedule.push({
                     match: selectedMatch.match,
                     team: selectedMatch.team,
                     alliance: selectedMatch.alliance,
                     time: 0,
                  });
               }
            });

         personalScheduleRef.current = personalSchedule; // Update the ref
         setPersonalSchedule(personalSchedule); // Update the state
      };

      const scrollSchedule = (match: number) => {
         if (personalScheduleRef.current.length > 0) {
            const matchIndex = personalScheduleRef.current.findIndex((m) =>
               m.match == match
            );

            if (matchIndex !== -1 && matchRefs.current[matchIndex]) {
               matchRefs.current[matchIndex]?.scrollIntoView({
                  behavior: "smooth",
               });
            }
         }
      };

      fetchSchedule().then(() => {
         setTimeout(() => scrollSchedule(nextMatch), 500);
      });
   }, [event, user, nextMatch]);

   interface scheduleData {
      event: string;
      match: number;
      team: number;
      alliance: boolean;
      author: string;
   }

   interface personalSchedule {
      match: number;
      team: number;
      time: number;
      alliance: boolean;
   }

   const matchRefs = useRef<(HTMLDivElement | null)[]>([]);

   const getTimeDifference = (startTime: Date, endTime: Date) => {
      const diff = startTime.getTime() - endTime.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
         return `${hours % 24}h ${minutes % 60}m`;
      } else if (minutes > 0) {
         return `${minutes % 60}m`;
      } else if (hours < 0) {
         return `${Math.abs(hours % 24)}h ${Math.abs(minutes % 60)}m ago`;
      } else if (minutes < 0) {
         return `${Math.abs(hours % 24)}h ${Math.abs(minutes % 60)}m ago`;
      } else {
         return `now`;
      }
   };

   const handleSyncRequest = () => {
      if (window.navigator.onLine) {
         syncData(event!);
      } else {
         throwNotification('error', 'You\'re offline')
      }
   }

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
               <div className="dashboard-stats">
                  <div className="dashboard-stats left">
                     <div className="dashboard-stats next">
                        <div id="dashboard-stats-header">
                           Next Match
                        </div>
                        <div id="details">
                           <div
                              id="details-header"
                              style={{ display: "flex", flexDirection: "row" }}
                           >
                              | Qual {nextMatch ? nextMatch : 0}
                              {personalSchedule && personalSchedule.length > 0
                                 ? " •"
                                 : null}&nbsp;
                              <TextTransition>
                                 {personalSchedule &&
                                    personalSchedule.length > 0
                                    ? (
                                       personalSchedule.find((o) =>
                                          o.match == nextMatch
                                       )?.team
                                    )
                                    : null}
                              </TextTransition>
                           </div>
                           <div id="details-time">
                              {nextMatchTime
                                 ? nextMatchTime.slice(0, 5)
                                 : "0:00"}
                           </div>
                           <div id="details-time" className="details-timesign">
                              {nextMatchTime ? nextMatchTime.slice(5) : "AM"}
                           </div>
                           <div
                              style={{
                                 display: "flex",
                                 flexDirection: "row",
                              }}
                              className="details-timediff"
                           >
                              |&nbsp;<TextTransition className="details-timediff">
                                 {personalSchedule &&
                                    personalSchedule.length > 0
                                    ? getTimeDifference(
                                       new Date(
                                          (personalSchedule.find((match) =>
                                             match.match == nextMatch
                                          )?.time ?? 0) * 1000,
                                       ),
                                       new Date(Date.now()),
                                    )
                                    : "No time data"}
                              </TextTransition>
                           </div>
                        </div>
                     </div>
                     <button id="sync-button" onClick={handleSyncRequest}>
                        <div
                           className="dashboard-stats sync-icon"
                           id="team-button"
                        >
                           <i
                              className="fa-solid fa-file-arrow-up"
                              style={{
                                 fontSize: "1.4rem",
                                 alignContent: "center",
                                 justifyContent: "center",
                              }}
                           />
                        </div>
                        <div
                           className="dashboard-stats sync-text"
                           id="driver-button"
                        >
                           Sync Data
                        </div>
                     </button>
                  </div>

                  <div className="dashboard-stats right">
                     <div id="dashboard-stats-header">
                        Schedule
                     </div>
                     <div id="dashboard-stats-schedule">
                        {personalSchedule && personalSchedule.length > 0
                           ? personalSchedule?.map((match, index) => (
                              <MatchCard
                                 key={index}
                                 ref={(
                                    element: HTMLDivElement | null,
                                 ) => (matchRefs.current[index + 1] = element)}
                                 match={match.match}
                                 team={match.team}
                                 alliance={match.alliance}
                                 time={match.time}
                                 placeholder={false}
                                 finished={match.match < nextMatch}
                              />
                           ))
                           : (
                              <>
                                 <MatchCard placeholder={true} />
                                 <MatchCard placeholder={true} />
                                 <MatchCard placeholder={true} />
                                 <MatchCard placeholder={true} />
                              </>
                           )}
                     </div>
                  </div>
               </div>
               <div id="dashboard-bottom">
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
                        <div
                           id="dashboard-section-details"
                           className="transition"
                        >
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
            </div>
         </motion.div>
      </>
   );
};
export default Dashboard;
