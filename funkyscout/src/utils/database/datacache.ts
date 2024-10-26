import { openDB } from "idb";
import supabase from "./supabase";
import { Tables } from "./database.types";
import { MatchData } from "../../app/routes/scouting/matches/matchScouting";
import throwNotification from "../../components/notification/notifiication";

/* To store match data we use indexeddb, a built in
 * browser feature that's essentially localStorage
 * but better!
 *
 * Unlike localStorage, data is managed in tables
 * and can be queried much more easily. This is
 * perfect for us as we can store data in the same
 * way we do on our actual DB for offline use.
 *
 * The built-in API is kind of annoying to use so
 * we use this package instead and it just makes
 * things much easier.
 *
 * https://github.com/jakearchibald/idb
 */

/* InitializeEvent:
 * Used to fetch and store match schedule during user
 * login.
 */
const initializeDB = async (event: string) => {
   const eventData = await fetchEvent(event);
   const matchData = await fetchMatches(event);

   try {
      const version: number = 3;
      const db = await openDB(event, version, {
         upgrade(db) {
            if (
               !db.objectStoreNames.contains("event_data") &&
               !db.objectStoreNames.contains("match_data") &&
               !db.objectStoreNames.contains("match_personal")
            ) {
               const eventStore = db.createObjectStore("event_data", {
                  keyPath: ["match", "team"],
               });
               const matchStore = db.createObjectStore("match_data", {
                  keyPath: ["match", "team"],
               });

               db.createObjectStore("match_personal", { keyPath: "match" });

               eventStore.createIndex("eventAuthors", "author");
               matchStore.createIndex("matchAuthors", "author");
            }
         },
      });

      await writeTable(event, "event_data", eventData!);
      await writeTable(event, "match_data", matchData!);

      console.log(db);
   } catch (error) {
      console.error(error);
   }
};

const fetchEvent = async (event: string): Promise<
   Tables<"event_data">[] | undefined
> => {
   const { data: event_data, error } = await supabase
      .from("event_data")
      .select("*")
      .eq("event", event);

   if (error) {
      console.error(error);
      return;
   }

   return event_data;
};

const fetchMatches = async (event: string): Promise<
   Tables<"match_data">[] | undefined
> => {
   const { data: match_data, error } = await supabase
      .from("match_data")
      .select("*")
      .eq("event", event);

   if (error) {
      console.error(error);
      return;
   }

   return match_data;
};

const writeTable = async <dataType>(
   database: string,
   table: string,
   data: dataType[],
) => {
   const db = await openDB(database);

   for (const entry of data) {
      await db.put(table, entry);
   }
};

const writeClear = async <dataType>(
   database: string,
   table: string,
   data: dataType[],
) => {
   const db = await openDB(database);

   // Clear the table
   const tx = db.transaction(table, "readwrite");
   await tx.store.clear();
   await tx.done;

   // Add each entry to the table
   for (const entry of data) {
      await db.put(table, entry);
   }
};

//Not recommended for things that require performance!
//There is probably a better alternative out there!
const getCount = async (
   database: string,
   table: string,
   query?: { key: string; val: string },
) => {
   const db = await openDB(database);

   const transaction = db.transaction(table, "readonly");
   const store = transaction.objectStore(table);

   let count = 0;

   if (query == null) {
      return store.count();
   }

   for await (const cursor of store) {
      if (cursor.value[query.key] == query.val) {
         count++;
      }
   }

   return count;
};

const isOnline = () => {
   return navigator.onLine;
};

const getNextMatch = async (database: string, user: string) => {
   const db = await openDB(database);

   const tx = db.transaction(["event_data", "match_data"], "readonly");
   const eventStore = tx.objectStore("event_data");
   const matchStore = tx.objectStore("match_data");

   const assignedMatches = await eventStore.index("eventAuthors").getAll(user);
   const completeMatches = await matchStore.index("matchAuthors").getAll(user);

   const nextMatch = assignedMatches.find((assignedMatch) =>
      !completeMatches.some((completeMatch) =>
         completeMatch.match == assignedMatch.match
      )
   );

   if (nextMatch) {
      return nextMatch;
   } else {
      return null;
   }
};

const insertMatchData = async (MatchData: MatchData) => {
   try {
      const { data, error } = await supabase
         .from("match_data")
         .insert({
            event: MatchData.event,
            match: MatchData.match,
            team: MatchData.team,
            alliance: MatchData.alliance,
            auto: JSON.stringify(MatchData.auto),
            miss: MatchData.miss,
            amp: MatchData.amp,
            speaker: MatchData.speaker,
            climb: MatchData.climb,
            defense: MatchData.defense,
            disabled: MatchData.disabled,
            comment: MatchData.comment,
            author: MatchData.author,
         })
         .select();

      if (error) {
         if (error.code != "23505") {
            throwNotification("error", `Upload failed: ${error.code}`);
            return 1;
         }
         console.error(error.message);
         return 2;
      } else {
         console.log(data);
         return 0;
      }
   } catch (error) {
      throwNotification("error", `Error: ${error}`);
      return false;
   }
};

const updateMatch = async (MatchData: MatchData) => {
   const event = localStorage.getItem("event");

   const dbMatchData = {
      ...MatchData,
      auto: MatchData.auto,
   };

   const db = await openDB(event!);

   await db.add("match_data", dbMatchData);

   await syncData(event!);
};

const syncData = async (event: string) => {
   const db = await openDB(event);
   throwNotification("info", "Syncing data...");

   const tx = db.transaction("match_data", "readonly");
   const store = tx.objectStore("match_data");
   let cursor = await store.openCursor();
   let matches = 0;
   let attempts = 0;

   const matchesToUpsert = [];

   while (cursor) {
      const matchData = cursor.value;

      if (
         matchData.author === localStorage.getItem("user") ||
         matchData.author === "GUEST"
      ) {
         matchesToUpsert.push(matchData);
      }

      try {
         cursor = await cursor.continue();
      } catch {
         break;
      }
   }

   await tx.done;

   for (const match of matchesToUpsert) {
      const res = await insertMatchData(match);
      if (res == 0) {
         matches++;
         attempts++;
      } else if (res == 1) {
         attempts++;
      }
   }

   const eventData = await fetchEvent(localStorage.getItem("event")!);
   await writeClear(event, "event_data", eventData!);

   throwNotification("info", `${matches}/${attempts} matches synced`);
   if (!isOnline()) {
      throwNotification("error", "Check connection");
   }
};

const fetchProbability = async (redTeams: number[], blueTeams: number[]) => {
   let blueSum = 0;
   let redSum = 0;

   try {
      for (const team of redTeams) {
         const { data } = await supabase
            .rpc("fetch_average", {
               event_code: localStorage.getItem("event")!,
               team_id: team,
            });

         if (data) {
            redSum += data;
         }
      }

      for (const team of blueTeams) {
         const { data } = await supabase
            .rpc("fetch_average", {
               event_code: localStorage.getItem("event")!,
               team_id: team,
            });

         if (data) {
            blueSum += data;
         }
      }

      return { blue: blueSum, red: redSum };
   } catch {
      throwNotification("error", "Error fetching data");
   }
};

export {
   fetchProbability,
   getCount,
   getNextMatch,
   initializeDB,
   insertMatchData,
   syncData,
   updateMatch,
};
