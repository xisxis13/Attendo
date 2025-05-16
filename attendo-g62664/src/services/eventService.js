import { supabase } from "./supabase";
import { ueService } from "./ueService";

/**
 * Service de gestion des épreuves d'examen
 */
export const eventService = {
  /**
   * Récuèpre toutes les épreuves pour une UE et une session données
   * @param {String} ueId - Identifiant de l'UE
   * @param {String} sessionId - Identifiant de la session
   * @returns {Promise<Array>} Liste des épreuves
   */
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

  /**
   * Récupère une épreuve par son identifiant
   * @param {string} eventId - Identifiant de l'épreuve
   * @returns {Promise<Object>} Données de l'épreuve
   */
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

  /**
   * Crée une nouvelle épreuve
   * @param {Object} eventData - Données de l'épreuve (session_compo, label requis)
   * @returns {Promise<Object>} Épreuve créé
   */
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

  /**
   * Supprime une épreuve
   * @param {string} eventId - Identifiant de l'épreuve
   * @returns {Promise<boolean>} true si la suppression a réussi
   */
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
};