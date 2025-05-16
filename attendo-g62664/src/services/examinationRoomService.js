import { supabase } from "./supabase";

/**
 * Service de gestion des salles d'examen
 */
export const examinationRoomService = {
  /**
   * Récupère toutes les salles d'examen pour une épreuve
   * @param {string} eventId - Identifiant de l'épreuve
   * @returns {Promise<Array>} Liste des salles avec leurs détails
   */
  async getAllForEvent(eventId) {
    try {
      if (!eventId) throw new Error("Event ID is required.");
      const { data, error } = await supabase
        .from('examination_room')
        .select(`
          id,
          room (label, capacity),
          supervisor (acro, names),
          examination (id, student (student_id, firstname, lastname))
        `)
        .eq('event', eventId);
      if (error) throw new Error(`Error fetching rooms for event ${eventId}: ${error.message}`);
      return data ?? [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Récupère une salle d'examen spécifique pour une épreuve
   * @param {string} eventId - Identifiant de l'épreuve
   * @param {string} roomId - Identifiant de la salle
   * @returns {Promise<Object>} Détails de la salle
   */
  async getByEventAndRoom(eventId, roomId) {
    try {
      if (!eventId || !roomId) throw new Error("Event ID and Room ID are required.");
      const { data, error } = await supabase
        .from('examination_room')
        .select(`
          id,
          room (label, capacity),
          supervisor (acro, names),
          examination (id, student (student_id, firstname, lastname))
        `)
        .eq('event', eventId)
        .eq('room', roomId)
        .single();
      if (error) throw new Error(`Error fetching room ${roomId} for event ${eventId}: ${error.message}`);
      return data ?? null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Récupère les salles disponibles pour une épreuve
   * @param {string} eventId - Identifiant de l'épreuve
   * @returns {Promise<Array>} Liste des salles disponibles
   */
  async getAvailableRoomsForEvent(eventId) {
    try {
      if (!eventId) throw new Error("Event ID is required.");
      const { data: assignedRooms, error: assignedError } = await supabase
        .from('examination_room')
        .select('room')
        .eq('event', eventId);
      if (assignedError) throw new Error(`Error fetching assigned rooms: ${assignedError.message}`);

      const assignedRoomIds = assignedRooms.map(item => item.room);
      const { data: allRooms, error: roomError } = await supabase
        .from('room')
        .select('*')
        .not('label', 'in', assignedRoomIds.length ? `(${assignedRoomIds.join(',')})` : '(0)');
      if (roomError) throw new Error(`Error fetching available rooms: ${roomError.message}`);

      return allRooms ?? [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Associe une salle à une épreuve
   * @param {string} eventId - Identifiant de l'épreuve
   * @param {string} roomId - Identifiant de la salle
   * @returns {Promise<Object>} Association créée
   */
  async associateRoomToEvent(eventId, roomId) {
    try {
      if (!eventId || !roomId) throw new Error("Event ID and Room ID are required.");
      const { data, error } = await supabase
        .from('examination_room')
        .insert([{ event: eventId, room: roomId }])
        .select();
      if (error) throw new Error(`Error associating room to event: ${error.message}`);
      return data[0] ?? null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Dissocie une salle d'une épreuve
   * @param {string} eventId - Identifiant de l'épreuve
   * @param {string} roomId - Identifiant de la salle
   * @returns {Promise<boolean>} true si la dissociation a réussi
   */
  async dissociateRoomFromEvent(eventId, roomId) {
    try {
      if (!eventId || !roomId) throw new Error("Event ID and Room ID are required.");
      const { error } = await supabase
        .from('examination_room')
        .delete()
        .eq('event', eventId)
        .eq('room', roomId);
      if (error) throw new Error(`Error dissociating room from event: ${error.message}`);
      return true;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Définit un superviseur pour une salle d'examen
   * @param {string} examinationRoomId - Identifiant de la salle d'examen
   * @param {string} supervisorAcro - Acronyme du superviseur
   * @returns {Promise<Object>} Salle mise à jour
   */
  async setSupervisor(examinationRoomId, supervisorAcro) {
    try {
      if (!examinationRoomId || !supervisorAcro) throw new Error("Examination Room ID and Supervisor are required.");
      const { data, error } = await supabase
        .from('examination_room')
        .update({ supervisor: supervisorAcro })
        .eq('id', examinationRoomId)
        .select();
      if (error) throw new Error(`Error setting supervisor: ${error.message}`);
      return data[0] ?? null;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  /**
   * Récupère le nombre de présences dans une salle
   * @param {string} examinationRoomId - Identifiant de la salle d'examen
   * @returns {Promise<number>} Nombre de présences
   */
  async getPresenceCountForRoom(examinationRoomId) {
    try {
      if (!examinationRoomId) {
        console.error('Examination room ID is missing');
        return 0;
      }

      const { count, error } = await supabase
        .from('examination')
        .select('*', { count: 'exact', head: true })
        .eq('examination_room', examinationRoomId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error fetching presence count:', error.message);
      return 0;
    }
  },
};