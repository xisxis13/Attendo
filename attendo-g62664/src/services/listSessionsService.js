import { supabase } from "./supabase";

export const listSessionsService = {
  async getAllSessions() {
    try {
      const { data, error } = await supabase
        .from('session')
        .select('*')

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sessions from database: ', error.message);
      return [];
    }
  },
  
  async getSessionById(sessionId) {
    try {
      const { data, error } = await supabase
        .from('session')
        .select('*')
        .eq('id', sessionId)
        .single();
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching session by ID:', error.message);
      return null;
    }
  },

  async createSession(sessionName) {
    try {
      if (sessionName === null) return null;

      const { data, error } = await supabase
        .from('session')
        .insert([{ label: sessionName }])
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