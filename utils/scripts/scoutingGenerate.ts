import supabase from "./database";

const getScouter = async (event: string) => {
   const { data: users } = await supabase
      .from('users')
      .select('name')
      .eq("event", event!)
      .neq("name", "GUEST")

   const s = users?.map(row => Object.values(row));
   const scouters: [string, number, number][] = [];
   if (s) {
      for (let i = 0; i < s.length; i++) {
         scouters.push([s[i][0], Math.max(Math.min(i - s.length + 6),-6), 0])
      }
   }
   else { return };
   // [0] name, [1]matches before break if positive, matches before scout if negative [2] total matches
   return scouters;
}

const getEvent = async (event: string) => {
   let { data: event_data } = await supabase
      .from('event_data')
      .select('match,team,alliance,author')
      .eq("event", event!)
      .order('match', { ascending: false })
   const eventData = event_data?.map(row => Object.values(row));
   return eventData;
}
const findScouter = (scouters: [string, number, number][], scout: number) => {
   let availableScouters = [];

   // sort them by current matches and then total matches
   scouters=scouters.sort((a, b) =>
      b[1] - a[1])
   scouters=scouters.sort((a, b) => {
      if (a[1] == b[1]) {
         return a[2] - b[2];
      }
      else { return 0;}
   })


   for (let i = 0; i < scouters.length; i++) {
      if (scouters[i][1] >= 0 && scouters[i][1] < scout && assignScouter.length <= 6) {
         availableScouters.push(scouters[i]);
      }
   }
   while (availableScouters.length < 6) {
      scouters[0][1] = 0;
      availableScouters.push(scouters[0]);
   }
   while (availableScouters.length > 6) {
      availableScouters.pop();
   }
   return availableScouters;
}
const assignScouter = async (event: string, scout: number) => {
   const event_data = await getEvent(event);
   const scouters = await getScouter(event);
   let possibleBreak: number = 0;
   if (event_data && scouters) {

      //too much scoutingship than needed
      if (scout >= event_data?.length / 6) {
         console.error('no no no!')
         return;
      }
      // calculating the possible break >.<
      const avgScout = (event_data.length) / scouters.length;
      possibleBreak = (event_data.length / 6 - avgScout) / (avgScout / scout);
      possibleBreak = Math.floor(possibleBreak)
      console.log(possibleBreak + " possible break after " + scout + " scoutingship");

      if (possibleBreak < 1) {
         console.log("hey more break time ください");
      }

      for (let i = 0; i < event_data.length; i++) {
         let match = event_data[i][0];
         let team = event_data[i][1];
         let selectedScouters = findScouter(scouters, scout);
         if (typeof match == "number" && typeof team == "number") {

            const { data, error } = await supabase
               .from('event_data')
               .update({ author: selectedScouters[i % selectedScouters.length][0] })
               .eq("event", event!)
               .eq('match', match)
               .eq('team', team)
         }
         for (let k = 0; k < scouters.length; k++) {
            if (scouters[k][0] === selectedScouters[i % selectedScouters.length][0]) {
               scouters[k][1]++;
               scouters[k][2]++;
            }
            else if (scouters[k][1] >= scout) {
               scouters[k][1] = -1 * possibleBreak;
            }
            else if (i % 6 == 0 && scouters[k][1] < 0) {
               scouters[k][1]++;
            }
         }
      }
      console.log(scouters);
   }
}

export default assignScouter;
