import { supabase } from "./supabase";

export const listUeService = {
  async getAllUe() {
    try {
      const { data, error } = await supabase
        .from('ue')
        .select('*');
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching ues from database:', error.message);
      return [];
    }
  },

  async getAvailabledUe(sessionId) {
    try {
      const allUes = await this.getAllUe();
      if (!allUes || allUes.length === 0) {
        return []; 
      }

      const { data: associatedUes, error: compoError } = await supabase
        .from('session_compo')
        .select('ue')
        .eq('session', sessionId);

      if (compoError) throw compoError;

      const associatedUeIds = associatedUes.map(item => item.ue);
      const availableUes = allUes.filter(ue => !associatedUeIds.includes(ue.ue));

      return availableUes;
    } catch (error) {
      console.error('Error fetching not associated ues:', error.message);
      return [];
    }
  },

  async isAssociatedToSession(ue, sessionId) {
    try {
      const { data, error } = await supabase
        .from('session_compo')
        .select('*')
        .eq('ue', ue)
        .eq('session', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data !== null;
    } catch (error) {
      console.error('Error checking if ue is associated with session:', error.message);
      return false;
    }
  },

  async fetchAssociatedUe(sessionId) {
    try {
      const { data: sessionCompos, error } = await supabase
      .from('session_compo')
      .select('ue')
      .eq('session', sessionId);

      if (error) throw error;
      
      if (!sessionCompos || sessionCompos.length === 0) {
      return [];
      }
      
      const ueIds = sessionCompos.map(compo => compo.ue);
      
      const { data: associatedUes, error: ueError } = await supabase
        .from('ue')
        .select('*')
        .in('ue', ueIds);
      
      if (ueError) throw ueError;
      
      return associatedUes || [];
    } catch (error) {
      console.error('Error fetching associated UEs:', error.message);
      return [];
    }
  },

  async associateUeToSession(ue, sessionId) {
    try {
      if (!ue || !sessionId) return null;

      const { data, error } = await supabase
        .from('session_compo')
        .insert([{ ue: ue, session: sessionId }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error associating ue to session:', error.message);
      return null;
    }
  },

  async deleteAssociation(ue, sessionId) {
    try {
      const { error } = await supabase
        .from('session_compo')
        .delete()
        .eq('ue', ue)
        .eq('session', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting association:', error.message);
      return false;
    }
  },
};