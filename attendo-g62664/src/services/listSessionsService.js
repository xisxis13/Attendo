import { supabase } from "./supabase";

export const listSessionsService = {
  async getAllSessions() {
    try {
      const { data, error } = await supabase
        .from('session')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sessions from database: ', error.message);
      return [];
    }
  },

  async createSession(sessionData) {
    try {
      const { data, error } = await supabase
        .from('session')
        .insert([sessionData]) // Exemple : { id: "...", label: "..." }
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating new session: ', error.message);
      return null;
    }
  },

  async deleteSession(sessionId) {
    try {
      const { error } = await supabase
        .from('session')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting session: ', error.message);
      return false;
    }
  }
}