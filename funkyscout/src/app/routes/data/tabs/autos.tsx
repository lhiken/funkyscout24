import { Json } from '../../../../utils/database/database.types';
import DataAnalysisAuto from '../../../../components/routes/data/dataAnalysisAuto';
import './styles.css'
import { useState } from 'react';

const AutosTab = (
   { teamData }: {
      teamData: {
         alliance: boolean;
         auto: Json;
         match: number;
      }[];
   },
) => {
   const [matchIndex,setMatchIndex] = useState(0);
   const [match,setMatch] = useState(teamData[matchIndex].match);
   const [alliance,setAlliance] = useState(teamData[matchIndex].alliance);
   const [auto,setAuto] = useState(JSON.parse(teamData[matchIndex].auto));
   console.log(auto);
   const [startPosition,setPos]= useState(0);
   console.log(auto);

   const handleLeftButton = () => {
      if (matchIndex > 0) {
         const newIndex = matchIndex - 1;
         setMatchIndex(newIndex);
         setMatch(teamData[newIndex].match);
         setAlliance(teamData[newIndex].alliance);
         setAuto(typeof teamData[newIndex].auto === 'string'
            ? JSON.parse(teamData[newIndex].auto)
            : teamData[newIndex].auto);
      }
   };
   
   const handleRightButton = () => {
      if (matchIndex < teamData.length - 1) {
         const newIndex = matchIndex + 1;
         setMatchIndex(newIndex);
         setMatch(teamData[newIndex].match);
         setAlliance(teamData[newIndex].alliance);
         setAuto(typeof teamData[newIndex].auto === 'string'
            ? JSON.parse(teamData[newIndex].auto)
            : teamData[newIndex].auto);
      }
   };
   
   return (
      <>
         <div className="data-tab">
            <div id="matchbar">
               <button
                  id="match-button"
                  className={matchIndex > 0 ? "active" : "inactive"}
                  onClick={handleLeftButton}
               >
                  <i className="fa-solid fa-arrow-left"></i>
               </button>
               Match {match}
               <button
                  id="match-button"
                  className={matchIndex < teamData.length - 1 ? "active" : "inactive"}
                  onClick={handleRightButton}
               >
                  <i className="fa-solid fa-arrow-right"></i>
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
