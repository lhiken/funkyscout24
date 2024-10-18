import { useState } from "react";
import { getNextMatch } from "../../../utils/database/datacache";
import { AnimatePresence, motion } from "framer-motion";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field } from "@headlessui/react";
import './scouting.css';
import supabase from "../../../utils/database/supabase";

const ScoutingPage = () => {
   const event = localStorage.getItem("event");
   const user = localStorage.getItem("user");

   interface ShiftData {
      match: number;
      alliance: boolean;
      team: number;
   }
   const [matches, setMatches] = useState<ShiftData[]>();
   const [selectedMatch, setSelectedMatch] = useState<ShiftData | null>(null);


   const fetchMatches = async () => {
         if(event && user){
         const{data:matches,error} = await supabase
            .from("event_data")
            .select("match,alliance,team")
            .eq("event",event)
            .eq("author",user)
            .order("match", { ascending: true })
            if (error) {
               console.error(error);
            }
            console.log(matches);
            return matches!.map((matches) => ({
               match: matches.match,
               alliance: matches.alliance,
               team :matches.team,
            }))
      }
   }
   
   const handleMatchSelection = () => {
      setMatches(undefined);
      fetchMatches()
         .then((res) => setMatches(res))
         .catch((err) => console.error(err));
      console.log(matches)
   };


   const autofillData = () => {
      getNextMatch(event!, user!).then((res) => {
         setSelectedMatch({
            match: res.match,
            alliance: res.alliance,
            team: res.team,
         });
      });
   };


   if (!selectedMatch) {
      autofillData();
   }

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="scouting-page"
         >
            <div id="scouting-select-header">
               Scouting
            </div>
            <div id="scouting-select-box">
               <Field id="scouting-top">
                  <Combobox
                     value={selectedMatch}
                     onChange={setSelectedMatch}
                  >
                     {({ open }) => (
                        <>
                           <ComboboxButton onClick ={handleMatchSelection}>
                              <i className="fa-solid fa-chevron-down" />
                           </ComboboxButton>
                           <ComboboxInput
                              aria-label="Match"
                              placeholder="Match"
                              autoComplete="off"
                              className="scouting-input"
                              displayValue={(match: ShiftData | null) =>
                                 match?.match.toString() ?? ""}

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
                                    <div id="scouting-dropdown-header">Matches</div>
                                    <div id="scouting-dropdown-line" />
                                    {matches?.map((match) => (
                                          <ComboboxOption
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
                  <div id="scouting-team">
                     <Combobox
                        value={selectedMatch}
                        onChange={setSelectedMatch}
                     >
                        {({ open }) => (
                           <>
                              <ComboboxButton >
                                 <i className="fa-solid fa-chevron-down" />
                              </ComboboxButton>
                              <ComboboxInput
                                 aria-label="Team"
                                 placeholder="Team"
                                 autoComplete="off"
                                 className="scouting-input"
                                 displayValue={(match: ShiftData | null) =>
                                    match?.team.toString() ?? ""}

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
                                       <div id="scouting-dropdown-header">Teams</div>
                                       <div id="scouting-dropdown-line" />
                                       <ComboboxOption
                                             //key={scouter.id}
                                             value={selectedMatch?.team}
                                             id="scouting-dropdown-option"
                                          >
                                             {selectedMatch?.team}
                                          </ComboboxOption>
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
                     <circle cx="27" cy="27" r="27" fill="#CDA745" fillOpacity="0.15" />
                  </svg>
               </Field>
            </div>
            <div id="scouting-submit-box">
               Start Shift
               <button id="scouting-submit">
                     <i className="fa-solid fa-arrow-right" />
                  </button>
            </div>




            {/* <div id="scouting-match-input">
               <div id="scouting-match-input-header">
                  {selectedMatch?.match}
               </div>
               <div id="scouting-match-input-subheader">
                  Autofilled for next match
               </div>
            </div> */}

         </motion.div>
      </>
   );
};

export default ScoutingPage;
