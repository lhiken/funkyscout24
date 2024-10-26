import { Json } from "../../../../utils/database/database.types";
import DataAnalysisAuto from "../../../../components/routes/data/dataAnalysisAuto";
import "./styles.css";
import { useState } from "react";

const AutosTab = (
   { teamData }: {
      teamData: {
         alliance: boolean;
         auto: Json;
         auto_position: number;
         match: number;
      }[];
   },
) => {
   const [matchIndex, setMatchIndex] = useState(0);
   const [match, setMatch] = useState(teamData[matchIndex].match);
   const [alliance, setAlliance] = useState(teamData[matchIndex].alliance);
   const [auto, setAuto] = useState(
      JSON.parse(teamData[matchIndex].auto as string),
   );
   console.log(auto);
   const [startPosition, setPos] = useState(teamData[matchIndex].auto_position);
   console.log(auto);

   const handleLeftButton = () => {
      if (matchIndex > 0) {
         const newIndex = matchIndex - 1;
         setMatchIndex(newIndex);
         setMatch(teamData[newIndex].match);
         setAlliance(teamData[newIndex].alliance);
         setAuto(
            typeof teamData[newIndex].auto === "string"
               ? JSON.parse(teamData[newIndex].auto)
               : teamData[newIndex].auto,
         );
         setPos(teamData[newIndex].auto_position);
      }
   };

   const handleRightButton = () => {
      if (matchIndex < teamData.length - 1) {
         const newIndex = matchIndex + 1;
         setMatchIndex(newIndex);
         setMatch(teamData[newIndex].match);
         setAlliance(teamData[newIndex].alliance);
         setAuto(
            typeof teamData[newIndex].auto === "string"
               ? JSON.parse(teamData[newIndex].auto)
               : teamData[newIndex].auto,
         );
         setPos(teamData[newIndex].auto_position);
      }
   };

   if (!teamData || teamData.length == 0) {
      return <div className="data-tab">No data</div>;
   }

   return (
      <>
         <div className="data-tab">
            <div id="matchbar">
               <button
                  id="match-button"
                  className={matchIndex > 0 ? "active" : "inactive"}
                  onClick={handleLeftButton}
               >
                  <i
                     className="fa-solid fa-arrow-left"
                     style={{ fontSize: "1.25rem" }}
                  >
                  </i>
               </button>
               Match {match}
               <button
                  id="match-button"
                  className={matchIndex < teamData.length - 1
                     ? "active"
                     : "inactive"}
                  onClick={handleRightButton}
               >
                  <i
                     className="fa-solid fa-arrow-right"
                     style={{ fontSize: "1.25rem" }}
                  >
                  </i>
               </button>
            </div>
            {auto.length > 0 && (
               <DataAnalysisAuto
                  alliance={alliance}
                  AutoPath={auto}
                  startPosition={startPosition}
               />
            )}
         </div>
      </>
   );
};

export default AutosTab;
