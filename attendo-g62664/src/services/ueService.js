import { supabase } from "./supabase";

/**
 * Service de gestion des Unités d'Enseignement (UE)
 */
export const ueService = {
   /**
   * Récupère toutes les UEs
   * @returns {Promise<Array>} Liste des UEs
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('ue')
        .select('*');

      if (error) throw new Error(`Error fetching UEs: ${error.message}`);
      return data || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Récupère les UEs disponibles pour une session
   * @param {string} sessionId - Identifiant de la session
   * @returns {Promise<Array>} Liste des UEs disponibles
   */
  async getAvailableForSession(sessionId) {
    try {
      if (!sessionId) throw new Error('Session ID is required');

      const { data: associatedUes, error: compoError } = await supabase
        .from('session_compo')
        .select('ue')
        .eq('session', sessionId);

      if (compoError) throw new Error(`Error fetching associating UEs: ${compoError.message}`);

      const associatedUeIds = associatedUes.map(item => item.ue);

      const { data: allUes, error: ueError } = await supabase
        .from('ue')
        .select('*')
        .not('ue', 'in', associatedUeIds.length ? `(${associatedUeIds.join(',')})` : '(0)');

        if (ueError) throw new Error(`Error fetching available UEs: ${ueError.message}`);

      return allUes || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Récupère les UEs associées à une session
   * @param {string} sessionId - Identifiant de la session
   * @returns {Promise<Array>} Liste des UEs associées
   */
  async getAssociatedToSession(sessionId) {
    try {
      if (!sessionId) throw new Error('Session ID is required');

      const { data: sessionCompos, error } = await supabase
        .from('session_compo')
        .select('ue (ue)')
        .eq('session', sessionId);

      if (error) throw new Error(`Error fetching associated UEs: ${error.message}`);

      return sessionCompos.map(compo => compo.ue) || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Associe une UE à une session
   * @param {string} ueId - Identifiant de l'UE
   * @param {string} sessionId - Identifiant de la session
   * @returns {Promise<Object>} Association créée
   */
  async associateToSession(ueId, sessionId) {
    try {
      if (!ueId || !sessionId) throw new Error('UE ID and Session ID are required');

      const { data, error } = await supabase
        .from('session_compo')
        .insert([{ ue: ueId, session: sessionId }])
        .select();

      if (error) throw new Error(`Error associating UE to session: ${error.message}`);

      return data[0] || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Dissocie une UE d'une session
   * @param {string} ueId - Identifiant de l'UE
   * @param {string} sessionId - Identifiant de la session
   * @returns {Promise<boolean>} true si la dissociation a réussi
   */
  async dissociateFromSession(ueId, sessionId) {
    try {
      if (!ueId || !sessionId) throw new Error('UE ID and Session ID are required');

      const { error } = await supabase
        .from('session_compo')
        .delete()
        .eq('ue', ueId)
        .eq('session', sessionId);

      if (error) throw new Error(`Error dissociating UE from session: ${error.message}`);

      return true;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Récupère l'ID de la composition de session
   * @param {string} ueId - Identifiant de l'UE
   * @param {string} sessionId - Identifiant de la session
   * @returns {Promise<string>} ID de la composition
   */
  async getSessionCompoId(ueId, sessionId) {
    try {
      if (!ueId || !sessionId) throw new Error('UE ID and Session ID are required');

      const { data, error } = await supabase
        .from('session_compo')
        .select('id')
        .eq('ue', ueId)
        .eq('session', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw new Error(`Error fetching session_compo ID: ${error.message}`);

      return data?.id || null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};