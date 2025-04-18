import { supabase } from "./supabase";

export const studentService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('student')
        .select('*');

      if (error) throw new Error(`Error fetching students: ${error.message}`);

      return data || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async getForUe(ueId) {
    try {
      if (!ueId) throw new Error('UE ID is required');

      const { data, error } = await supabase
        .from('pae')
        .select('student (student_id, firstname, lastname)')
        .eq('ue', ueId);

      if (error) throw new Error(`Error fetching students for UE (${ueId}): ${error.message}`);

      return data.map(item => item.student) || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async getPresentForExaminationRoom(examinationRoomId) {
    try {
      if (!examinationRoomId) throw new Error('Examination Room ID is required');

      const { data, error } = await supabase
        .from('examination')
        .select('student (student_id, firstname, lastname)')
        .eq('examination_room', examinationRoomId);

      if (error) throw new Error(`Error fetching present students: ${error.message}`);

      return data.map(item => item.student) || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  async togglePresence(studentId, examinationRoomId, eventId) {
    try {
      if (!studentId || !examinationRoomId || !eventId) throw new Error("Student ID, Examination Room ID, and Event ID are required.");

      // Vérifier si l'étudiant est déjà marqué présent pour cet événement
      const { data: existingExam, error: existingError } = await supabase
        .from('examination')
        .select(`
          id,
          examination_room (
            id,
            event
          )
        `)
        .eq('student', studentId)
        .eq('examination_room.event', eventId);

      if (existingError) throw new Error(`Error checking student presence: ${existingError.message}`);

      console.log('Existing exams for student', studentId, ':', existingExam);

      // Vérifier si l'étudiant est présent dans une autre salle pour cet événement
      const isPresentInOtherRoom = existingExam.some(exam => 
        exam.examination_room && exam.examination_room.id !== examinationRoomId
      );
      if (isPresentInOtherRoom) {
        throw new Error('Student is already marked present in another room for this event');
      }

      // Vérifier la capacité de la salle
      const { data: roomData, error: roomError } = await supabase
        .from('examination_room')
        .select('room (capacity)')
        .eq('id', examinationRoomId)
        .single();

      if (roomError) throw new Error(`Error fetching room capacity: ${roomError.message}`);

      const { data: currentExams, error: countError } = await supabase
        .from('examination')
        .select('id')
        .eq('examination_room', examinationRoomId);

      if (countError) throw new Error(`Error counting present students: ${countError.message}`);

      if (currentExams.length >= roomData.room.capacity) {
        throw new Error('Room capacity has been reached');
      }

      // Vérifier si l'étudiant est déjà marqué présent dans cette salle
      const { data: existingPresence, error: presenceError } = await supabase
        .from('examination')
        .select('id')
        .eq('student', studentId)
        .eq('examination_room', examinationRoomId)
        .single();

      if (presenceError && presenceError.code !== 'PGRST116') {
        throw new Error(`Error checking presence: ${presenceError.message}`);
      }

      if (existingPresence) {
        // Supprimer la présence
        const { error: deleteError } = await supabase
          .from('examination')
          .delete()
          .eq('student', studentId)
          .eq('examination_room', examinationRoomId);

        if (deleteError) throw new Error(`Error removing presence: ${deleteError.message}`);
        return false;
      } else {
        // Ajouter la présence
        const { error: insertError } = await supabase
          .from('examination')
          .insert([{ student: studentId, examination_room: examinationRoomId }]);

        if (insertError) throw new Error(`Error adding presence: ${insertError.message}`);
        return true;
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};