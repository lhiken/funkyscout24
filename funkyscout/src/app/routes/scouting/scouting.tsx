import { useEffect, useState } from "react";
import { getNextMatch } from "../../../utils/database/datacache";
import { AnimatePresence, motion } from "framer-motion";
import { openDB } from "idb";
import {
   Combobox,
   ComboboxButton,
   ComboboxInput,
   ComboboxOption,
   ComboboxOptions,
   Field,
} from "@headlessui/react";
import "./scouting.css";

const ScoutingPage = () => {
   const event = localStorage.getItem("event");
   const user = localStorage.getItem("user");

   interface Match {
      match: number;
      blueTeams: number[];
      redTeams: number[];
   }

   const [isNextMatch, setIsNextMatch] = useState(true);
   const [matches, setMatches] = useState<Match[]>([]);
   const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
   const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
   const [currentAlliance, setCurrentAlliance] = useState<boolean | null>(null); // Boolean for alliance (true = blue, false = red)

   const fetchMatches = async (): Promise<Match[]> => {
      const db = await openDB(event!);
      const rows = await db.getAll("event_data");

      const matchesMap: { [key: number]: Match } = {};

      rows.forEach((row) => {
         if (!matchesMap[row.match]) {
            matchesMap[row.match] = {
               match: row.match,
               blueTeams: [],
               redTeams: [],
            };
         }

         if (row.alliance) {
            matchesMap[row.match].blueTeams.push(row.team);
         } else {
            matchesMap[row.match].redTeams.push(row.team);
         }
      });

      return Object.values(matchesMap);
   };

   const autofillData = async () => {
      try {
         const res = await getNextMatch(event!, user!);
         const matchNumber = res.match;

         const db = await openDB(event!);
         const rows = await db.getAll("event_data");

         const teamsMap: { blueTeams: number[]; redTeams: number[] } = {
            blueTeams: [],
            redTeams: [],
         };

         rows.forEach((row) => {
            if (row.match == matchNumber) {
               if (row.alliance) {
                  teamsMap.blueTeams.push(row.team);
               } else {
                  teamsMap.redTeams.push(row.team);
               }
            }
         });

         setSelectedMatch({
            match: matchNumber,
            blueTeams: teamsMap.blueTeams,
            redTeams: teamsMap.redTeams,
         });

         const matches = await db.getAllFromIndex(
            "event_data",
            "eventAuthors",
            user!,
         );

         const team = matches.find((o) => o.match == matchNumber)?.team;
         setSelectedTeam(team);
         updateAlliance(team, teamsMap.blueTeams, teamsMap.redTeams);
         setIsNextMatch(true);
      } catch (error) {
         console.error("Error autofilling match data:", error);
         setIsNextMatch(false);
      }
   };

   const handleShiftSelection = () => {
      fetchMatches()
         .then((res) => {
            setMatches(res);
            if (!selectedMatch) {
               autofillData();
            }
         })
         .catch((err) => console.error(err));
   };

   const updateAlliance = (
      team: number | null,
      blueTeams: number[],
      redTeams: number[],
   ) => {
      if (team) {
         if (blueTeams.includes(team)) {
            setCurrentAlliance(true);
         } else if (redTeams.includes(team)) {
            setCurrentAlliance(false);
         }
      } else {
         setCurrentAlliance(null);
      }
   };

   useEffect(() => {
      handleShiftSelection();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleMatchChange = (match: Match) => {
      setSelectedMatch(match);
      setIsNextMatch(false);
   };

   const handleTeamChange = (team: number) => {
      setSelectedTeam(team);
      if (selectedMatch) {
         updateAlliance(team, selectedMatch.blueTeams, selectedMatch.redTeams);
      }
      setIsNextMatch(false);
   };

   return (
      <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         exit={{ y: -20, opacity: 0 }}
         transition={{ duration: 0.2 }}
         id="scouting-page"
      >
         <div id="scouting-select-header">Scouting</div>
         <div id="scouting-select-box">
            <Field id="scouting-top">
               <Combobox value={selectedMatch} onChange={handleMatchChange}>
                  {({ open }) => (
                     <>
                        <ComboboxButton>
                           <i className="fa-solid fa-chevron-down" />
                        </ComboboxButton>
                        <ComboboxInput
                           aria-label="Match"
                           placeholder="Match"
                           autoComplete="off"
                           className="scouting-input"
                           onFocus={() => handleShiftSelection()}
                           displayValue={(match: Match | null) =>
                              match ? `Match ${match.match}` : ""}
                        />
                        <AnimatePresence>
                           {open && (
                              <ComboboxOptions
                                 static
                                 as={motion.div}
                                 initial={{ opacity: 0, y: -20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -20 }}
                                 style={{ height: "12rem" }}
                                 anchor={{ to: "top", gap: "0.8rem" }}
                                 id="scouting-dropdown-container"
                              >
                                 <div id="scouting-dropdown-header">
                                    Matches
                                 </div>
                                 <div id="scouting-dropdown-line" />
                                 {matches.map((match) => (
                                    <ComboboxOption
                                       key={match.match}
                                       value={match}
                                       id="scouting-dropdown-option"
                                    >
                                       {match.match}
                                    </ComboboxOption>
                                 ))}
                              </ComboboxOptions>
                           )}
                        </AnimatePresence>
                     </>
                  )}
               </Combobox>
            </Field>
            <div id="scouting-bottom">
               <Field>
                  <div
                     id="scouting-team"
                     className={selectedMatch == null ? "inactive" : "active"}
                  >
                     <Combobox value={selectedTeam} onChange={handleTeamChange}>
                        {({ open }) => (
                           <>
                              <ComboboxButton disabled={!selectedMatch}>
                                 <i className="fa-solid fa-chevron-down" />
                              </ComboboxButton>
                              <ComboboxInput
                                 aria-label="Team"
                                 placeholder="Team"
                                 autoComplete="off"
                                 className="scouting-input"
                                 style={{ width: "70%" }}
                                 displayValue={(team: number | null) =>
                                    team ? `Team ${team}` : ""}
                              />
                              <AnimatePresence>
                                 {open && selectedMatch && (
                                    <ComboboxOptions
                                       static
                                       as={motion.div}
                                       initial={{ opacity: 0, y: -20 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       exit={{ opacity: 0, y: -20 }}
                                       anchor={{ to: "top", gap: "0.8rem" }}
                                       id="scouting-dropdown-container"
                                    >
                                       <div id="scouting-dropdown-header">
                                          Teams
                                       </div>
                                       <div id="scouting-dropdown-line" />
                                       {[
                                          ...selectedMatch.blueTeams,
                                          ...selectedMatch.redTeams,
                                       ].map((team) => (
                                          <ComboboxOption
                                             key={team}
                                             value={team}
                                             id="scouting-dropdown-option"
                                          >
                                             {team}
                                          </ComboboxOption>
                                       ))}
                                    </ComboboxOptions>
                                 )}
                              </AnimatePresence>
                           </>
                        )}
                     </Combobox>
                  </div>
               </Field>
               <button
                  id="autofill-button"
                  className={isNextMatch ? "inactive" : "active"}
                  onClick={() => autofillData()}
               >
                  <i className="fa-solid fa-rotate-left" />
               </button>
            </div>
         </div>
         <div id="scouting-submit-box">
            <div id="match-details-box">
               <div id="match-details-top">
                  <div>
                     Match {selectedMatch?.match}
                  </div>
                  <div style={{ fontSize: "1.2rem" }}>
                     {isNextMatch
                        ? <i className="fa-regular fa-face-smile"></i>
                        : <i className="fa-regular fa-face-meh"></i>}
                  </div>
               </div>
               <div id="match-details-bottom">
                  FRC {selectedTeam}{" "}
                  <div
                     style={{ fontSize: "1.5rem" }}
                     className={currentAlliance === null
                        ? ""
                        : currentAlliance
                        ? "red"
                        : "blue"}
                  >
                     •
                  </div>
               </div>
            </div>
            <div
               id="submit-button"
               className={selectedMatch && selectedTeam ? "active" : "inactive"}
            >
               <i className="fa-solid fa-location-arrow" />
            </div>
         </div>
      </motion.div>
   );
};

export default ScoutingPage;
