import { defineStore } from "pinia";
import { listRoomService } from "@/services/listRoomService";

export const useRoomStore = defineStore('rooms', {
  state: () => ({
    rooms: [],
    currentRoom: null,
  }),
  actions: {
    async getAllRooms() {
      this.rooms = await listRoomService.getAllRooms();
    },
    async getRoomById(roomId) {
      try {
        const data = await listRoomService.getRoomById(roomId);
        this.currentRoom = data;
        return data;
      } catch (error) {
        console.error('Error fetching room by ID:', error);
        return null;
      }
    },
  },
});