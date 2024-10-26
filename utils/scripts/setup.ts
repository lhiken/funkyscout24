import supabase from "./database";
import { PostgrestError } from "@supabase/supabase-js";
import "dotenv/config";

let startTime = performance.now();

async function SetupEvent(event_code: string) {
   console.log(`Uploading teams.\n`);

   let teamError: PostgrestError;
   let teams = 0;

   const updateTeams = async (data: any[]) => {
      for (let team of data) {
         process.stdout.clearLine(-1);
         process.stdout.cursorTo(0);
         process.stdout.write(`| Attempting update: ${team.team_number}`);

         try {
            const { data: team_data, error } = await supabase
               .from("team_data")
               .insert([
                  {
                     event: event_code,
                     team: team.team_number,
                     avg_score: 0,
                     avg_amp: 0,
                     avg_speaker: 0,
                     failures: 0,
                     defense: 0,
                  },
               ])
               .select();

            if (error != null) {
               process.stdout.clearLine(-1);
               process.stdout.cursorTo(0);
               process.stdout.write(
                  `| An error occured; upload unsuccessful.\n`,
               );
               teamError = error;
               break;
            }
         } catch {
            teamError = {
               message: "unknown",
               details: "none",
               hint: "none",
               code: "001",
            };
         }
      }
      console.log(`\nTEAMS: Uploaded ${teams} teams.`);
      console.log("-- Errors --");
      console.log(teamError ? teamError : "None.");
      setupMatches(event_code);
   };

   fetch(
      `https://www.thebluealliance.com/api/v3/event/${event_code}/teams/simple`,
      {
         headers: {
            "X-TBA-Auth-Key": String(process.env.TBA_KEY),
         },
      },
   )
      .then(
         (res) => {
            console.log("| TBA response: " + res.status + " " + res.statusText);
            if (res.ok) {
               return res.json();
            }
         },
      )
      .then(
         (data) => {
            console.log(`| Received ${data.length} teams\n`);
            updateTeams(data);
         },
      )
      .catch((error) => {
         console.error(`Error occured with ${error}`);
      });
}

async function setupMatches(event_code: string) {
   console.log(`\n\nUploading matches.\n`);

   let matchError: PostgrestError;
   let matches = 0;

   const updateMatches = async (data: any[]) => {
      let attempts = 0;

      for (let match of data) {
         if (match.comp_level == "qm") {
            let match_num = match.match_number;
            let redAlliance = match.alliances.red;
            let blueAlliance = match.alliances.blue;

            //I know this looks bad, buuuuttt... im way too lazy to fix it.
            for (let team of redAlliance.team_keys) {
               process.stdout.clearLine(-1);
               process.stdout.cursorTo(0);
               process.stdout.write(
                  `| Attempting update: qm${match_num}r, Team ${team}`,
               );
               team = team.slice(3);

               attempts++;

               try {

                  console.log(team);
                  const { data: event_data, error } = await supabase
                     .from("event_data")
                     .insert([
                        {
                           event: event_code,
                           match: match_num,
                           team: team == "841B" ? 9998 : team == "7419B" ? 9999 : team,
                           alliance: true,
                        },
                     ])
                     .select();

                  if (error) {
                     process.stdout.clearLine(-1);
                     process.stdout.cursorTo(0);
                     process.stdout.write(
                        `| An error occured; upload unsuccessful.`,
                     );
                     matchError = error;
                     
                  } else {
                     matches++;
                  }
               } catch {
                  console.error("Match INSERT");
               }
            }

            for (let team of blueAlliance.team_keys) {
               process.stdout.clearLine(-1);
               process.stdout.cursorTo(0);
               process.stdout.write(
                  `| Attempting update: qm${match_num}b, Team ${team}`,
               );

               team = team.slice(3);

               attempts++;

               try {
                  const { data: event_data, error } = await supabase
                     .from("event_data")
                     .insert([
                        {
                           event: event_code,
                           match: match_num,
                           team: team == "841B" ? 9998 : team == "7419B" ? 9999 : team,
                           alliance: false,
                        },
                     ])
                     .select();

                  if (error) {
                     process.stdout.cursorTo(0);
                     process.stdout.clearLine(0);
                     process.stdout.write(
                        `| An error occured; upload unsuccessful.`,
                     );
                     matchError = error;
                  } else {
                     matches++;
                  }
               } catch {
                  console.error("Match INSERT");
               }
            }

         }
      }
      let endTime = performance.now();
      console.log(`\n| Made ${attempts} update attempts.`);
      console.log(
         `| Operation completed in ${Math.round(endTime - startTime) / 1000}s.`,
      );
      console.log(`\nMATCHES: Updated ${matches} match permutations.`);
      console.log("-- Errors --");
      console.log(matchError ? matchError : "None");
   };

   fetch(
      `https://www.thebluealliance.com/api/v3/event/${event_code}/matches/simple`,
      {
         headers: {
            "X-TBA-Auth-Key": String(process.env.TBA_KEY),
         },
      },
   )
      .then(
         (res) => {
            console.log("| TBA response: " + res.status + " " + res.statusText);
            if (res.ok) {
               return res.json();
            }
         },
      )
      .then(
         (data) => {
            console.log(
               `| Received ${data.length} matches, expecting ~${
                  (data.length - 16) * 6
               } updates.\n`,
            );
            updateMatches(data);
         },
      )
      .catch((error) => {
         console.error(`Error occured with ${error}`);
      });
}

export default SetupEvent;
