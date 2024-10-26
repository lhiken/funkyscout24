import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import "./teampage.css";
import { useEffect, useRef, useState } from "react";
import throwNotification from "../../../components/notification/notifiication";
import { Tables } from "../../../utils/database/database.types";
import supabase from "../../../utils/database/supabase";
import AutosTab from "./tabs/autos";
import GraphsTab from "./tabs/graphs";
import NotesTab from "./tabs/notes";

const TeamPage = () => {
   const { id } = useParams();

   const fetched = useRef(false);

   const [team, setTeam] = useState<{ name: string; number: number }>({
      name: "",
      number: Number(id),
   });

   const [teamData, setTeamData] = useState<Tables<"match_data">[]>([]);
   const [teamAverages, setTeamAverages] = useState({
      avgSpeaker: 0,
      avgAmp: 0,
      avgMiss: 0,
      defenseRate: 0,
      failureRate: 0,
      climbRate: 0,
   });

   const fetchTeam = async () => {
      try {
         const response = await fetch(
            `https://www.thebluealliance.com/api/v3/team/frc${team.number}/simple`,
            {
               method: "GET",
               headers: {
                  "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY,
               },
            },
         );

         if (!response.ok) {
            throw new Error(`Error fetching team data: ${response.statusText}`);
         }

         const data: { nickname: string } = await response.json();
         setTeam((prevTeam) => ({ ...prevTeam, name: data.nickname }));
      } catch (error) {
         throwNotification("error", `${error}`);
      }
   };

   const fetchTeamData = async () => {
      try {
         const { data: match_data, error } = await supabase
            .from("match_data")
            .select("*")
            .eq("team", team.number);

         if (error) {
            throw new Error(error.message);
         }

         setTeamData(match_data || []);
         return match_data;
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      if (!fetched.current && team?.number) {
         fetched.current = true;

         fetchTeam();
         fetchTeamData().then((matchData) => {
            if (!matchData) return;

            const matches = matchData.length;

            if (matches != 0) {
               const totalSpeaker = matchData.reduce(
                  (sum, match) => sum + match.speaker,
                  0,
               );
               const totalAmp = matchData.reduce(
                  (sum, match) => sum + match.amp,
                  0,
               );
               const totalMiss = matchData.reduce(
                  (sum, match) => sum + match.miss,
                  0,
               );
               const climbs = matchData.reduce(
                  (count, match) => count + (match.climb ? 1 : 0),
                  0,
               );
               const defenses = matchData.reduce(
                  (count, match) => count + (match.defense ? 1 : 0),
                  0,
               );
               const failures = matchData.reduce(
                  (count, match) => count + (match.disabled > 0 ? 1 : 0),
                  0,
               );

               setTeamAverages({
                  avgSpeaker: totalSpeaker / matches,
                  avgAmp: totalAmp / matches,
                  avgMiss: totalMiss / matches,
                  failureRate: failures / matches,
                  defenseRate: defenses / matches,
                  climbRate: climbs / matches,
               });
            }
         });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [team?.number]);

   const [currentTab, setCurrentTab] = useState(1);

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
            key="teamdata"
            id="teamdata"
         >
            <div id="teamdata-main">
               <div id="teamdata-stats">
                  <div id="teamdata-stats-left">
                     <div>
                        <div
                           id="teamdata-stats-header"
                           style={{ height: "1.5rem" }}
                        >
                           Team {team.number}
                        </div>
                        <div
                           id="teamdata-stats-normal"
                           style={{
                              fontWeight: "500",
                              height: "1.5rem",
                              width: "8rem",
                              whiteSpace: "nowrap", // Prevent text wrapping
                              overflow: "hidden", // Hide any overflowed text
                              textOverflow: "ellipsis", // Add ellipsis for overflowed text
                              display: "block", // Ensure the display type is suitable for ellipsis
                           }}
                        >
                           {team.name}
                        </div>
                     </div>
                     <div>
                        <div id="teamdata-stats-accented">
                           <div>
                              Matches
                           </div>
                           <div>
                              {teamData.length}
                           </div>
                        </div>

                        <div id="teamdata-stats-progress">
                           <div id="teamdata-stats-normal">
                              <div>Amp Ratio</div>
                              <div>
                                 {(teamAverages.avgAmp /
                                    (teamAverages.avgAmp +
                                       teamAverages.avgSpeaker) *
                                    100).toFixed(0)}%
                              </div>
                           </div>
                           <progress
                              value={teamAverages.avgAmp /
                                 (teamAverages.avgAmp +
                                    teamAverages.avgSpeaker)}
                              id="teamdata-stats-progress-bar"
                           />
                        </div>
                     </div>
                  </div>
                  <div id="teamdata-stats-right">
                     <div>
                        <div id="teamdata-stats-accented">
                           <div>Cycle</div>
                           <div>
                              {(teamAverages.avgSpeaker + teamAverages.avgAmp !=
                                    0
                                 ? 135 /
                                    (teamAverages.avgSpeaker +
                                       teamAverages.avgAmp)
                                 : 135).toFixed(1)}s
                           </div>
                        </div>
                        <div id="teamdata-stats-normal">
                           <div>Failure</div>
                           <div>
                              {(teamAverages.failureRate * 100).toFixed(1)}%
                           </div>
                        </div>
                     </div>
                     <div>
                        <div id="teamdata-stats-accented">
                           <div>Accuracy</div>
                           <div>
                              {(teamData.length > 0
                                 ? (1 -
                                    (teamAverages.avgMiss /
                                       (teamAverages.avgSpeaker +
                                          teamAverages.avgAmp +
                                          teamAverages.avgMiss))) * 100
                                 : 100).toFixed(1)}%
                           </div>
                        </div>
                        <div id="teamdata-stats-normal">
                           <div>Speaker</div>
                           <div>{teamAverages.avgSpeaker.toFixed(1)}</div>
                        </div>
                        <div id="teamdata-stats-normal">
                           <div>Amp</div>
                           <div>{teamAverages.avgAmp.toFixed(1)}</div>
                        </div>
                     </div>
                  </div>
               </div>
               <div id="teamdata-choose-tab">
                  <button
                     id="teamdata-auto-button"
                     className={`teamdata-button ${
                        currentTab == 0 ? "active" : "inactive"
                     }`}
                     onClick={() => setCurrentTab(0)}
                  >
                     Auto
                  </button>
                  <button
                     id="teamdata-graphs-button"
                     className={`teamdata-button ${
                        currentTab == 1 ? "active" : "inactive"
                     }`}
                     onClick={() => setCurrentTab(1)}
                  >
                     Graphs
                  </button>
                  <button
                     id="teamdata-notes-button"
                     className={`teamdata-button ${
                        currentTab == 2 ? "active" : "inactive"
                     }`}
                     onClick={() => setCurrentTab(2)}
                  >
                     Notes
                  </button>
               </div>
               <div id="teamdata-tab">
                  {currentTab == 0
                     ? <AutosTab />
                     : currentTab == 1
                     ? <GraphsTab />
                     : <NotesTab />}
               </div>
            </div>
         </motion.div>
      </>
   );
};

export default TeamPage;
