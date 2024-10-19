import { useParams } from "react-router-dom";

const MatchScouting = () => {
   const { id } = useParams();

   const match = Number(id?.substring(
      id.indexOf('q') + 1,
      id.indexOf('t')
   ))
   const team = Number(id?.substring(
      id.indexOf('t') + 1
   ))

   console.log(`${match} ${team}`);

   return (
      <>
      
      </>
   )
}

export default MatchScouting;