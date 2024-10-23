import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/endgame.css";

interface EndgameData {
   climb: boolean;
   defense: boolean;
   comment: string;
}

const Endgame = (
   { handleSubmit, setEndgameData }: {
      handleSubmit: () => void;
      setEndgameData: React.Dispatch<React.SetStateAction<EndgameData>>;
   },
) => {
   const [climbed, setClimbed] = useState(false);
   const [defense, setDefense] = useState(false);
   const [comment, setComment] = useState("");

   const handleComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(event.target.value);
   };

   useEffect(() => {
      setEndgameData((data) => ({
         ...data,
         climb: climbed,
         defense: defense,
         comment: comment,
      }));

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [climbed, defense, comment]);

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="match-summary"
         >
            <div id="match-summary-top">
               <div id="checkbox-container">
                  <div id="match-summary-label">
                     Climbed
                     <button
                        id="match-summary-checkbox"
                        onClick={() => setClimbed(!climbed)}
                     >
                        {climbed
                           ? (
                              <i className="fa-solid fa-check" id="checkmark">
                              </i>
                           )
                           : <></>}
                     </button>
                  </div>
                  <div id="match-summary-label">
                     Defense
                     <button
                        id="match-summary-checkbox"
                        onClick={() => setDefense(!defense)}
                     >
                        {defense
                           ? (
                              <i className="fa-solid fa-check" id="checkmark">
                              </i>
                           )
                           : <></>}
                     </button>
                  </div>
               </div>
               <button id="submit-button" onClick={handleSubmit}>
                  <i className="fa-solid fa-check"></i>
               </button>
            </div>
            <div id="match-summary-bottom">
               <textarea
                  id="comment-input"
                  placeholder="Write some comments about this team..."
                  value={comment}
                  onChange={handleComment}
               />
            </div>
         </motion.div>
      </>
   );
};

export default Endgame;
