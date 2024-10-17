import { useState } from "react";
import { getNextMatch } from "../../../utils/database/datacache";
import { AnimatePresence, motion } from "framer-motion";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field } from "@headlessui/react";
import './scouting.css';

const ScoutingPage = () => {
   const event = localStorage.getItem("event");
   const user = localStorage.getItem("user");

   interface ShiftData {
      match: number;
      alliance: boolean;
      team: number;
   }

   const [selectedMatch, setSelectedMatch] = useState<ShiftData | null>(null);

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
                           <ComboboxButton >
                              <i className="fa-solid fa-chevron-down" />
                           </ComboboxButton>
                           <ComboboxInput
                              aria-label="Match"
                              placeholder="Match"
                              autoComplete="off"
                              className="scouting-input"

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

                                    </ComboboxOptions>
                                 )}
                              </AnimatePresence>
                           </>
                        )}

                     </Combobox>

                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
                     <circle cx="27" cy="27" r="27" fill="#CDA745" fill-opacity="0.15" />
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
