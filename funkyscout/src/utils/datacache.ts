import { openDB } from "idb";
import supabase from "./supabase"

const version = 1;

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
const initializeEvent = async (event: string, user: string) => {
   const { data: event_data, error } = await supabase
      .from("event_data")
      .select("*")
      .eq("event", event)
      .eq("author", user)

   if (error) {
      console.error(error);
      return;
   }

   if (event_data && event_data.length > 0) {
      try {
         const db = await openDB("event", version, {
            upgrade(db) {
               if (!db.objectStoreNames.contains("matches")) {
                  db.createObjectStore("matches", { keyPath: "match" });
               }
            },
         });

         for (const match of event_data) {
            await db.put("matches", match);
         }
      } catch (error) {
         console.error(error);
      }
   }
};


export {initializeEvent};