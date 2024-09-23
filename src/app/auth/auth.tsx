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
   }

   const [events, setEvents] = useState<EventData[]>();
   const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

   const getEvents = async () => {
      try {
         const { data: events, error } = await supabase
            .from('events')
            .select('id, event_code')

         if (error) {
            throw error;
         }

         return events!.map(event => ({
            id: event.id,
            event_code: event.event_code,
         }));
      } catch (error) {
         console.log(error);
      }
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

   const [query, setQuery] = useState<string>('');

   const filteredEvents =
      query == ''
         ? events
         : events?.filter((event) => {
            return event.event_code.toLowerCase().includes(query.toLowerCase());
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
                  <Combobox value={selectedEvent} onChange={setSelectedEvent} onClose={() => setQuery('')}>
                     {({ open }) => (
                        <>
                           <ComboboxButton>
                              <i className="fa-solid fa-chevron-down"></i>
                           </ComboboxButton>
                           <ComboboxInput
                              aria-label="Event"
                              onChange={(input) => setQuery(input.target.value)}
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
                                 onAnimationComplete={() => setQuery('')}
                                 anchor={{ to: 'top', gap: '0.8rem' }}
                                 id="auth-dropdown-container"
                              >
                                 <div id="auth-dropdown-header">Events</div>
                                 <div id="auth-dropdown-line" />
                                 {filteredEvents?.map((event) => (
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
               <div id='auth-bottom'>
                  <div id="auth-name">
                     <i className='fa-solid fa-chevron-down' />
                     <input defaultValue={"Name"}></input>
                  </div>
                  <button id="auth-submit" onClick={handleAuthSubmit}>
                     <i className="fa-solid fa-arrow-right" />
                  </button>
               </div>
            </div>
         </motion.div>
      </>
   );
}

export default AuthPage;