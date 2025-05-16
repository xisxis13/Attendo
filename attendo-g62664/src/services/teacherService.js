import { supabase } from "./supabase";

/**
 * Service de gestion des enseignants
 */
export const teacherService = {
  /**
   * Récupère tous les enseignants
   * @returns {Promise<Array>} Liste des enseignants
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('teacher')
        .select('*');

      if (error) throw new Error(`Error fetching teachers: ${error.message}`);

      return data || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * Récupère un enseignant par son identifiant
   * @param {string} teacherId - Identifiant de l'enseignant
   * @returns {Promise<Object>} Données de l'enseignant
   */
  async getById(teacherId) {
    try {
      if (!teacherId) throw new Error('Teacher ID is required');

      const { data, error } = await supabase
        .from('teacher')
        .select('*')
        .eq('acro', teacherId)
        .single();

      if (error) throw new Error(`Error fetching teacher (${teacherId}): ${error.message}`);

      return data || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * Récupère les superviseurs disponibles
   * @returns {Promise<Array>} Liste des enseignants disponibles comme superviseurs
   */
  async getAvailableSupervisors() {
    try {
      const { data: allTeachers, error: teacherError } = await supabase
        .from('teacher')
        .select('*');

      if (teacherError) throw new Error(`Error fetching teachers: ${teacherError.message}`);

      const { data: assignedSupervisors, error: supervisorError } = await supabase
        .from('examination_room')
        .select('supervisor')
        .not('supervisor', 'is', null);

      if (supervisorError) throw new Error(`Error fetching assigned supervisors: ${supervisorError.message}`);

      const assignedAcros = assignedSupervisors.map(item => item.supervisor);
      const availableTeachers = allTeachers.filter(teacher => !assignedAcros.includes(teacher.acro));

      return availableTeachers || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};