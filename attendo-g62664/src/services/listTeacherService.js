import { supabase } from "./supabase";

export const listTeacherService = {
  async getAllTeachers() {
    try {
      const { data, error } = await supabase
        .from('teacher')
        .select('*');

      if (error) throw error;
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
};