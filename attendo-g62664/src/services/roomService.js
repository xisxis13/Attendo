import { supabase } from "./supabase";

export const roomService = {
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

  // async getAllRooms() {
  //   try {
  //     const { data, error } = await supabase
  //       .from('room')
  //       .select('*');

  //     if (error) throw error;
  //     return data || [];
  //   } catch (error) {
  //     console.error('Error fetching rooms:', error);
  //     return [];
  //   }
  // },

  // async getRoomById(roomId) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('room')
  //       .select('*')
  //       .eq('label', roomId)
  //       .single();

  //     if (error) throw error;
  //     return data || null;
  //   } catch (error) {
  //     console.error('Error fetching room by ID:', error);
  //     return null;
  //   }
  // },
};