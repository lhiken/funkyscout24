const getMatchData = async (match: string) => {
   /* Nexus does not retain event data, so we fall back
    * to TBA's API when we get an error.
    *
    * Since TBA and Nexus's API responses have different
    * shapes, we will put the data we want into an object
    * and return that.
    */

   const event = localStorage.getItem("event");
   try {
      const response = await fetch(`https://frc.nexus/api/v1/event/${event}`, {
         method: "GET",
         headers: {
            "Nexus-Api-Key": import.meta.env.VITE_NEXUS_KEY,
         },
      });

      if (response.ok) {
         const data = await response.json();

         const requestedMatch = "Qualification " + match;

         for (const match of data.matches) {
            if (match.label == requestedMatch) {
               const redTeams = [
                  Number(match.redTeams[0]),
                  Number(match.redTeams[1]),
                  Number(match.redTeams[2]),
               ];
               const blueTeams = [
                  Number(match.blueTeams[0]),
                  Number(match.blueTeams[1]),
                  Number(match.blueTeams[2]),
               ];
               const startTime = match.times.estimatedStartTime;
               return {
                  redTeams,
                  blueTeams,
                  startTime,
               };
            }
         }
      } else {
         throw Error;
      }
   } catch {
      const response = await fetch(
         `https://www.thebluealliance.com/api/v3/event/${event}/matches/simple`,
         {
            method: "GET",
            headers: {
               "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY,
            },
         },
      );

      const data = await response.json();

      const requestedMatch = `${event}_qm${match}`;

      for (const match of data) {
         const red = match.alliances.red.team_keys;
         const blue = match.alliances.blue.team_keys;

         if (match.key == requestedMatch) {
            const redTeams = [
               Number(red[0].slice(3)),
               Number(red[1].slice(3)),
               Number(red[2].slice(3)),
            ];
            const blueTeams = [
               Number(blue[0].slice(3)),
               Number(blue[1].slice(3)),
               Number(blue[2].slice(3)),
            ];
            const startTime = match.predicted_time;
            return {
               redTeams,
               blueTeams,
               startTime,
            };
         }
      }
   }
};

export { getMatchData };
