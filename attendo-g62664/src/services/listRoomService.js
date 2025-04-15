import { supabase } from "./supabase";

export const listRoomService = {
  async getAllRooms() {
    try {
      const { data, error } = await supabase
        .from('room')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  },

  async getRoomById(roomId) {
    try {
      const { data, error } = await supabase
        .from('room')
        .select('*')
        .eq('label', roomId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching room by ID:', error);
      return null;
    }
  },
};