import { supabase } from "./supabase";

export const listExaminationService = {
  async getAllExaminationRoomByEvent(eventId) {
    try {
      const { data, error } = await supabase
        .from('examination_room')
        .select(`
          id,
          room:room(label, capacity),
          supervisor:supervisor(acro),
          examination(id, student)
        `)
        .eq('event', eventId);
  
      if (error) throw error;
  
      console.log('Examination rooms data:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching examination rooms info:', error);
      return [];
    }
  },

  async getExaminationById(examinationId) {

  },

  async createExamination(eventId, roomId) {
    try {
      if (eventId === null || roomId === null) return null;

      const { data, error } = await supabase
        .from('examination_room')
        .insert([{ event: eventId, room: roomId }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating new examination: ', error.message);
      return null;
    }
  },

  async dissociateRoomFromExamination(eventId, roomId) {
    try {
      if (!eventId || !roomId) {
        console.error('No examination room provided');
        return { success: false, error: 'No examination room provided' };
      }

      const { error } = await supabase
        .from('examination_room')
        .delete()
        .eq('event', eventId)
        .eq('room', roomId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error dissociating room from examination:', error.message);
      return { success: false, error: error.message };
    }
  },

  async getExaminationStudents(examinationId) {

  },

  async setExaminator(roomId, teacherId) {

  },

  async addExaminatorToExamination(examinationId, teacherId) {

  },
};