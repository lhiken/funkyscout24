import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ProgressRing from "../../../components/routes/dash/progress-ring";
import supabase from "../../../utils/database/supabase";
import throwNotification from "../../../components/notification/notifiication";
import TextTransition from "react-text-transition";
import "./datapage.css";
import { getMatchData } from "../../../utils/helpers/fetch";
import { fetchProbability } from "../../../utils/database/datacache";
import { useNavigate } from "react-router-dom";

const DataPage = () => {
   const [totalMatches, setTotalMatches] = useState(0);
   const [scoutedMatches, setScoutedMatches] = useState(0);
   const [totalTeams, setTotalTeams] = useState(0);
   const [scoutedTeams, setScoutedTeams] = useState(0);

   const [nextMatch, setNextMatch] = useState(0);
   const [nextMatchTime, setNextMatchTime] = useState(0);
   const [blueTeams, setBlueTeams] = useState<number[]>([0, 0, 0]);
   const [redTeams, setRedTeams] = useState<number[]>([0, 0, 0]);

   const [teams, setTeams] = useState<{
      key: number;
      name: string;
      rank: number;
   }[]>([]);

   const navigate = useNavigate();

   const [nextMatchProbabilities, setNextMatchProbabilities] = useState({
      blue: 0,
      red: 0,
   });

   const fetched = useRef(false);

   const fetchScoutedCount = async () => {
      try {
         const { count, error } = await supabase
            .from("match_data")
            .select("*", { count: "exact", head: true })
            .eq("event", localStorage.getItem("event")!);

         if (error) {
            return false;
         } else if (count) {
            setScoutedMatches(count);
            return true;
         }
      } catch {
         return false;
      }
   };

   const fetchMatchCount = async () => {
      try {
         const { count, error } = await supabase
            .from("event_data")
            .select("*", { count: "exact", head: true })
            .eq("event", localStorage.getItem("event")!);

         if (error) {
            return false;
         } else if (count) {
            setTotalMatches(count);
            return true;
         }
      } catch {
         return false;
      }
   };

   const fetchTeamCount = async (all: boolean) => {
      try {
         if (all) {
            const { count, error } = await supabase
               .from("team_data")
               .select("*", { count: "exact", head: true })
               .eq("event", localStorage.getItem("event")!);

            if (error) {
               return false;
            } else if (count) {
               setTotalTeams(count);
               return true;
            }
         } else {
            const { data, error } = await supabase
               .rpc("count_teams", {
                  event_name: localStorage.getItem("event")!,
               });

            if (error) {
               return false;
            } else {
               setScoutedTeams(data!);
               return true;
            }
         }
      } catch {
         return false;
      }
   };

   const fetchNextMatch = async (): Promise<
      { redTeams: number[]; blueTeams: number[] }
   > => {
      const response = await fetch(
         `https://www.thebluealliance.com/api/v3/team/frc846/events/2024/statuses`,
         {
            method: "GET",
            headers: {
               "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY,
            },
         },
      );

      if (!response.ok) {
         throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      const eventKey = localStorage.getItem("event")!;
      const nextMatchKey = data?.[eventKey]?.next_match_key ||
         data?.[eventKey]?.last_match_key;

      console.log(data);

      if (nextMatchKey) {
         const matchNumber = nextMatchKey.substring(
            nextMatchKey.indexOf("_") + 3,
         );
         setNextMatch(matchNumber);

         const res = await getMatchData(matchNumber);
         if (res) {
            setNextMatchTime(res.startTime);
            setBlueTeams(res.blueTeams);
            setRedTeams(res.redTeams);
            return { redTeams: res.redTeams, blueTeams: res.blueTeams };
         }
      }

      return { redTeams: [0, 0, 0], blueTeams: [0, 0, 0] };
   };

   const getTimeDifference = (startTime: number) => {
      const diff = startTime - Date.now();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
         return `${hours % 24}h`;
      } else if (minutes > 0) {
         return `${minutes % 60}m`;
      } else {
         return `now`;
      }
   };

   const handleTeamClick = (team: number) => {
      if (team > 0) {
         navigate(`/data/team/${team}`);
      } else {
         throwNotification("error", "Can't view data offline");
      }
   };

   interface Team {
      key: number;
      name: string;
      rank: number;
   }

   // interface RankData {
   //    [key: string]: {
   //       qual: {
   //          ranking: {
   //             rank: number;
   //          };
   //       };
   //    };
   // }

   const fetchEventTeams = async (): Promise<Team[]> => {
      const response = await fetch(
         `https://www.thebluealliance.com/api/v3/event/${localStorage.getItem(
            "event",
         )!}/teams/simple`,
         {
            method: "GET",
            headers: {
               "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY as string,
            },
         },
      );

      if (!response.ok) {
         throwNotification("error", "Error fetching data");
         throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: { team_number: number; nickname: string }[] = await response
         .json();

      const newTeams: Team[] = data.map((team) => ({
         key: team.team_number,
         name: team.nickname,
         rank: 0,
      }));

      const rankResponse = await fetch(
         `https://www.thebluealliance.com/api/v3/event/${localStorage.getItem(
            "event",
         )!}/teams/statuses`,
         {
            method: "GET",
            headers: {
               "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY as string,
            },
         },
      );

      if (!rankResponse.ok) {
         throwNotification("error", "Error fetching data");
         throw new Error(`Error fetching data: ${response.statusText}`);
      }

      // const rankData: RankData = await rankResponse.json();

      const rankedTeams: Team[] = newTeams.map((team) => ({
         key: team.key,
         name: team.name,
         rank: /* rankData[`frc${team.key}`]?.qual.ranking.rank || */ 0,
      }));

      return rankedTeams;
   };

   if (!fetched.current) {
      const totalMatches = fetchMatchCount();
      const scoutedMatches = fetchScoutedCount();
      const totalTeams = fetchTeamCount(false);
      const scoutedTeams = fetchTeamCount(true);

      throwNotification("info", "Loading data...");

      if (window.navigator.onLine) {
         if (!totalMatches || !scoutedMatches || !totalTeams || !scoutedTeams) {
            throwNotification("error", "Error fetching data");
         }

         fetchNextMatch().then((res) => {
            fetchProbability(res.redTeams, res.blueTeams).then((res) => {
               if (res) {
                  setNextMatchProbabilities({
                     blue: res.blue + res.red != 0
                        ? res.blue / (res.blue + res.red)
                        : 0,
                     red: res.blue + res.red != 0
                        ? res.red / (res.blue + res.red)
                        : 0,
                  });
               } else {
                  throwNotification("error", "Failed to get probability");
               }
            });
         });

         fetchEventTeams().then((res) => {
            setTeams(res);
            console.log(res);
            throwNotification("info", "Loading complete");
         });
      } else {
         throwNotification("error", "Can't view data offline");
      }

      fetched.current = true;
   }

   const [query, setQuery] = useState("");

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
   };

   const queriedTeams = query == "" ? teams : teams?.filter((team) => {
      return team.name.toLowerCase().includes(query.toLowerCase()) ||
         String(team.key).includes(query.toLowerCase());
   });

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
            key="dataview"
            id="dashboard"
         >
            <div id="dashboard-main">
               <div id="dashboard-scouting-overview">
                  <div id="overview-left">
                     <div id="dashboard-section-header">
                        Scouting Overview
                     </div>
                     <div
                        id="dashboard-section-details"
                        className="transition"
                     >
                        <TextTransition inline={true}>
                           {scoutedMatches}
                        </TextTransition>
                        &nbsp;records
                     </div>
                     <div
                        id="dashboard-section-details"
                        className="transition dim"
                     >
                        <TextTransition inline={true}>
                           {totalMatches}
                        </TextTransition>
                        &nbsp;quoted
                     </div>
                     <div id="dashboard-section-seperator" />
                     <div id="dashboard-section-details">
                        Data Coverage
                     </div>
                     <div id="dashboard-section-details" className="dim">
                        <TextTransition inline={true}>
                           {totalTeams != 0
                              ? ((scoutedTeams / totalTeams) * 100).toFixed(0)
                              : 0}
                        </TextTransition>% of teams
                     </div>
                  </div>
                  <div id="dashboard-overview-progress">
                     <ProgressRing
                        stroke={1.3}
                        radius={4.5}
                        progress={totalMatches != 0
                           ? scoutedMatches / totalMatches
                           : 0}
                        label={`${scoutedMatches} of ${totalMatches}`}
                     />
                  </div>
               </div>
               <div id="data-next-match-container">
                  <div id="data-match-left">
                     <div id="dashboard-section-header">
                        Next Match
                     </div>
                     <div id="dashboard-section-details">
                        Match {nextMatch} | {getTimeDifference(
                           nextMatchTime,
                        )}
                     </div>
                     <div id="dashboard-section-seperator" />
                     <div className="progress-container">
                        <progress
                           id="progress-bar"
                           value={nextMatchProbabilities.red != 0
                              ? nextMatchProbabilities.red
                              : 0.5}
                           max="1"
                        />
                        <span className="progress-bar-text left">
                           {(nextMatchProbabilities.red * 100).toFixed(0)}%
                        </span>
                        <span className="progress-bar-text right">
                           {(nextMatchProbabilities.blue * 100).toFixed(0)}%
                        </span>
                     </div>
                  </div>
                  <div id="data-alliance-tables">
                     <div id="data-team-table">
                        <div id="data-team-table-section">
                           <button
                              id="team-select-button"
                              onClick={() => handleTeamClick(redTeams[0])}
                           >
                              {redTeams[0] ? redTeams[0] : "..."}
                           </button>
                           <div className="team-select-seperator red">|</div>
                           <button
                              id="team-select-button"
                              onClick={() => handleTeamClick(redTeams[1])}
                           >
                              {redTeams[1] ? redTeams[1] : "..."}
                           </button>
                           <div className="team-select-seperator red">|</div>
                           <button
                              id="team-select-button"
                              onClick={() => handleTeamClick(redTeams[2])}
                           >
                              {redTeams[2] ? redTeams[2] : "..."}
                           </button>
                        </div>
                        <div id="data-team-table-section">
                           <button
                              id="team-select-button"
                              onClick={() => handleTeamClick(blueTeams[0])}
                           >
                              {blueTeams[0] ? blueTeams[0] : "..."}
                           </button>
                           <div className="team-select-seperator blue">|</div>
                           <button
                              id="team-select-button"
                              onClick={() => handleTeamClick(blueTeams[1])}
                           >
                              {blueTeams[1] ? blueTeams[1] : "..."}
                           </button>
                           <div className="team-select-seperator blue">|</div>
                           <button
                              id="team-select-button"
                              onClick={() => handleTeamClick(blueTeams[2])}
                           >
                              {blueTeams[2] ? blueTeams[2] : "..."}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
               <div id="data-team-display">
                  <div style={{ position: "relative", width: "100%" }}>
                     <i
                        className="fa-solid fa-magnifying-glass"
                        style={{
                           position: "absolute",
                           top: "50%",
                           right: "1.5rem",
                           transform: "translateY(-50%)",
                           color: "var(--dark-text)",
                           pointerEvents: "none",
                        }}
                     />
                     <input
                        type="text"
                        placeholder="Search for a team"
                        value={query}
                        onChange={handleChange}
                        id="data-team-searchbox"
                     />
                  </div>
                  <div id="teams-container">
                     {queriedTeams.length != 0
                        ? queriedTeams/*?.sort((a, b) => {
                           if (a.rank > b.rank) return 1;
                           if (a.rank < b.rank) return -1;
                           return 0;
                        })*/.map((team, index) => (
                           <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -10, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              key={index}
                              className="team-card"
                              onClick={() => handleTeamClick(team.key)}
                           >
                              <div className="team-code">{team.key}</div>
                              <div className="team-name">{team.name}</div>
                              <div className="team-rank">#{team.rank}</div>
                           </motion.div>
                        ))
                        : (
                           <>
                              <div
                                 className="placeholder"
                                 style={{ height: "2rem" }}
                              />
                           </>
                        )}
                  </div>
               </div>
            </div>
         </motion.div>
      </>
   );
};

export default DataPage;
