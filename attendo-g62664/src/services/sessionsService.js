import { supabase } from "./supabase";

/**
 * Service de gestion des sessions d'examen
 */
export const sessionsService = {
  /**
   * Récupère toutes les sessions
   * @returns {Promise<Array>} Liste des sessions
   */
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

  /**
   * Récupère une session par son identifiant
   * @param {string} sessionId - Identifiant de la session
   * @returns {Promise<Object>} Données de la session
   */
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

  /**
   * Crée une nouvelle session
   * @param {string} label - Libellé de la session
   * @returns {Promise<Object>} Session créée
   */
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

  /**
   * Supprime une session
   * @param {string} sessionId - Identifiant de la session
   * @returns {Promise<boolean>} true si la suppression a réussi
   */
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
};