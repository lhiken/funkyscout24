import { useState } from "react";
import { useParams } from "react-router-dom";
import "./matchScouting.css";
import Auto from "../pages/auto";
import Teleop from "../pages/teleop";
import Endgame from "../pages/endgame";

const MatchScouting = () => {
   const { id } = useParams();

   const match = Number(
      id?.substring(
         id.indexOf("q") + 1,
         id.indexOf("t"),
      ),
   );
   const team = Number(
      id?.substring(
         id.indexOf("t") + 1,
      ),
   );

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

   if (gameState !== -1 && !timerStarted) {
      const interval = setInterval(() => {
         updateTime(interval);
      }, 100);
      setTimerStarted(true);
      console.log(match + ' ' + team);
   }

   return (
      <>
         <div id="scouting-container">
            <div id="scouting-tab-header">
               {gameState == 0
                  ? "Auto"
                  : gameState == 1
                  ? "Teleop"
                  : "Match End"} | {currentTime}s
            </div>
            <div>
               {gameState == 0
                  ? <Auto />
                  : gameState == 1
                  ? <Teleop />
                  : <Endgame />}
            </div>
         </div>
      </>
   );
};

export default MatchScouting;
