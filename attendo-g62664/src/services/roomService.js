import { supabase } from "./supabase";

/**
 * Service de gestion des salles
 */
export const roomService = {
  /**
   * Récupère toutes les salles
   * @returns {Promise<Array>} Liste des salles
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('room')
        .select('*');

      if (error) throw new Error(`Error fetching rooms: ${error.message}`);

      return data || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Récupère une salle par son identifiant
   * @param {string} roomId - Identifiant de la salle
   * @returns {Promise<Object>} Données de la salle
   */
  async getById(roomId) {
    try {
      if (!roomId) throw new Error('Room ID is required');

      const { data, error } = await supabase
        .from('room')
        .select('*')
        .eq('label', roomId)
        .single();

      if (error) throw new Error(`Error fetching room (${roomId}): ${error.message}`);

      return data || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};