import { Tables } from "../../../../utils/database/database.types";
import { motion } from "framer-motion";

const NotesTab = ({ data }: { data: Tables<"match_data">[] }) => {
   if (!data || data.length == 0) {
      return <div className="data-tab">No data</div>;
   }

   return (
      <>
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="data-tab"
         >
            {data.map((match) => (
               <>
                  <div className="comment-wrapper">
                     <div className="data-note-header">
                        Qual {match.match} | {match.author}
                     </div>
                     <div className="data-note-comment">
                        {match.comment}
                     </div>
                  </div>
               </>
            ))}
         </motion.div>
      </>
   );
};

export default NotesTab;
