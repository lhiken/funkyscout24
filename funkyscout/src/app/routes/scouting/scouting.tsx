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

   const [matches, setMatches] = useState<Match[]>([]);
   const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
   const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

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

         setSelectedTeam(matches.find((o) => o.match == matchNumber).team);
      } catch (error) {
         console.error("Error autofilling match data:", error);
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

   useEffect(() => {
      handleShiftSelection();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

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
               <Combobox value={selectedMatch} onChange={setSelectedMatch}>
                  {({ open }) => (
                     <>
                        <ComboboxButton>
                           <i className="fa-solid fa-chevron-down" />
                        </ComboboxButton>
                        <ComboboxInput
                           aria-label="Match"
                           placeholder="Select Match"
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
            <Field id="scouting-bottom">
               <div
                  id="scouting-team"
                  className={selectedMatch == null ? "inactive" : "active"}
               >
                  <Combobox value={selectedTeam} onChange={setSelectedTeam}>
                     {({ open }) => (
                        <>
                           <ComboboxButton disabled={!selectedMatch}>
                              <i className="fa-solid fa-chevron-down" />
                           </ComboboxButton>
                           <ComboboxInput
                              aria-label="Team"
                              placeholder="Select Team"
                              autoComplete="off"
                              className="scouting-input"
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
               <svg
                  id="scouting-svg"
                  viewBox="0 0 54 54"
               >
                  <circle
                     cx="27"
                     cy="27"
                     r="27"
                     fill="#CDA745"
                     fillOpacity="0.15"
                  />
               </svg>
            </Field>
         </div>
         <div id="scouting-submit-box">
            Start Shift
            <button id="scouting-submit">
               <i className="fa-solid fa-arrow-right" />
            </button>
         </div>
      </motion.div>
   );
};

export default ScoutingPage;
