import { useState } from "react";
import { getNextMatch } from "../../../utils/database/datacache";
import { motion } from "framer-motion";

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
            transition={{ duration: 0.4 }}
            id="scouting-page"
         >
         <div id="match-scouting">
            Scouting
         </div>
         <div id="scouting-match-input">
            <div id="scouting-match-input-header">
               {selectedMatch?.match}
            </div>
            <div id="scouting-match-input-subheader">
               Autofilled for next match
            </div>
         </div>
         </motion.div>
      </>
   );
};

export default ScoutingPage;
