import { AnimatePresence, motion } from "framer-motion";
import {
   InstallPrompt,
   WelcomePrompt,
} from "../../components/routes/auth/install-prompt";
import { useState } from "react";
import {
   Combobox,
   ComboboxButton,
   ComboboxInput,
   ComboboxOption,
   ComboboxOptions,
   Field,
} from "@headlessui/react";
import supabase from "../../utils/database/supabase";
import "./styles/auth.css";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/loading/loading";
import { initializeDB } from "../../utils/database/datacache";

interface EventData {
   id: number;
   event: string;
   date: string;
}

interface ScouterData {
   id: number;
   name: string;
}

const AuthPage = () => {
   const installed = window.matchMedia("(display-mode: standalone)").matches;
   const navigate = useNavigate();

   const validateUser = (user: ScouterData) => {
      for (const scouter of scouters!) {
         if (scouter.name == user.name) {
            return true;
         }
      }
      return false;
   };

   const [loading, setLoading] = useState(false);

   const handleAuthSubmit = () => {
      if (selectedEvent && selectedScouter && validateUser(selectedScouter)) {
         localStorage.setItem("user", selectedScouter.name);
         localStorage.setItem("event", selectedEvent.event);
         setLoading(true);
         initializeDB(selectedEvent.event)
            .then(() => {
               console.log("Initialized DB");
               navigate("/dashboard");
            })
            .catch((err) => {
               console.error("Init failed: " + err);
            });
      }
   };

   const [events, setEvents] = useState<EventData[]>();
   const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

   const getEvents = async () => {
      const { data: events, error } = await supabase
         .from("events")
         .select("id, event, date");

      if (error) {
         throw error;
      }

      return events!.map((event) => ({
         id: event.id,
         event: event.event,
         date: event.date,
      }));
   };

   const handleEventSelection = () => {
      setEvents(undefined);
      getEvents().then(
         (result) => setEvents(result),
         (error) => setEvents(error),
      );
   };

   const [scouters, setScouters] = useState<ScouterData[]>();
   const [selectedScouter, setselectedScouter] = useState<ScouterData | null>(
      null,
   );

   const fetchScouters = async () => {
      try {
         if (selectedEvent) {
            const { data: users, error } = await supabase
               .from("users")
               .select("id, name")
               .eq("event", selectedEvent.event);

            if (error) {
               console.error(error);
            }

            return users!.map((scouter) => ({
               id: scouter.id,
               name: scouter.name,
            }));
         }
      } catch (error) {
         console.log(error);
         return [];
      }
   };

   const handleScouterSelection = () => {
      setScouters(undefined);
      fetchScouters()
         .then((res) => setScouters(res))
         .catch((err) => console.error(err));
   };

   const [eventQuery, setEventQuery] = useState("");

   const queriedEvents = eventQuery == "" ? events : events?.filter((event) => {
      return event.event.toLowerCase().includes(eventQuery.toLowerCase());
   });

   const [scouterQuery, setScouterQuery] = useState("");

   const queriedScouters = scouterQuery == ""
      ? scouters
      : scouters?.filter((scouter) => {
         return scouter.name.toLowerCase().includes(scouterQuery.toLowerCase());
      });

   return (
      <>
         {loading ? <LoadingScreen label={"Fetching Data"} /> : null}
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
            key="auth"
            id="auth-body"
         >
            <div id="auth-header">
               funkyscout
            </div>
            <AnimatePresence>
               {installed ? <WelcomePrompt /> : <InstallPrompt />}
            </AnimatePresence>
            <div id="auth-box">
               <Field id="auth-top">
                  <Combobox
                     value={selectedEvent}
                     onChange={setSelectedEvent}
                     onClose={() => setEventQuery("")}
                  >
                     {({ open }) => (
                        <>
                           <ComboboxButton onClick={handleEventSelection}>
                              <i className="fa-solid fa-chevron-down" />
                           </ComboboxButton>
                           <ComboboxInput
                              aria-label="Event"
                              onChange={(input) =>
                                 setEventQuery(input.target.value)}
                              displayValue={(event: EventData | null) =>
                                 event?.event ?? ""}
                              placeholder="Event"
                              autoComplete="off"
                              className="auth-input"
                              onFocus={() => handleEventSelection()}
                           />
                           <AnimatePresence>
                              {open && (
                                 <ComboboxOptions
                                    static
                                    as={motion.div}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onAnimationComplete={() =>
                                       setEventQuery("")}
                                    anchor={{ to: "top", gap: "0.8rem" }}
                                    id="auth-dropdown-container"
                                 >
                                    <div id="auth-dropdown-header">Events</div>
                                    <div id="auth-dropdown-line" />
                                    {queriedEvents
                                       ? queriedEvents?.map((event) => (
                                          <ComboboxOption
                                             key={event.id}
                                             value={event}
                                             id="auth-dropdown-option"
                                          >
                                             {event.event}
                                          </ComboboxOption>
                                       ))
                                       : (
                                          <div id="auth-dropdown-option">
                                             <div
                                                className="placeholder"
                                                style={{
                                                   width: "8rem",
                                                   height: "1.2rem",
                                                }}
                                             >
                                                &nbsp;
                                             </div>
                                          </div>
                                       )}
                                 </ComboboxOptions>
                              )}
                           </AnimatePresence>
                        </>
                     )}
                  </Combobox>
               </Field>
               <Field id="auth-bottom">
                  <div
                     id="auth-name"
                     className={selectedEvent == null ? "inactive" : "active"}
                  >
                     <Combobox
                        value={selectedScouter}
                        onChange={setselectedScouter}
                        onClose={() => setScouterQuery("")}
                     >
                        {({ open }) => (
                           <>
                              <ComboboxButton
                                 disabled={selectedEvent == null}
                                 onClick={handleScouterSelection}
                              >
                                 <i className="fa-solid fa-chevron-down" />
                              </ComboboxButton>
                              <ComboboxInput
                                 disabled={selectedEvent == null}
                                 aria-label="Name"
                                 onChange={(input) =>
                                    setScouterQuery(input.target.value)}
                                 displayValue={(scouter: ScouterData | null) =>
                                    scouter?.name ?? ""}
                                 placeholder="Name"
                                 autoComplete="off"
                                 className={(selectedEvent == null
                                    ? "inactive"
                                    : "active") + " auth-input"}
                                 onFocus={handleScouterSelection}
                              />
                              <AnimatePresence>
                                 {open && (
                                    <ComboboxOptions
                                       static
                                       as={motion.div}
                                       initial={{ opacity: 0, y: -20 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       exit={{ opacity: 0, y: -20 }}
                                       onAnimationComplete={() =>
                                          setScouterQuery("")}
                                       anchor={{ to: "top", gap: "0.8rem" }}
                                       id="auth-dropdown-container"
                                    >
                                       <div id="auth-dropdown-header">
                                          Scouters
                                       </div>
                                       <div id="auth-dropdown-line" />
                                       {scouters
                                          ? (scouters.length == 0
                                             ? (
                                                <div id="auth-dropdown-option">
                                                   No data
                                                </div>
                                             )
                                             : null)
                                          : (
                                             <div id="auth-dropdown-option">
                                                <div
                                                   className="placeholder"
                                                   style={{
                                                      width: "8rem",
                                                      height: "1.2rem",
                                                   }}
                                                >
                                                   &nbsp;
                                                </div>
                                             </div>
                                          )}
                                       {queriedScouters?.map((scouter) => (
                                          <ComboboxOption
                                             key={scouter.id}
                                             value={scouter}
                                             id="auth-dropdown-option"
                                          >
                                             {scouter.name}
                                          </ComboboxOption>
                                       ))}
                                    </ComboboxOptions>
                                 )}
                              </AnimatePresence>
                           </>
                        )}
                     </Combobox>
                  </div>
                  <button
                     id="auth-submit"
                     onClick={handleAuthSubmit}
                     className={selectedEvent && selectedScouter
                        ? "active"
                        : "inactive"}
                  >
                     <i className="fa-solid fa-arrow-right" />
                  </button>
               </Field>
            </div>
         </motion.div>
      </>
   );
};

export default AuthPage;
