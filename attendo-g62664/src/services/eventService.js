import { supabase } from "./supabase";
import { ueService } from "./ueService";

export const eventService = {
  async getAllForUeAndSession(ueId, sessionId) {
    try {
      if (!ueId || !sessionId) throw new Error('UE ID and Session ID are required');

      const sessionCompoId = await ueService.getSessionCompoId(ueId, sessionId);

      if (!sessionCompoId) throw new Error(`No association found between UE (${ueId}) and session (${sessionId})`);

      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('session_compo', sessionCompoId);

      if (error) throw new Error(`Error fetching events: ${error.message}`);

      return data || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async getById(eventId) {
    try {
      if (!eventId) throw new Error('Event ID is required');

      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw new Error(`Error fetching event (${eventId}): ${error.message}`);

      return data || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async create(eventData) {
    try {
      if (!eventData || !eventData.session_compo || !eventData.label) throw new Error('Event data is incomplete');

      const { data, error } = await supabase
        .from('event')
        .insert([eventData])
        .select();

      if (error) throw new Error(`Error creating event: ${error.message}`);

      return data[0] || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async delete(eventId) {
    try {
      if (!eventId) throw new Error('Event ID is required');

      const { error } = await supabase
        .from('event')
        .delete()
        .eq('id', eventId);

      if (error) throw new Error(`Error deleting event (${eventId}): ${error.message}`);

      return true;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  // async getAllUeEvent(ue, sessionId) {
  //   try {
  //     const sessionCompo = await ueService.getSessionCompoId(ue, sessionId);
  //     console.log("Session compo trouvé:", sessionCompo);
  
  //     if (!sessionCompo || !sessionCompo.id) {
  //       console.error(`No session_compo found for UE ${ue} and session ${sessionId}`);
  //       return [];
  //     }
  
  //     const { data, error } = await supabase
  //       .from('event')
  //       .select('*')
  //       .eq('session_compo', sessionCompo.id)
  
  //     if (error) {
  //       console.error("Erreur de requête Supabase:", error);
  //       throw error;
  //     }
      
  //     console.log("Events récupérés:", data);
  //     return data || [];
  //   } catch (error) {
  //     console.error('Error fetching events:', error.message);
  //     return [];
  //   }
  // },

  // async getEventById(eventId) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('event')
  //       .select('*')
  //       .eq('id', eventId)
  //       .single()

  //     if (error) throw error;
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching event by id:', error.message);
  //     return null;
  //   }
  // },

  // async createEvent(event) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('event')
  //       .insert([event])
  //       .select()

  //     if (error) throw error;
  //     return data[0];
  //   } catch (error) {
  //     console.error('Error creating event:', error.message);
  //     return null;
  //   }
  // },

  // async deleteEvent(eventId) {
  //   try {
  //     const { error } = await supabase
  //       .from('event')
  //       .delete()
  //       .eq('id', eventId);
  
  //     if (error) throw error;
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting event:', error.message);
  //     return false;
  //   }
  // },
};