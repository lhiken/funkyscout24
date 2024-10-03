import supabase from "./supabase"

const fetchEvent = async (event: string) => {
   const {data: event_data, error} = await supabase
      .from('event_data')
      .select('*')
      .eq('event', event);

   if (error) {
      console.error(error);
   }

   if (event_data) {
      console.log(event_data[4]);
   }
}

export {fetchEvent};