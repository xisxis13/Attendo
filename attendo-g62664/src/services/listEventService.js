import { supabase } from "./supabase";
import { listUeService } from "./listUeService";

export const listEventService = {
  async getAllUeEvent(ue, sessionId) {
    try {
      const sessionCompo = await listUeService.getSessionCompoId(ue, sessionId);
      console.log("Session compo trouvé:", sessionCompo);
  
      if (!sessionCompo || !sessionCompo.id) {
        console.error(`No session_compo found for UE ${ue} and session ${sessionId}`);
        return [];
      }
  
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('session_compo', sessionCompo.id)
  
      if (error) {
        console.error("Erreur de requête Supabase:", error);
        throw error;
      }
      
      console.log("Events récupérés:", data);
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error.message);
      return [];
    }
  },

  async getEventById(eventId) {
    try {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching event by id:', error.message);
      return null;
    }
  },

  async createEvent(event) {
    try {
      const { data, error } = await supabase
        .from('event')
        .insert([event])
        .select()

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating event:', error.message);
      return null;
    }
  },

  async deleteEvent(eventId) {
    try {
      const { error } = await supabase
        .from('event')
        .delete()
        .eq('id', eventId);
  
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error.message);
      return false;
    }
  },
};