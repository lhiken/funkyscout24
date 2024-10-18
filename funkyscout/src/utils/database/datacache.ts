import { openDB } from "idb";
import supabase from "./supabase";
import { Tables } from "./database.types";


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
      console.log(nextMatch);
      return nextMatch;
   } else {
      return null;
   }
};

export { getCount, getNextMatch, initializeDB };
