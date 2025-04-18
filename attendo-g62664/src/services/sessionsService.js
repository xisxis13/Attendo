import { supabase } from "./supabase";

export const sessionsService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('session')
        .select('*');

      if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);

      return data || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async getById(sessionId) {
    try {
      if (!sessionId) throw new Error('Session ID is required');

      const { data, error } = await supabase
        .from('session')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw new Error(`Error fetching session with ID (${sessionId}): ${error.message}`);

      return data || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async create(label) {
    try {
      if (!label) throw new Error('Session label is required');

      const { data, error } = await supabase
        .from('session')
        .insert([{ label }])
        .select();

      if (error) throw new Error(`Error creating session: ${error.message}`);
      return data[0] || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async delete(sessionId) {
    try {
      if (!sessionId) throw new Error(`Session ID is required`);

      const { error } = await supabase
        .from('session')
        .delete()
        .eq('id', sessionId);

        if (error) throw new Error(`Error deleting session with ID (${sessionId}): ${error.message}`);
        return true;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  // async getAllSessions() {
  //   try {
  //     const { data, error } = await supabase
  //       .from('session')
  //       .select('*')

  //     if (error) throw error;
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching sessions from database: ', error.message);
  //     return [];
  //   }
  // },
  
  // async getSessionById(sessionId) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('session')
  //       .select('*')
  //       .eq('id', sessionId)
  //       .single();
  
  //     if (error) throw error;
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching session by ID:', error.message);
  //     return null;
  //   }
  // },

  // async createSession(sessionName) {
  //   try {
  //     if (sessionName === null) return null;

  //     const { data, error } = await supabase
  //       .from('session')
  //       .insert([{ label: sessionName }])
  //       .select();

  //     if (error) throw error;
  //     return data[0];
  //   } catch (error) {
  //     console.error('Error creating new session: ', error.message);
  //     return null;
  //   }
  // },

  // async deleteSession(sessionId) {
  //   try {
  //     const { error } = await supabase
  //       .from('session')
  //       .delete()
  //       .eq('id', sessionId);

  //     if (error) throw error;
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting session: ', error.message);
  //     return false;
  //   }
  // }
}