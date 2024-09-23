import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { InstallPrompt, WelcomePrompt } from "../../components/auth/install-prompt"
import { useEffect, useState } from "react"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field } from "@headlessui/react"
import supabase from "../../utils/supabase"
import './styles/auth.css'

const AuthPage = () => {
   const installed = window.matchMedia('(display-mode: standalone)').matches;
   const navigate = useNavigate();

   const handleAuthSubmit = () => {
      navigate("/dashboard");
   }

   interface EventData {
      id: number,
      event_code: string,
      event_date: string | null,
   }

   const [events, setEvents] = useState<EventData[]>();
   const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

   const getEvents = async () => {
      const { data: events, error } = await supabase
         .from('events')
         .select('id, event_code, event_date')

      if (error) {
         throw error;
      }

      return events!.map(event => ({
         id: event.id,
         event_code: event.event_code,
         event_date: event.event_date,
      }));
   }

   useEffect(() => {
      let fetch = true;
      if (fetch == true) {
         getEvents().then(
            result => setEvents(result),
            error => setEvents(error),
         )
      }
      return () => {
         fetch = false;
      }
   }, []);

   //debug purposes

   interface ScouterData {
      id: number,
      name: string,
   }

   const [scouters, setScouters] = useState<ScouterData[]>();
   const [selectedScouters, setSelectedScouters] = useState<ScouterData | null>(null)

   const getScouters = async () => {
      if (selectedEvent) {
         try {
            const { data: scouters, error } = await supabase
               .from(`scouters`)
               .select('id, name')
               .eq('event_code', selectedEvent.event_code)

            if (error) {
               throw error;
            }

            return scouters!.map(scouter => ({
               id: scouter.id,
               name: scouter.name,
            }));
         } catch (error) {
            console.log(error);
         }
      }
   }


   useEffect(() => {
      getScouters().then(
         result => setScouters(result),
         error => setScouters(error),
      )
   }, [selectedEvent])


   const [eventQuery, setEventQuery] = useState('');

   const queriedEvents =
      eventQuery == ''
         ? events
         : events?.filter((event) => {
            return event.event_code.toLowerCase().includes(eventQuery.toLowerCase());
         })

   const [scouterQuery, setScouterQuery] = useState('');

   const queriedScouters =
      scouterQuery == ''
         ? scouters
         : scouters?.filter((scouter) => {
            return scouter.name.toLowerCase().includes(scouterQuery.toLowerCase());
         })

   return (
      <>
         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            id="auth-body"
         >
            <div id="auth-header">
               funkyscout
            </div>
            {installed ? <WelcomePrompt /> : <InstallPrompt />}
            <div id="auth-box">
               <Field id="auth-top">
                  <Combobox value={selectedEvent} onChange={setSelectedEvent} onClose={() => setEventQuery('')}>
                     {({ open }) => (
                        <>
                           <ComboboxButton>
                              <i className="fa-solid fa-chevron-down"></i>
                           </ComboboxButton>
                           <ComboboxInput
                              aria-label="Event"
                              onChange={(input) => setEventQuery(input.target.value)}
                              displayValue={(event: EventData | null) => event?.event_code ?? ''}
                              placeholder="Event"
                              id="auth-input"
                           />
                           <AnimatePresence>
                              {open && (
                                 <ComboboxOptions
                                    static
                                    as={motion.div}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onAnimationComplete={() => setEventQuery('')}
                                    anchor={{ to: 'top', gap: '0.8rem' }}
                                    id="auth-dropdown-container"
                                 >
                                    <div id="auth-dropdown-header">Events</div>
                                    <div id="auth-dropdown-line" />
                                    {queriedEvents?.map((event) => (
                                       <ComboboxOption key={event.id} value={event} id="auth-dropdown-option">
                                          {event.event_code}
                                       </ComboboxOption>
                                    ))}
                                 </ComboboxOptions>
                              )}
                           </AnimatePresence>
                        </>
                     )}
                  </Combobox>
               </Field>
               <Field id='auth-bottom'>
                  <div id="auth-name">
                     <Combobox value={selectedScouters} onChange={setSelectedScouters} onClose={() => setScouterQuery('')} >

                        {({ open }) => (
                           <>
                              <ComboboxButton >
                                 <i className="fa-solid fa-chevron-down" ></i>

                              </ComboboxButton>
                              <ComboboxInput
                                 aria-label="Name"
                                 onChange={(input) => setScouterQuery(input.target.value)}
                                 displayValue={(scouter: ScouterData | null) => scouter?.name ?? ''}
                                 placeholder="Name"

                              />
                              <AnimatePresence>
                                 {open && (
                                    <ComboboxOptions
                                       static
                                       as={motion.div}
                                       initial={{ opacity: 0, y: -20 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       exit={{ opacity: 0, y: -20 }}
                                       onAnimationComplete={() => setScouterQuery('')}
                                       anchor={{ to: 'top', gap: '0.8rem' }}
                                       id="auth-dropdown-container"
                                    >
                                       <div id="auth-dropdown-header">Scouters</div>
                                       <div id="auth-dropdown-line" />
                                       {queriedScouters?.map((scouter) => (
                                          <ComboboxOption key={scouter.id} value={scouter} id="auth-dropdown-option">
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
                  <button id="auth-submit" onClick={handleAuthSubmit}>
                     <i className="fa-solid fa-arrow-right" />
                  </button>

               </Field>

            </div>
         </motion.div>
      </>
   );
}

export default AuthPage;