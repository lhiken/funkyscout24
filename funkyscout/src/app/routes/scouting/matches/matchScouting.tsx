import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./matchScouting.css";
import Auto from "../pages/auto";
import Teleop from "../pages/teleop";
import Endgame from "../pages/endgame";
import { motion } from "framer-motion";
import Note from "../../../../components/routes/auto/note";

interface MatchData {
   event: string;
   match: number;
   team: number;
   alliance: boolean;
   auto: Note[];
   miss: number;
   amp: number;
   speaker: number;
   climb: boolean;
   defense: number;
   disabled: number;
   comment: string;
   author: string;
}

const MatchScouting = () => {
   const { id } = useParams();

   const [AutoPath, setAutoPath] = useState<Note[]>([new Note(0)]);

   const [matchData, setMatchData] = useState<MatchData>({
      event: localStorage.getItem("event")!,
      match: Number(
         id?.substring(
            id.indexOf("q") + 1,
            id.indexOf("t"),
         ),
      ),
      team: Number(
         id?.substring(
            id.indexOf("t") + 1,
            id.indexOf("A"),
         ),
      ),
      alliance: id?.indexOf("r") != -1 ? true : false,
      auto: AutoPath,
      miss: 0,
      amp: 0,
      speaker: 0,
      climb: false,
      defense: 0,
      disabled: 0,
      comment: "",
      author: localStorage.getItem("user") ? localStorage.getItem("user")! : 'Guest',
   });

   const alliance = id?.indexOf("r") != -1 ? true : false;

   const time = Date.now();
   const teleTime = time + 1000 * 150;

   const [currentTime, setCurrentTime] = useState(0);
   const [gameState, setGameState] = useState(0);
   const [timerStarted, setTimerStarted] = useState(false);

   const updateTime = (interval: NodeJS.Timeout) => {
      setCurrentTime(
         getTimeDifference(new Date(Date.now()), new Date(teleTime), interval) /
            10,
      );
   };

   const getTimeDifference = (
      startTime: Date,
      endTime: Date,
      interval: NodeJS.Timeout,
   ) => {
      const diff = endTime.getTime() - startTime.getTime();

      const seconds = Math.floor(diff / 100);

      if (seconds <= 0) {
         setGameState(-1);
         setCurrentTime(0);
         clearInterval(interval);
      } else if (seconds < 1350) {
         setGameState(1);
      }

      return seconds;
   };

   if (gameState != -1 && !timerStarted) {
      setTimeout(() => {
         const interval = setInterval(() => {
            updateTime(interval);
         }, 50);
      });
      setTimerStarted(true);
      console.log(matchData.match + " " + matchData.team);
   }

   const autoNotes = useRef(0);

   interface teleopData {
      disabled: number,
      drop: number,
      amp: number,
      speaker: number,
   }

   const [teleopData, setTeleopData] = useState<teleopData>({
      disabled: 0,
      drop: 0,
      amp: 0,
      speaker: 0,
   });

   useEffect(() => {
      console.log(matchData);
      let notes = 0;
      AutoPath.forEach(note => {
         if (note.success) {
            notes++;
         }
      })
      autoNotes.current = notes;
      
      setMatchData(oldData => ({
         ...oldData,
         auto: AutoPath,
         amp: teleopData.amp,
         miss: teleopData.drop,
         speaker: teleopData.speaker,
         disabled: teleopData.disabled
      }));

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [AutoPath, teleopData]);

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="scouting"
            id="scouting-container"
         >
            <div id="scouting-tab-header">
               {gameState == 0
                  ? "Auto"
                  : gameState == 1
                  ? "Teleop"
                  : "Match Notes"}{" "}
               {currentTime > 0 ? `| ${currentTime.toFixed(1)}s` : null}
            </div>
            <div id="scouting-tab-container">
               {gameState == 0
                  ? (
                     <Auto
                        alliance={alliance}
                        startPosition={Number(id?.charAt(id.length - 1))}
                        AutoPath={AutoPath}
                        setAutoData={setAutoPath}
                     />
                  )
                  : gameState == 1
                  ? <Teleop 
                        teleopData={teleopData}
                        setTeleopData={setTeleopData}
                     />
                  : <Endgame />}
            </div>
            <div id="scouting-info-bar-wrapper">
               <div id="scouting-info-bar">
                  <div id="scouting-match-info">
                     <div id="info-top">
                        Match {matchData.match}
                     </div>
                     <div id="info-bottom">
                        FRC {matchData.team}
                     </div>
                  </div>
                  <div id="scouting-match-data">
                     <div id="data-header">
                        <div>
                           Shots
                        </div>
                        <div>
                           {matchData?.amp} A | {matchData?.speaker + autoNotes.current} S
                        </div>
                     </div>
                     <div id="data-header">
                        <div>
                           Cycle
                        </div>
                        <div>
                           {matchData
                              ? matchData.amp != 0 || matchData.speaker != 0
                                 ? (135 /
                                    (matchData?.amp + matchData?.speaker))
                                    .toFixed(1)
                                 : "0"
                              : "0"}s
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </>
   );
};

export default MatchScouting;
