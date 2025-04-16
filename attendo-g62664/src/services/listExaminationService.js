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

  async getExaminationById(eventId, roomId) {
    try {
      const { data, error } = await supabase
        .from('examination_room')
        .select(`
          id,
          room:room(label, capacity),
          supervisor:supervisor(acro),
          examination(id, student)
        `)
        .eq('event', eventId)
        .eq('room', roomId);
  
      if (error) throw error;
  
      console.log('Examination room data:', data);
      return data[0] || null;
    } catch (error) {
      console.error('Error fetching examination room info:', error);
      return null;
    }
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

  async setSupervisor(examinationId, supervisor) {
    try {
      if (!examinationId || !supervisor || !supervisor.acro) {
        console.error('Invalid examinationId or supervisor provided');
        return { success: false, error: 'Invalid examinationId or supervisor provided' };
      }
  
      const { data, error } = await supabase
        .from('examination_room')
        .update({ supervisor: supervisor.acro })
        .eq('id', examinationId)
        .select();
  
      if (error) throw error;
  
      return { success: true, data: data[0] || null };
    } catch (error) {
      console.error('Error setting supervisor to examination:', error.message);
      return { success: false, error: error.message };
    }
  },

  async getAllTeachers() {
    try {
      const { data, error } = await supabase
        .from('teacher')
        .select('*');

      if (error) throw error;
      console.log('Teachers : ', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }
  },

  async getRoomById(teacherId) {
    try {
      const { data, error } = await supabase
        .from('teacher')
        .select('*')
        .eq('acro', teacherId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching teacher by ID:', error);
      return null;
    }
  },

  async getAvailableTeacher() {
    try {
      const { data: allTeachers, error: teacherError } = await supabase
        .from('teacher')
        .select('*');
  
      if (teacherError) throw teacherError;
  
      const { data: assignedSupervisors, error: supervisorError } = await supabase
        .from('examination_room')
        .select('supervisor')
        .not('supervisor', 'is', null);
  
      if (supervisorError) throw supervisorError;
  
      const assignedAcros = assignedSupervisors.map(item => item.supervisor);
  
      const availableTeachers = allTeachers.filter(
        teacher => !assignedAcros.includes(teacher.acro)
      );
  
      console.log('Available teachers:', availableTeachers);
      return availableTeachers || [];
    } catch (error) {
      console.error('Error fetching available teachers:', error);
      return [];
    }
  },
};