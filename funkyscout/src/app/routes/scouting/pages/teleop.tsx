import { useState } from "react";
import "../styles/teleop.css";
import throwNotification from "../../../../components/notification/notifiication";

interface teleopData {
   disabled: number;
   drop: number;
   amp: number;
   speaker: number;
}

const Teleop = (
   { teleopData, setTeleopData }: {
      teleopData: teleopData;
      setTeleopData: React.Dispatch<React.SetStateAction<teleopData>>;
   },
) => {
   const [permitIntake, setPermitIntake] = useState(true);
   const [permitScore, setPermitScore] = useState(false);
   const [disabled, setDisabled] = useState(false);

   const handleIntake = () => {
      if (permitIntake) {
         setPermitScore(true);
         setPermitIntake(false);
         throwNotification('success', 'Marked note intake')
      } else {
         throwNotification("error", "Confirm note status first!");
      }
   };

   const handleScore = (location: string) => {
      if (permitScore) {
         if (location == "miss") {
            setTeleopData({ ...teleopData, drop: teleopData.drop + 1 });
            throwNotification('success', 'Marked miss/drop')
         }
         if (location == "speaker") {
            setTeleopData({ ...teleopData, speaker: teleopData.speaker + 1 });
            throwNotification('success', 'Marked speaker score')
         }
         if (location == "amp") {
            setTeleopData({ ...teleopData, amp: teleopData.amp + 1 });
            console.log(teleopData);
            throwNotification('success', 'Marked amp score')
         }
         setPermitIntake(true);
         setPermitScore(false);
      } else {
         throwNotification("error", "Intake a note first!");
      }
   };

   const handleDisable = () => {
      if (!disabled) {
         setTeleopData({ ...teleopData, drop: teleopData.drop + 1 });
         setDisabled(true);
         setPermitIntake(false);
         setPermitScore(false);
         throwNotification("success", "Marked as disabled");
      } else {
         setDisabled(false);
         setPermitIntake(true);
         throwNotification("success", "Marked as enabled");
      }
   };

   return (
      <>
         <div id="teleop-page">
            <div id="teleop-left">
               <button
                  className={`teleop-button intake ${
                     permitIntake ? "active" : "inactive"
                  }`}
                  onClick={handleIntake}
               >
                  intake
               </button>
               <button
                  className={`teleop-button disabled ${
                     disabled ? "active" : "inactive"
                  }`}
                  onClick={handleDisable}
               >
                  disable
               </button>
            </div>
            <div id="teleop-right">
               <button
                  className={`teleop-button miss ${
                     permitScore ? "active" : "inactive"
                  }`}
                  onClick={() => handleScore("miss")}
               >
                  drop
               </button>
               <button
                  className={`teleop-button speaker ${
                     permitScore ? "active" : "inactive"
                  }`}
                  onClick={() => handleScore("speaker")}
               >
                  speaker
               </button>
               <button
                  className={`teleop-button amp ${
                     permitScore ? "active" : "inactive"
                  }`}
                  onClick={() => handleScore("amp")}
               >
                  amp
               </button>
            </div>
         </div>
      </>
   );
};

export default Teleop;
